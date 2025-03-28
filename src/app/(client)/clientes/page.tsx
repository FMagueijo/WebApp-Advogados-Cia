"use client";

import * as X from "@/components/xcomponents";
import { useState } from "react"; // Import useState para gerenciar o estado

export default function ListarColab() {
  // Dados iniciais
  const [colaboradores] = useState([
    { id: 1, nome: "Humberto Macedo", email: "boy.macedo@hotmail.com", casos: 4, estado: "Desbloqueado", ativo: false },
    { id: 2, nome: "Nuno Pinho", email: "npinho@outlook.com", casos: 7, estado: "Desbloqueado", ativo: false },
    { id: 3, nome: "Mariana Silva", email: "advmarisilva@gmail.com", casos: 3, estado: "Bloqueado", ativo: true },
    { id: 4, nome: "Telmo Maia", email: "telmo.ma.ia@gmail.com", casos: 13, estado: "Desbloqueado", ativo: false },
  ]);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-8">
        <X.Container className="w-full overflow-x-auto">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Listar Colaboradores</p>
          </div>
          <X.Divider></X.Divider>
          <X.ButtonLink className="w-max">Criar Colaborador</X.ButtonLink>
          <div className="flex gap-4">
            <X.Dropdown
              label="Filtrar Por"
              options={["Desbloqueado", "Bloqueado"]}
              onSelect={(selectedOption) => console.log("Opção selecionada:", selectedOption)}
            />
            <X.Dropdown
              label="Ordenar"
              options={["ID", "Nome", "Menos Casos", "Mais Casos"]}
              onSelect={(selectedOption) => console.log("Opção selecionada:", selectedOption)}
            />
          </div>
          <X.Divider></X.Divider>

          {/* Tabela de Colaboradores */}
          <div className="overflow-x-auto w-full">
            <table className="w-full table-auto border-separate border-spacing-4">
              <thead>
                <tr className="text-left border-[var(--secondary-color)]">
                  <th className="w-[40px] px-2">{" "}</th> {/* Profile icon */}
                  <th className="w-[100px] px-2">ID</th>
                  <th className="min-w-[150px] px-2">Nome</th>
                  <th className="min-w-[200px] px-2">Email</th>
                  <th className="min-w-[120px] px-2">Nº de Casos</th>
                  <th className="min-w-[120px] px-2">Dívida</th>
                  <th className="w-[100px] px-2">{" "}</th> {/* Novo Caso */}
                </tr>
              </thead>
              <tbody>
                {colaboradores.map((colab) => (
                  <tr key={colab.id} className="border-b border-[var(--secondary-color)]">
                    <td className="px-2">
                      <X.Link className="group inline-flex">
                        <img className="w-6 h-6 group-hover:invert" src="/images/icons/profile.svg" alt="Ícone" />
                      </X.Link>
                    </td>
                    <td className="px-2 whitespace-nowrap">
                      <X.DataField>{colab.id}</X.DataField>
                    </td>
                    <td className="px-2">
                      <X.DataField className="truncate">{colab.nome}</X.DataField>
                    </td>
                    <td className="px-2">
                      <X.Link href={`mailto:${colab.email}`} className="truncate block">
                        {colab.email}
                      </X.Link>
                    </td>
                    <td className="px-2 whitespace-nowrap">
                      <X.DataField>{colab.casos}</X.DataField>
                    </td>
                    <td className="px-2 whitespace-nowrap">
                      <X.DataField colorOverride="--submit-color">€ {colab.casos}</X.DataField>
                    </td>
                    <td className="px-2 whitespace-nowrap">
                      <X.Link className="group">
                        <span className="text-sm text-[var(--primary-color)] group-hover:text-[var(--secondary-color)] transition-colors">
                          Novo Caso
                        </span>
                      </X.Link>
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