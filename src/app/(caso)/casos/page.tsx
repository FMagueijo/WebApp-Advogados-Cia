"use client";

import * as X from "@/components/xcomponents";
import { useCallback, useEffect, useState } from "react";
import { fetchCasos } from "./actions";
import RegistrarHorasForm from "../caso/registar-horas/page";
import { useSession } from "next-auth/react";

export default function ListarCasos() {
  const [registarHoras, setRegistarHoras] = useState(false);
  const [casoAtual, setCasoAtual] = useState(-1);
  const [casos, setCasos] = useState<any[]>([]);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [order, setOrder] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();
  
  const user = session?.user;

  const loadData = useCallback(async () => {
    try {
      const data = await fetchCasos(filters, order);
      setCasos(data);
    } catch (err) {
      console.error("Erro ao carregar casos:", err);
    } finally {
      setLoading(false);
    }
  }, [filters, order]);

  useEffect(() => {
    // Initial load
    loadData();

    // Set up interval for auto-refresh
    const intervalId = setInterval(loadData, 30000); // 30 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [loadData]);


  return (
    <div className="w-full">
      <div className="flex flex-col gap-8">
        <X.Container className="w-full">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Lista Casos</p>
          </div>
          <X.Divider />
          {user?.role == 2 && <X.ButtonLink className="w-max" href="/criar-caso">Criar Caso</X.ButtonLink>}
          <div className="flex flex-row gap-4 flex-wrap w-full overflow-x-auto">
            <X.Button onClick={loadData} className="w-max group">
              <img
                src="/images/icons/sync.svg"
                alt="Refresh"
                className="w-6 h-6 group-hover:animate-spin"
              />
            </X.Button>
            <X.SortBox
              label="Ordenar"
              options={["ID", "Processo", "Resumo", "Estado"]}
              onSortChange={(selectedOption, isInverted) => {
                setTimeout(() => setOrder({ [selectedOption]: isInverted }), 0);
              }}
            />
            <X.FilterBox
              filters={[
                { label: "ID", value: "ID", type: "number" },
                { label: "Processo", value: "Processo", type: "text" },
                { label: "Resumo", value: "Resumo", type: "text" },
                { label: "Estado", value: "Estado", type: "combobox", options: ["Aberto", "Fechado", "Terminado"] },
              ]}
              onFilterChange={(newFilters) => {
                setTimeout(() => setFilters(newFilters), 0);
              }}
              label="Filtros"
            />
          </div>
          <X.Divider />

          {/* Tabela */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b-2 border-[var(--secondary-color)]">
                  <th className="p-4">ID / Processo</th>
                  <th className="p-4">Assunto</th>
                  <th className="p-4">Criado por</th>
                  <th className="p-4">Estado</th>
                  <th className="w-[100px] px-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {casos.map((caso) => (
                  <tr key={caso.id} className="border-b border-[var(--secondary-color)]">
                    <td className="p-4">
                      <X.Link className="inline-flex gap-2 hover:text-[var(--primary-color)]"
                        href={`/caso/${caso.id}`}>
                        <span>[{caso.id}]</span>
                        <span>{caso.processo}</span>
                      </X.Link>
                    </td>
                    <td className="p-4">
                      <X.DataField className="hover:bg-[var(--secondary-color)]/5">
                        {caso.assunto}
                      </X.DataField>
                    </td>
                    <td className="p-4">
                      <X.Link href={`/perfil-terceiro/${caso.criadoPorId}`}>
                        {caso.criadoPor}
                      </X.Link>


                    </td>
                    <td className="p-4">
                      <X.DataField
                        className="rounded-lg p-2"
                        colorOverride={
                          caso.estado === "Aberto" ? "--open-color" :
                            caso.estado === "Fechado" ? "--error-color" :
                              "--success-color"
                        }
                      >
                        {caso.estado}
                      </X.DataField>
                    </td>
                    <td className="px-2 whitespace-nowrap">
                      <X.Button
                        className="group h-full"
                        onClick={() => {
                          setRegistarHoras(true);
                          setCasoAtual(caso.id);
                        }}
                      >
                        <span className="text-sm text-[var(--primary-color)] group-hover:text-[var(--secondary-color)] transition-colors">
                          Registar Horas
                        </span>
                      </X.Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <X.Popup title="Registar Horas" isOpen={registarHoras} onClose={() => setRegistarHoras(false)}>
              <RegistrarHorasForm
                casoId={casoAtual}
                onClose={() => setRegistarHoras(false)}
              />

            </X.Popup>

            {casos.length === 0 && <p className="p-4">Nenhum caso encontrado</p>}
          </div>
        </X.Container>
      </div>
    </div>
  );
}