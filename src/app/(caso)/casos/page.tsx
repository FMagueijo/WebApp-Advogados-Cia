"use client";

import * as X from "@/components/xcomponents";
import { useEffect, useState } from "react";
import { fetchCasos } from "./actions";
import RegistrarHorasForm from "../caso/registar-horas/page";

export default function ListarCasos() {
  const [registarHoras, setRegistarHoras] = useState(false);
  const [casoAtual, setCasoAtual] = useState(-1);
  const [casos, setCasos] = useState<any[]>([]);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [order, setOrder] = useState<Record<string, boolean>>({});

  const loadData = async () => {
    try {
      const data = await fetchCasos(filters, order);
      setCasos(data);
    } catch (err) {
      console.error("Erro ao carregar casos:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters, order]);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-8">
        <X.Container className="w-full">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Lista Casos</p>
          </div>
          <X.Divider />
          <X.ButtonLink className="w-max" href="/criar-caso">Criar Caso</X.ButtonLink>

          {/* Filtros e Ordenação */}
          <div className="flex gap-4 flex-wrap">
            <X.Dropdown
              label="Filtrar Por Estado"
              options={["Aberto", "Fechado", "Terminado"]}
              onSelect={(estado) => setFilters({ estado })}
            />
            <X.SortBox
              label="Ordenar Por"
              options={["ID", "Processo", "Assunto"]}
              onSortChange={(campo, inverso) => setOrder({ [campo]: inverso })}
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
                  <th className="p-4">Cliente</th>
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
                      <X.Link href={`/perfil-terceiro/${caso.user.id}`}>
                        {caso.user.nome}
                      </X.Link>


                    </td>
                    <td className="p-4">{caso.assunto}</td>
                    <td className="p-4">{caso.criadoPor}</td>
                    <td className="p-4">{caso.cliente}</td>
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

            {registarHoras && (
              <RegistrarHorasForm
                casoId={casoAtual}
                isOpen={registarHoras}
                onClose={() => setRegistarHoras(false)}
              />
            )}

            {casos.length === 0 && <p className="p-4">Nenhum caso encontrado</p>}
          </div>
        </X.Container>
      </div>
    </div>
  );
}