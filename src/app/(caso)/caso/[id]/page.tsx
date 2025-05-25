"use client";

import * as X from "@/components/xcomponents";
import { useSession } from "next-auth/react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState, type FunctionComponent } from "react";
import {
  fetchCasoProfile,
  updateCasoEstado,
  fetchColaboradoresDoCaso,
  updateCasoResumo,
  updateCasoDescricao,
  listarColaboradores,
  fetchRegistrosDoCaso,
  adicionarColaboradorAoCaso,
  removerColaboradorDoCaso,
} from "./actions";
import SimpleSkeleton from "@/components/loading/simple_skeleton";
import RegistrarHorasForm from "@/app/(caso)/caso/registar-horas/page";

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
);

const DadosField: React.FC<{
  titulo: string;
  valor: string;
  editando?: boolean;
  onMudanca?: (novoValor: string) => void;
  tipo?: "text" | "textarea";
}> = ({ titulo, valor, editando = false, onMudanca, tipo = "text" }) => (
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

const PerfilCaso: FunctionComponent = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [isRegistroHorasOpen, setIsRegistroHorasOpen] = useState(false);

  if (!id || isNaN(Number(id))) {
    notFound();
  }

  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mostrarModalColaborador, setMostrarModalColaborador] = useState(false);
  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState<any | null>(null);
  const [colaboradoresDoCaso, setColaboradoresDoCaso] = useState<any[]>([]);
  const [registros, setRegistros] = useState<any[]>([]);

  const [profileData, setProfileData] = useState({
    id: "",
    processo: "",
    resumo: "",
    descricao: "",
    estado: "",
  });

  useEffect(() => {
    const carregarColaboradores = async () => {
      try {
        const resultado = await listarColaboradores();
        setColaboradores(resultado);
      } catch (error) {
        console.error("Erro ao carregar colaboradores", error);
      }
    };
    carregarColaboradores();
  }, []);

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
        const colaboradoresCaso = await fetchColaboradoresDoCaso(casoId);
        setColaboradoresDoCaso(colaboradoresCaso);
        const registrosCaso = await fetchRegistrosDoCaso(casoId);
        setRegistros(registrosCaso);
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

  const handleFieldChange = (field: keyof typeof profileData) => (value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSortRegistros = async (order: 'asc' | 'desc') => {
    try {
      setIsLoading(true);
      const registrosOrdenados = await fetchRegistrosDoCaso(Number(id), order);
      setRegistros(registrosOrdenados);
    } catch (error) {
      console.error("Erro ao ordenar registros:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdicionarColaborador = async () => {
    if (!colaboradorSelecionado) return;

    try {
      setIsLoading(true);
      const success = await adicionarColaboradorAoCaso(Number(id), colaboradorSelecionado.id);
      
      if (success) {
        const updatedColaboradores = await fetchColaboradoresDoCaso(Number(id));
        setColaboradoresDoCaso(updatedColaboradores);
        setMostrarModalColaborador(false);
        setColaboradorSelecionado(null);
      }
    } catch (error) {
      console.error('Erro ao adicionar colaborador:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoverColaborador = async (colaboradorId: number) => {
    try {
      setIsLoading(true);
      const success = await removerColaboradorDoCaso(Number(id), colaboradorId);
      
      if (success) {
        const updatedColaboradores = await fetchColaboradoresDoCaso(Number(id));
        setColaboradoresDoCaso(updatedColaboradores);
      }
    } catch (error) {
      console.error('Erro ao remover colaborador:', error);
    } finally {
      setIsLoading(false);
    }
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
                <img src="/images/icons/check.svg" className="h-5 w-5" alt="Salvar" />
              ) : (
                <img src="/images/icons/edit.svg" className="h-5 w-5" alt="Editar" />
              )}
            </button>
          </div>

          <X.Divider />

          <X.Container className="w-full">
            <p className="text-lg font-semibold">Estado caso</p>
            <X.Dropdown
              label="Estado"
              options={["Aberto", "Fechado", "Terminado"]}
              defaultIndex={["Aberto", "Fechado", "Terminado"].indexOf(profileData.estado)}
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
        <X.Container className="w-full">
          <p className="font-semibold">Lista Registos</p>
          <X.Divider />
          <div className="flex flex-row">
            <X.ButtonLink href={`/caso/${id}/criar-registo`}>
              Adicionar registo
            </X.ButtonLink>
          </div>
          <div className="flex flex-row gap-4 mt-2">
            <X.Dropdown
              label="Ordenar"
              options={["Data Descendente", "Data Ascendente"]}
              onSelect={(selectedOption) => 
                handleSortRegistros(selectedOption === "Data Ascendente" ? 'asc' : 'desc')
              }
            />
          </div>
          <X.Divider />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="p-3">Resumo</th>
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Data Criada</th>
                </tr>
              </thead>
              <tbody>
                {registros.length > 0 ? (
                  registros.map((registro) => (
                    <tr key={registro.id} className="border-b border-[var(--secondary-color)]">
                      <td className="p-2">
                        <X.Link href={`/caso/${id}/registo/${registro.id}`} className="group">
                          <div>{registro.resumo}</div>
                        </X.Link>
                      </td>
                      <td className="p-2">
                        <div>{registro.tipo}</div>
                      </td>
                      <td className="p-2">
                        <X.DataField className="group">
                          <div>
                            {new Date(registro.criado_em).toLocaleDateString('pt-PT', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </X.DataField>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-gray-500">
                      Nenhum registo encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </X.Container>

        <X.Container className="w-full">
          <p className="font-semibold">Colaboradores Associados</p>
          <X.Divider />
          <div className="flex flex-row gap-4">
            <X.Button onClick={() => setMostrarModalColaborador(true)}>
              Associar Colaborador
            </X.Button>
          </div>
          <X.Divider />
          {isLoading ? (
            <SimpleSkeleton />
          ) : colaboradoresDoCaso.length > 0 ? (
            <div className="flex flex-col gap-2">
              {colaboradoresDoCaso.map((colaborador) => (
                <div key={colaborador.id} className="flex justify-between items-center">
                  <X.Link
                    href={`/perfil-terceiro/${colaborador.id}`}
                    className="hover:text-[var(--primary-color)]"
                  >
                    [{colaborador.id}] {colaborador.nome} ({colaborador.role?.nome_role})
                  </X.Link>
                  {colaborador.id !== session?.user?.id && (
                    <button 
                      onClick={() => handleRemoverColaborador(colaborador.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                      disabled={isLoading}
                    >
                      Remover
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>Nenhum colaborador associado a este caso</p>
          )}
        </X.Container>

        {mostrarModalColaborador && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <X.Container className="w-full max-w-lg max-h-[80vh] overflow-y-auto relative">
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold">Selecionar Colaborador</p>
                <button 
                  onClick={() => {
                    setMostrarModalColaborador(false);
                    setColaboradorSelecionado(null);
                  }} 
                  className="text-gray-500 hover:text-gray-800 text-2xl"
                >
                  &times;
                </button>
              </div>
              <X.Divider />
              {colaboradores.length === 0 ? (
                <p className="text-sm text-gray-500 mt-4">Nenhum colaborador encontrado.</p>
              ) : (
                <>
                  <div className="space-y-2 mt-4">
                    {colaboradores.map(colaborador => {
                      const jaAssociado = colaboradoresDoCaso.some(c => c.id === colaborador.id);
                      
                      return (
                        <div
                          key={colaborador.id}
                          className={`p-2 rounded cursor-pointer ${
                            colaboradorSelecionado?.id === colaborador.id 
                              ? 'bg-green-100' 
                              : jaAssociado 
                                ? 'bg-gray-100 cursor-not-allowed' 
                                : 'hover:bg-green-100'
                          }`}
                          onClick={!jaAssociado ? () => setColaboradorSelecionado(colaborador) : undefined}
                        >
                          <div className="font-medium">
                            {colaborador.nome} 
                            {jaAssociado && <span className="text-xs text-gray-500 ml-2">(já associado)</span>}
                          </div>
                          <div className="text-xs text-gray-500">{colaborador.email} ({colaborador.role?.nome_role})</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <X.Button 
                      onClick={handleAdicionarColaborador}
                      disabled={!colaboradorSelecionado || isLoading}
                    >
                      {isLoading ? <LoadingSpinner /> : "Confirmar"}
                    </X.Button>
                  </div>
                </>
              )}
            </X.Container>
          </div>
        )}
      </div>

      <RegistrarHorasForm
        isOpen={isRegistroHorasOpen}
        onClose={() => setIsRegistroHorasOpen(false)}
        casoId={Number(id)}
      />
    </div>
  );
};

export default PerfilCaso;