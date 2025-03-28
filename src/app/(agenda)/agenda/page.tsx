"use client"
import React from 'react';
import * as X from "@/components/xcomponents";

export function CalHeader({
    sem = "Sábado",
    dia = "2",
    current = false
}: {
    sem?: string;
    dia?: string;
    current?: boolean;
}) {
    const baseStyles = "";

    return (
        <div className={`flex flex-row w-full items-center p-4 rounded-lg border-2 border-(--secondary-color) gap-4 ${current && "bg-(--secondary-color)"}`}>
            <div className={`flex flex-col gap-2 w-full`}>
                <p className='font-light text-xl break-words'>{sem}</p>
                <p className='font-bold text-4xl break-words'>{dia}</p>
            </div>
            <a href="" className='font-semibold text-lg min-w-max hover:underline'>+ Evento</a>
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
        <a className='group flex flex-row gap-4  p-4 border-2 border-(--primary-color) rounded-lg items-center text-(--primary-color) bg-transparent cursor-pointer hover:bg-(--primary-color) hover:text-(--secondary-color)'>
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
    return (
        <X.Container className="w-full">
            <h2 className="text-xl font-semibold mb-4">Agenda</h2>
            <X.Divider />

            {/* Filtros */}
            <div className="flex flex-row gap-4 mb-4">
                <X.Dropdown
                    label="Filtros"
                    options={["Fechado", "Terminado"]}
                    onSelect={(selectedOption) => console.log("Opção selecionada:", selectedOption)}
                />
                <X.Dropdown
                    label="Ordenar"
                    options={["Fechado", "Terminado"]}
                    onSelect={(selectedOption) => console.log("Opção selecionada:", selectedOption)}
                />
            </div>
            <X.Divider />
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 w-full'>
                {/* Column 1 */}
                <div className='flex flex-col gap-8'>
                    <CalHeader current />
                    <CalLink title='#AAA43 Ida a Tribunal' />
                </div>

                {/* Column 2 */}
                <div className='flex flex-col gap-8'>
                    <CalHeader />
                </div>

                {/* Column 3 */}
                <div className='flex flex-col gap-8'>
                    <CalHeader />
                    <CalLink title='Site em Manutenção' />
                    <CalLink title='Reuniao Solicitador Coimbra' />
                </div>

                {/* Column 4 */}
                <div className='flex flex-col gap-8'>
                    <CalHeader />
                    <CalLink title='#AAA17 Destacamento' />
                    <CalLink title='#AAA17 Reuniao' />
                    <CalLink title='#AAA17 Ida a CM Castelo Branco' />
                </div>

                {/* Column 5 */}
                <div className='flex flex-col gap-8'>
                    <CalHeader />
                </div>
            </div>
        </X.Container>
    );
};

export default AgendaPage;