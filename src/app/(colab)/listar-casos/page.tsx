"use client";

import * as X from "@/components/xcomponents";
import { useState } from "react";

export default function ListarCasos() {
  const [casos, setCasos] = useState([
    { id: "SI", processo: "#AAA3I", assunto: "Destacamento", criadoPor: "[4] Telmo Maia", estado: "Aberto" },
    { id: "17", processo: "#AAA7I", assunto: "Divorcio", criadoPor: "[4] Telmo Maia", estado: "Aberto" },
    { id: "19", processo: "#AAAI9", assunto: "Protecao - Homicidio", criadoPor: "[4] Telmo Maia", estado: "Fechado" },
    { id: "4", processo: "#AAAA4", assunto: "Furto Leve", criadoPor: "[4] Telmo Maia", estado: "Terminado" },
  ]);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-8">
        <X.Container className="w-full">
          {/* Cabeçalho */}
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Lista Casos</p>
          </div>
          <X.Divider />
          <X.ButtonLink className="w-3/12">Criar Caso</X.ButtonLink>

          {/* Filtros */}
          <div className="flex gap-4">
            <X.Dropdown
              label="Filtrar Por"
              options={["Aberto", "Fechado", "Terminado"]}
              onSelect={(selectedOption) => console.log("Filtrar por:", selectedOption)}
            />
            <X.Dropdown
              label="Ordenar"
              options={["ID", "Processo", "Assunto"]}
              onSelect={(selectedOption) => console.log("Ordenar por:", selectedOption)}
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
                </tr>
              </thead>
              <tbody>
                {casos.map((caso) => (
                  <tr key={caso.id} className="border-b border-[var(--secondary-color)]">
                    <td className="p-4">
                      <X.Link className="inline-flex gap-2 hover:text-[var(--primary-color)]">
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
                      <X.Link className="hover:text-[var(--primary-color)]">
                        {caso.criadoPor}
                      </X.Link>
                    </td>

                    <td className="p-4">
                      <X.DataField
                        className="rounded-lg p-2"
                        colorOverride={
                          caso.estado === "Aberto"
                            ? "--open-color"
                            : caso.estado === "Fechado"
                            ? "--error-color"
                            : "--success-color"
                        }
                      >
                        {caso.estado}
                      </X.DataField>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </X.Container>
      </div>
    </div>
  );
}