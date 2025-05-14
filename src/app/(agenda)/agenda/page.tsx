"use client"
import React, { useEffect, useState } from 'react';
import * as X from "@/components/xcomponents";
import { fetchEventos } from './actions';
import { useSession } from 'next-auth/react';
import SimpleSkeleton from '@/components/loading/simple_skeleton';
export function CalHeader({
    sem = "Sábado",
    dia = "2",
    current = false,
    mes,
    ano,
    date
}: {
    sem?: string;
    dia?: string;
    current?: boolean;
    mes?: string;
    ano?: string | number;
    date?: Date;
}) {
    // Se não receber mes/ano, pega o mês/ano atual
    const now = new Date();
    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const mesLabel = mes ?? monthNames[now.getMonth()];
    const anoLabel = ano ?? now.getFullYear();

    // Usa o parâmetro date se fornecido, senão monta a data a partir dos props
    const eventDate = date
        ? date
        : new Date(
            typeof anoLabel === "number" ? anoLabel : Number(anoLabel),
            monthNames.indexOf(mesLabel),
            Number(dia)
        );
    // Gera string de data local no formato yyyy-mm-ddTHH:MM (sem segundos, local)
    const pad = (n: number) => n.toString().padStart(2, '0');
    // Zera a hora, minuto, segundo e milissegundo
    eventDate.setHours(0, 0, 0, 0);
    const dataStr = `${eventDate.getFullYear()}-${pad(eventDate.getMonth() + 1)}-${pad(eventDate.getDate())}T${pad(eventDate.getHours())}:${pad(eventDate.getMinutes())}`;

    return (
        <div className={`flex flex-row sticky top-32 xl:top-48 bg-(--background-color) w-full items-center p-4 rounded-lg border-2 border-(--secondary-color) gap-4 ${current && "bg-(--secondary-color)"}`}>
            <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-row items-baseline gap-2">
                    <p className="font-light text-xl break-words">{sem} |</p>
                    <span className="text-base text-gray-500">{mesLabel} {anoLabel}</span>
                </div>
                <p className="font-bold text-4xl break-words">{dia}</p>
            </div>
            <a
                href={`/criar-evento?data=${encodeURIComponent(dataStr)}`}
                className="font-semibold text-lg min-w-max hover:underline"
            >
                + Evento
            </a>
        </div>
    );
}
export function CalLink({
    hora = "14:30",
    id = "",
    title = "#AA444",
    current = false
}: {
    hora?: string;
    id?: string;
    title?: string;
    current?: boolean;
}) {
    return (
        <a href='/evento' className='group flex flex-row gap-4  p-4 border-2 border-(--primary-color) rounded-lg items-center text-(--primary-color) bg-transparent cursor-pointer hover:bg-(--primary-color) hover:text-(--secondary-color)'>
            <div className='flex flex-col gap-2 w-full'>
                <p className='font-semibold text-xl break-words wrap text-wrap  max-w-max'>{hora}</p>
                <p className='font-semibold text-4xl break-words text-wrap  max-w-max'>{title}</p>
            </div>
            <div>
                <img src="/images/icons/open_in_new.svg" alt="aa" className='w-5 h-5 group-hover:invert' />
            </div>
        </a>
    );
}

const AgendaPage = () => {

    const [eventos, setEventos] = useState<any[]>([]);
    const [filters, setFilters] = useState<Record<string, any>>({}); // State to manage filters
    const [order, setOrder] = useState<Record<string, boolean>>({ "Data": false }); // State to manage filters

    const { data: session, status } = useSession();
    const user = session?.user;

    const [dataInicio, setDataInicio] = useState<Date>(new Date());
    const [loading, setLoading] = useState<boolean>(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchEventos(filters, order, dataInicio, Number(user?.id));
            setEventos(data);
            console.log(data);
        } catch (err) {
            console.error("Erro ao buscar Eventos:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, order, dataInicio]);

    useEffect(() => {
        const interval = setInterval(() => {
            loadData();
        }, 30000);
        return () => clearInterval(interval);
    }, [filters, order]);

    return (
        <X.Container className="w-full">
            <h2 className="text-xl font-semibold mb-4">Agenda</h2>
            <X.Divider />

            {/* Filtros */}
            <div className='flex flex-col gap-4 '>

                <div className="flex flex-row gap-4">
                    <X.Button onClick={loadData} className="w-max group">
                        <img
                            src="/images/icons/sync.svg"
                            alt="Refresh"
                            className={`w-6 h-6  group-hover:animate-spin ${status === "loading" || loading ? "animate-spin" : ""}`}
                        />
                    </X.Button>
                    <X.FilterBox
                        filters={[
                            { label: "Titulo", value: "evento_titulo", type: "text" },
                            { label: "Descrição", value: "evento_descricao", type: "text" },
                        ]}
                        onFilterChange={(newFilters: Record<string, any>) => {
                            setTimeout(() => setFilters(newFilters), 0);
                        }}
                        label="Filtros"
                    />
                    <X.SortBox
                        options={["Data", "Titulo"]}
                        label='Ordenar'
                        onSortChange={(selectedOption, isInverted) => { setTimeout(() => setOrder({ [selectedOption]: isInverted }), 0); }}
                    ></X.SortBox>
                </div>
                <div className="flex flex-row gap-4">
                    <X.DateTimePicker showDayAdvanceButtons hide_label className='w-full' name='Data Inicio' value={dataInicio} onChange={(date) => { setDataInicio(new Date(date)) }} showTimeSelect></X.DateTimePicker>

                </div>
            </div>
            <X.Divider />
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 w-full'>
                {
                    // Gera os dias a partir de dataInicio
                    Array.from({ length: 5 }).map((_, i) => {
                        const day = new Date(dataInicio);
                        day.setDate(dataInicio.getDate() + i); // Começa em dataInicio e vai até +4 dias
                        const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
                        const sem = diasSemana[day.getDay()];
                        const dia = day.getDate().toString();

                        return (
                            <div className='flex flex-col gap-8' key={i}>
                                <CalHeader
                                    sem={sem}
                                    dia={dia}
                                    current={day.toDateString() === new Date().toDateString()}
                                    mes={day.toLocaleString('pt-pt', { month: 'long' })}
                                    ano={day.getFullYear()}
                                    date={day}
                                />
                                {/* Loading skeleton while fetching */}
                                {loading ? (
                                    <SimpleSkeleton />
                                ) : (
                                    (() => {
                                        const eventosDoDia = eventos
                                            .filter(ev => {
                                                const evDate = new Date(ev.data);
                                                return (
                                                    evDate.getFullYear() === day.getFullYear() &&
                                                    evDate.getMonth() === day.getMonth() &&
                                                    evDate.getDate() === day.getDate()
                                                );
                                            });
                                        if (eventosDoDia.length === 0) {
                                            return <span className="text-gray-400 text-center">Nenhum evento para este dia.</span>;
                                        }
                                        return eventosDoDia.map(ev => {
                                            const evDate = new Date(ev.data);
                                            const hora = evDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                                            return (
                                                <CalLink
                                                    key={ev.id}
                                                    hora={hora}
                                                    title={ev.titulo}
                                                    id={ev.id}
                                                />
                                            );
                                        });
                                    })()
                                )}
                            </div>
                        )
                    })
                }

            </div>
        </X.Container>
    );
};

export default AgendaPage;