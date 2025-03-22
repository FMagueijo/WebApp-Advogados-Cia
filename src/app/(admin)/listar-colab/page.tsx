"use client";

import * as X from "@/components/xcomponents";
import { useState } from "react"; // Import useState para gerenciar o estado

const utilLinks = [
  { href: "#", label: "checkToBlock", ico: "/images/icons/check.svg", customColor: "--success-color" },
  { href: "#", label: "blockToCheck", ico: "/images/icons/block.svg", customColor: "--error-color" },
];

export default function ListarColab() {
  // Dados iniciais
  const [colaboradores, setColaboradores] = useState([
    { id: 1, nome: "Humberto Macedo", email: "boy.macedo@hotmail.com", casos: 4, estado: "Desbloqueado", ativo: false },
    { id: 2, nome: "Nuno Pinho", email: "npinho@outlook.com", casos: 7, estado: "Desbloqueado", ativo: false },
    { id: 3, nome: "Mariana Silva", email: "advmarisilva@gmail.com", casos: 3, estado: "Bloqueado", ativo: true },
    { id: 4, nome: "Telmo Maia", email: "telmo.ma.ia@gmail.com", casos: 13, estado: "Desbloqueado", ativo: false },
  ]);

  // Função para alternar o estado de ativo/inativo
  const toggleAtivo = (id) => {
    setColaboradores((prevColaboradores) =>
      prevColaboradores.map((colab) =>
        colab.id === id ? { ...colab, ativo: !colab.ativo } : colab
      )
    );
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-8">
        <X.Container className="w-full">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Listar Colaboradores</p>
          </div>
          <X.Divider></X.Divider>
          <X.ButtonLink className="w-3/12">Criar Colaborador</X.ButtonLink>

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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b-2 border-[var(--secondary-color)]">
                  <th className="p-4"></th>
                  <th className="p-4">ID</th>
                  <th className="p-4">Nome</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Nº de Casos</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {colaboradores.map((colab) => {
                  const link = colab.ativo ? utilLinks[0] : utilLinks[1]; // Seleciona o ícone e cor com base no estado
                  return (
                    <tr key={colab.id} className="border-b border-[var(--secondary-color)]">
                      <td className="p-4">
                        <X.Link className="group">
                          <img className="group-hover:invert" src="/images/icons/profile.svg" alt="Ícone" />
                        </X.Link>
                      </td>
                      <td className="p-4">
                        <X.DataField className="w-6/10">
                          <div className="flex flex-row gap-4 w-full items-center">
                            <div className="flex-1 text-left">{colab.id}</div>
                          </div>
                        </X.DataField>
                      </td>
                      <td className="p-4">
                        <X.DataField>
                          <div className="flex flex-row gap-4 w-full items-center">
                            <div className="flex-1 text-left">{colab.nome}</div>
                          </div>
                        </X.DataField>
                      </td>
                      <td className="p-4">
                        <X.Link href={`mailto:${colab.email}`}>{colab.email}</X.Link>
                      </td>
                      <td className="p-4">
                        <X.DataField>
                          <div className="flex flex-row gap-4 w-full items-center">
                            <div className="flex-1 text-left">{colab.casos}</div>
                          </div>
                        </X.DataField>
                      </td>
                      <td className="p-4">
                        <X.DataField
                          colorOverride={
                            colab.estado === "Desbloqueado" ? "--success-color" : "--error-color"
                          }
                        >
                          <div className="flex flex-row gap-4 w-full items-center">
                            <div className="flex-1">{colab.estado}</div>
                          </div>
                        </X.DataField>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleAtivo(colab.id)} // Alterna o estado ao clicar
                          style={{ backgroundColor: `var(${link.customColor})` }} // Aplica a cor dinâmica
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                        >
                          <img
                            src={link.ico}
                            alt={link.label}
                            className="w-6 h-6"
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </X.Container>
      </div>
    </div>
  );
}