"use client";

import * as X from "@/components/xcomponents";
import { useSession } from "next-auth/react";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState, type FunctionComponent } from "react";
import {
  fetchCasoProfile,
  updateCasoEstado,
  fetchColaboradoresDoCaso,
  updateCasoResumo,
  updateCasoDescricao,
} from "./actions";
import SimpleSkeleton from "@/components/loading/simple_skeleton";

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
);

interface DadosFieldProps {
  titulo: string;
  valor: string;
  editando?: boolean;
  onMudanca?: (novoValor: string) => void;
  tipo?: "text" | "textarea";
}

const DadosField: React.FC<DadosFieldProps> = ({
  titulo,
  valor,
  editando = false,
  onMudanca,
  tipo = "text",
}) => (
  <X.Container className="w-full">
    <div className="space-y-2">
      <h2 className="text-base font-semibold text-white">{titulo}</h2>
      {editando ? (
        tipo === "textarea" ? (
          <textarea
            value={valor}
            onChange={(e) => onMudanca && onMudanca(e.target.value)}
            className="text-lg text-gray-300 bg-gray-700 p-1 rounded w-full border border-gray-600 focus:border-blue-500 focus:outline-none min-h-[100px]"
          />
        ) : (
          <input
            type="text"
            value={valor}
            onChange={(e) => onMudanca && onMudanca(e.target.value)}
            className="text-lg text-gray-300 bg-gray-700 p-1 rounded w-full border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        )
      ) : (
        <p className="text-lg text-gray-500">{valor || "Não definido"}</p>
      )}
    </div>
  </X.Container>
);

const Suporte: FunctionComponent = () => {
  const params = useParams();
  const id = params?.id;
  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [loadingColaboradores, setLoadingColaboradores] = useState(true);

  useEffect(() => {
    const loadColaboradores = async () => {
      try {
        setLoadingColaboradores(true);
        const casoId = Number(id);
        const data = await fetchColaboradoresDoCaso(casoId);
        setColaboradores(data);
      } catch (error) {
        console.error("Failed to load colaboradores:", error);
      } finally {
        setLoadingColaboradores(false);
      }
    };

    loadColaboradores();
  }, [id]);

  return (
    <>
      <X.Container className="w-full">
        <p className="font-semibold">Lista Registos</p>
        <X.Divider />
        <div className="flex flex-row">
          <X.ButtonLink href={`/caso/${id}/criar-registo`}>
            Adicionar registo
          </X.ButtonLink>
        </div>
        <div className="flex flex-row gap-4">
          <X.Dropdown
            label="Filtros"
            options={["", ""]}
            onSelect={(selectedOption) =>
              console.log("Opção selecionada:", selectedOption)
            }
          />
          <X.Dropdown
            label="Ordenar"
            options={["Data Ascendente", "Data Descendente"]}
            onSelect={(selectedOption) =>
              console.log("Opção selecionada:", selectedOption)
            }
          />
        </div>
        <X.Divider />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="p-3">Resumo</th>
                <th className="p-3">Data Criada</th>
              </tr>
            </thead>
            <tbody>
              {/* Dados temporários */}
              <tr className="border-b border-[var(--secondary-color)]">
                <td className="p-2">
                  <X.Link className="group">
                    <div>Reunião (TEMP)</div>
                  </X.Link>
                </td>
                <td className="p-2">
                  <X.DataField className="group">
                    <div>14/02/2025 17:20</div>
                  </X.DataField>
                </td>
              </tr>
              <tr className="border-b border-[var(--secondary-color)]">
                <td className="p-2">
                  <X.Link className="group">
                    <div>Ev - Ida Tribunal (TEMP)</div>
                  </X.Link>
                </td>
                <td className="p-2">
                  <X.DataField className="group">
                    <div>10/02/2025 14:20</div>
                  </X.DataField>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </X.Container>

      <X.Container className="w-full">
        <p className="font-semibold">Colaboradores Associados</p>
        <X.Divider />
        <div className="flex flex-row gap-4">
          <X.ButtonLink>Associar colaborador</X.ButtonLink>
          <X.ButtonLink href={`/caso/${id}/registar-horas`}>
            Registar Horas
          </X.ButtonLink>
        </div>
        <X.Divider />
        {loadingColaboradores ? (
          <SimpleSkeleton />
        ) : colaboradores.length > 0 ? (
          <div className="flex flex-col gap-2">
            {colaboradores.map((colaborador) => (
              <X.Link
                key={colaborador.id}
                href={`/perfil-terceiro/${colaborador.id}`}
                className="hover:text-[var(--primary-color)]"
              >
                [{colaborador.id}] {colaborador.nome}
              </X.Link>
            ))}
          </div>
        ) : (
          <p>Nenhum colaborador associado a este caso</p>
        )}
      </X.Container>
    </>
  );
};

export default function PerfilCaso() {
  const params = useParams();
  const id = params?.id;

  if (!id || isNaN(Number(id))) {
    notFound();
  }

  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    id: "",
    processo: "",
    resumo: "",
    descricao: "",
    estado: "",
  });

  useEffect(() => {
    const loadProfileData = async () => {
      if (!session?.user?.id) return;

      try {
        setIsLoading(true);
        const casoId = Number(id);
        const data = await fetchCasoProfile(casoId);
        if (data) {
          setProfileData(data);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [session, id]);

  const handleEstadoChange = async (newEstado: string) => {
    try {
      setIsLoading(true);
      await updateCasoEstado(Number(id), newEstado);
      setProfileData((prevData) => ({ ...prevData, estado: newEstado }));
    } catch (error) {
      console.error("Failed to update estado:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEditMode = async () => {
    if (isEditing) {
      try {
        setIsLoading(true);
        const casoId = Number(id);
        await updateCasoResumo(casoId, profileData.resumo);
        await updateCasoDescricao(casoId, profileData.descricao);
        const updatedData = await fetchCasoProfile(casoId);
        if (updatedData) {
          setProfileData(updatedData);
        }
      } catch (error) {
        console.error("Failed to update case:", error);
      } finally {
        setIsLoading(false);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleFieldChange =
    (field: keyof typeof profileData) => (value: string) => {
      setProfileData((prev) => ({ ...prev, [field]: value }));
    };

  if (isLoading && !profileData.processo) {
    return <SimpleSkeleton />;
  }

  if (!profileData) {
    return (
      <X.ErrorBox visible hideCloseButton>
        Caso não encontrado.
      </X.ErrorBox>
    );
  }

  return (
    <div className="flex flex-row gap-8">
      <div className="flex flex-col gap-8 w-2/3">
        <X.Container className="w-full">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Perfil do Caso</h1>
            <button
              onClick={toggleEditMode}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              disabled={isLoading}
              aria-label={isEditing ? "Salvar alterações" : "Editar perfil"}
            >
              {isLoading ? (
                <LoadingSpinner />
              ) : isEditing ? (
                <img
                  src="/images/icons/check.svg"
                  className="h-5 w-5"
                  alt="Salvar"
                />
              ) : (
                <img
                  src="/images/icons/edit.svg"
                  className="h-5 w-5"
                  alt="Editar"
                />
              )}
            </button>
          </div>

          <X.Divider />

          <X.Container className="w-full">
            <p className="text-lg font-semibold">Estado caso</p>
            <X.Dropdown
              label="Estado"
              options={["Aberto", "Fechado", "Terminado"]}
              defaultIndex={[
                "Aberto",
                "Fechado",
                "Terminado",
              ].indexOf(profileData.estado)}
              onSelect={handleEstadoChange}
            />
          </X.Container>

          <X.Container className="w-full">
            <p className="text-lg font-semibold">[ID] Processo</p>
            <p>[{id}] #{profileData.processo}</p>
          </X.Container>

          <DadosField
            titulo="Resumo"
            valor={profileData.resumo}
            editando={isEditing}
            onMudanca={handleFieldChange("resumo")}
            tipo="text"
          />

          <DadosField
            titulo="Descrição detalhada"
            valor={profileData.descricao}
            editando={isEditing}
            onMudanca={handleFieldChange("descricao")}
            tipo="textarea"
          />
        </X.Container>
      </div>

      <div className="flex flex-col gap-8 w-1/3">
        <Suporte />
      </div>
    </div>
  );
}
