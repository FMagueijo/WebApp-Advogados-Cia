"use client";

import * as X from "@/components/xcomponents";
import { useEffect, useState } from "react";
import { fetchColaboradores } from "./actions";
import { RoleData, UserData } from "@/types/types";
import { useSession } from "next-auth/react";
import SimpleSkeleton from "@/components/loading/simple_skeleton";

const utilLinks = [
  { href: "#", label: "checkToBlock", ico: "/images/icons/check.svg", customColor: "--success-color" },
  { href: "#", label: "blockToCheck", ico: "/images/icons/block.svg", customColor: "--error-color" },
];


export default function ListarColab() {
  //const [colaboradores, setColaboradores] = useState<UserData[]>([]);
  const [userRoles, setUserRoles] = useState<RoleData[]>([]); // State to store roles by user ID

  const [colaboradores, setColaboradores] = useState<any[]>([]);

  const [filters, setFilters] = useState<Record<string, any>>({}); // State to manage filters
  const [order, setOrder] = useState<Record<string, boolean>>({ "id": false }); // State to manage filters
  const { data: session, status } = useSession();
  const user = session?.user;

  const loadData = async () => {
    try {
      const data = await fetchColaboradores(filters, order);
      setColaboradores(data);
    } catch (err) {
      console.error("Erro ao buscar colaboradores:", err);
    } finally {

    }
  }

  useEffect(() => {
    loadData();;
  }, [filters, order]); // Fetch whenever filters or order change

  // Function to toggle active/inactive state
  const toggleAtivo = (id: number) => {

  };



  return (
    <div className="w-full">
      <div className="flex flex-col gap-8">
        <X.Container className="w-full">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Listar Colaboradores</p>
          </div>
          <X.Divider></X.Divider>
          {user?.role == 1 && <X.ButtonLink className="w-max" href="/criar-colaborador">Criar Colaborador</X.ButtonLink>}

            <div className="flex flex-row gap-4 flex-wrap w-full overflow-x-auto">
            <X.SortBox
              label="Ordenar"
              options={["ID", "Nome", "Email"]}
              onSortChange={(selectedOption, isInverted) => { setTimeout(() => setOrder({ [selectedOption]: isInverted }), 0); }}
            />
            <X.FilterBox
              filters={[
              { label: "ID", value: "user_id", type: "number" },
              { label: "Nome", value: "user_name", type: "text" },
              { label: "Email", value: "user_email", type: "text" },
              { label: "Estado", value: "Aaa", type: "combobox", options: ["Ativo", "Não Verificado", "Bloqueado"] },
              ]}
              onFilterChange={(newFilters: Record<string, any>) => {
              setTimeout(() => setFilters(newFilters), 0);
              }}
              label="Filtros"
            />
            </div>
          <X.Divider></X.Divider>
          {status === "loading" ? <SimpleSkeleton /> :

            <div className="overflow-x-auto w-full">
              {colaboradores.length <= 0 ? <>0 Resultados</> :
                <table className="w-full table-auto border-separate border-spacing-4">
                  <thead>
                    <tr className="text-left border-[var(--secondary-color)]">
                      <th className="w-[40px] px-2">{" "}</th>
                      <th className="w-[100px] px-2">ID</th>
                      <th className="min-w-[150px] px-2">Nome</th>
                      <th className="min-w-[200px] px-2">Email</th>
                      <th className="min-w-[120px] px-2">Nº de Casos</th>
                      {user?.role == 1 &&
                        <>
                          <th className="min-w-[120px] px-2">Estado</th>
                          <th className="w-max px-2">{""}</th>
                        </>
                      }

                    </tr>
                  </thead>
                  <tbody>
                    {colaboradores.map((colab) => {
                      const link = colab.esta_verificado ? utilLinks[0] : utilLinks[1];
                      return (
                        <tr key={colab.id} className="border-b border-[var(--secondary-color)]">
                          <td className="px-2">
                            <X.Link className="group inline-flex" href={"/utilizador/" + colab.id}>
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
                            <X.DataField>{"dawd"}</X.DataField>
                          </td>
                          {user?.role == 1 &&
                            <>
                              <td className="px-2 whitespace-nowrap">
                                <X.DataField
                                  colorOverride={colab.esta_verificado ? "--success-color" : "--error-color"}
                                >
                                  {colab.esta_verificado ? "Ativo" : "Não Verificado"}
                                </X.DataField>
                              </td>
                              <td className="px-2 whitespace-nowrap">
                                <button
                                  onClick={() => toggleAtivo(colab.id)}
                                  style={{ backgroundColor: `var(${link.customColor})` }}
                                  className="w-8 h-8 rounded-full flex items-center justify-center"
                                >
                                  <img
                                    src={link.ico}
                                    alt={link.label}
                                    className="w-6 h-6"
                                  />
                                </button>
                              </td>
                            </>
                          }

                        </tr>
                      );
                    })}
                  </tbody>
                </table>

              }
            </div>
          }


        </X.Container>
      </div>
    </div>
  );
}
