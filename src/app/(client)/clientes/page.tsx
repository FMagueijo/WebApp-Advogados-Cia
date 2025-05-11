"use client";

import * as X from "@/components/xcomponents";
import { useEffect, useState } from "react";
import { fetchClientes } from "./action";
import SimpleSkeleton from "@/components/loading/simple_skeleton";

export default function ListarClientes() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [order, setOrder] = useState<Record<string, boolean>>({ "id": false });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await fetchClientes(filters, order);
      setClientes(data);
    } catch (err) {
      console.error("Error loading clients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters, order]);

  if (loading) return <SimpleSkeleton />;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-8">
        <X.Container className="w-full">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Listar Clientes</p>
          </div>
          <X.Divider />
          <X.ButtonLink className="w-max" href="/criar-cliente">
            Criar Cliente
          </X.ButtonLink>

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
              options={["ID", "Nome", "Email", "Casos"]}
              onSortChange={(selectedOption, isInverted) => {
                setTimeout(() => setOrder({ [selectedOption]: isInverted }), 0);
              }}
            />
            <X.FilterBox
              filters={[
                { label: "ID", value: "ID", type: "number" },
                { label: "Nome", value: "Nome", type: "text" },
                { label: "Email", value: "Email", type: "text" },
              ]}
              onFilterChange={(newFilters) => {
                setTimeout(() => setFilters(newFilters), 0);
              }}
              label="Filtros"
            />
          </div>
          <X.Divider/>

          <div className="overflow-x-auto w-full">
            {clientes.length <= 0 ? (
              <p>0 Resultados</p>
            ) : (
              <table className="w-full table-auto border-separate border-spacing-4">
                <thead>
                  <tr className="text-left border-[var(--secondary-color)]">
                    <th className="w-[40px] px-2">{" "}</th>
                    <th className="w-[100px] px-2">ID</th>
                    <th className="min-w-[150px] px-2">Nome</th>
                    <th className="min-w-[200px] px-2">Email</th>
                    <th className="min-w-[120px] px-2">Nº de Casos</th>
                    <th className="min-w-[120px] px-2">Dívida</th>
                    <th className="w-[100px] px-2">{" "}</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente) => (
                    <tr key={cliente.id} className="border-b border-[var(--secondary-color)]">
                      <td className="px-2">
                        <X.Link className="group inline-flex" href={`/cliente/${cliente.id}`}>
                          <img className="w-6 h-6 group-hover:invert" src="/images/icons/profile.svg" alt="Profile" />
                        </X.Link>
                      </td>
                      <td className="px-2 whitespace-nowrap">
                        <X.DataField>{cliente.id}</X.DataField>
                      </td>
                      <td className="px-2">
                        <X.DataField className="truncate">{cliente.nome}</X.DataField>
                      </td>
                      <td className="px-2">
                        <X.Link href={`mailto:${cliente.email}`} className="truncate block">
                          {cliente.email}
                        </X.Link>
                      </td>
                      <td className="px-2 whitespace-nowrap">
                        <X.DataField>{cliente.casosCount}</X.DataField>
                      </td>
                      <td className="px-2 whitespace-nowrap">
                        <X.DataField colorOverride="--submit-color">
                          € {(cliente.casosCount * 250).toFixed(2)} {/* Random debt calculation */}
                        </X.DataField>
                      </td>
                      <td className="px-2 whitespace-nowrap">
                        <X.Link className="group" href={`/criar-caso?clienteId=${cliente.id}`}>
                          <span className="text-sm text-[var(--primary-color)] group-hover:text-[var(--secondary-color)] transition-colors">
                            Caso
                          </span>
                        </X.Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </X.Container>
      </div>
    </div>
  );
}