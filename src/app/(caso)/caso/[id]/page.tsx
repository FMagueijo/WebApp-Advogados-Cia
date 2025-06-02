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
  listarColaboradores,
  fetchRegistrosDoCaso,
  fetchDividasDoCaso,
  registrarHonorario,
  pagarDivida,
  pagarDividaTotal,
} from "./actions";
import SimpleSkeleton from "@/components/loading/simple_skeleton";
import RegistrarHorasForm from "@/app/(caso)/caso/registar-horas/page";

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
);

const Suporte: FunctionComponent = () => {
  const params = useParams();
  const id = params?.id;
  return (
    <>
      <X.Container className="w-full">
        <p className="font-semibold">Lista Registos</p>
        <X.Divider></X.Divider>
        <div className="flex flex-row">
          <X.ButtonLink href={`/caso/${id}/criar-registo`}>Adicionar registo</X.ButtonLink>
        </div>
        <div className="flex flex-row gap-4">
          <X.Dropdown
            label="Filtros"
            options={["", ""]}
            onSelect={(selectedOption) => console.log("Opção selecionada:", selectedOption)}
          />
          <X.Dropdown
            label="Ordenar"
            options={["Data Ascendente ", "Data Desscendente"]}
            onSelect={(selectedOption) => console.log("Opção selecionada:", selectedOption)}
          />
        </div>
        <X.Divider></X.Divider>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left ">
                <th className="p-3">Resumo</th>
                <th className="p-3">Data Criada</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--secondary-color)]">
                <td className="p-2"><X.Link className="group"><div>Reuniao  (TEMP)</div> </X.Link></td>
                <td className="p-2"><X.DataField className="group"><div>14/02/2025 17:20 </div> </X.DataField></td>
              </tr>
              <tr className="border-b border-[var(--secondary-color)]">
                <td className="p-2"><X.Link className="group"><div>Ev - Ida Tribunal  (TEMP)</div> </X.Link></td>
                <td className="p-2"><X.DataField className="group"><div>10/02/2025 14:20 </div> </X.DataField></td>
              </tr>
            </tbody>
          </table>
        </div>
      </X.Container>
      <X.Container className="w-full">
        <p className="font-semibold">Colaboradores Associados </p>
        <X.Divider></X.Divider>
        <div className="flex flex-row">
          <X.ButtonLink>Associar colaborador</X.ButtonLink>
        </div>
        <X.Divider></X.Divider>
        <X.Link>[23] Nuno Pinho (TEMP)</X.Link>
      </X.Container>
    </>
  );
}

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

const PerfilCaso: FunctionComponent = () => {
  const { data: session } = useSession();
  const params = useParams();
  const id = params?.id;
  const [isRegistroHorasOpen, setIsRegistroHorasOpen] = useState(false);
  const [estado, setEstado] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mostrarModalColaborador, setMostrarModalColaborador] = useState(false);
  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState<any | null>(null);
  const [colaboradoresDoCaso, setColaboradoresDoCaso] = useState<any[]>([]);
  const [registros, setRegistros] = useState<any[]>([]);
  const [dividas, setDividas] = useState<any[]>([]);
  const [mostrarModalHonorario, setMostrarModalHonorario] = useState(false);
  const [mostrarModalPagamento, setMostrarModalPagamento] = useState(false);
  const [dividaSelecionada, setDividaSelecionada] = useState<number | null>(null);
  const [valorHonorario, setValorHonorario] = useState("");
  const [valorPagamento, setValorPagamento] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [assuntoHonorario, setAssuntoHonorario] = useState("");

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
        const dividasCaso = await fetchDividasDoCaso(casoId);
        setDividas(dividasCaso);
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
    // Implementação existente
  };

  const handleRegistrarHonorario = async () => {
    if (!assuntoHonorario.trim()) {
      setErrorMessage('Por favor insira um assunto');
      return;
    }

    const valorNumerico = parseFloat(valorHonorario);
    if (isNaN(valorNumerico)) {
      setErrorMessage('Por favor insira um valor numérico válido');
      return;
    }

    if (valorNumerico <= 0) {
      setErrorMessage('O valor deve ser maior que zero');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const resultado = await registrarHonorario(
        Number(id),
        valorNumerico,
        assuntoHonorario
      );

      if (resultado.success) {
        setSuccessMessage(resultado.message);
        setAssuntoHonorario('');
        setValorHonorario('');
        setMostrarModalHonorario(false);
        // Atualiza a lista de dívidas
        const dividasCaso = await fetchDividasDoCaso(Number(id));
        setDividas(dividasCaso);
      } else {
        setErrorMessage(resultado.message);
      }
    } catch (error) {
      setErrorMessage('Erro ao registrar honorário');
      console.error(error);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handlePagarDivida = async () => {
    if (!dividaSelecionada) return;

    const valorNumerico = parseFloat(valorPagamento);
    if (isNaN(valorNumerico)) {
      setErrorMessage('Por favor insira um valor numérico válido');
      return;
    }

    if (valorNumerico <= 0) {
      setErrorMessage('O valor deve ser maior que zero');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const resultado = await pagarDivida(dividaSelecionada, valorNumerico);

      if (resultado.success) {
        setSuccessMessage(resultado.message);
        setValorPagamento('');
        setMostrarModalPagamento(false);
        // Atualiza a lista de dívidas
        const dividasCaso = await fetchDividasDoCaso(Number(id));
        setDividas(dividasCaso);
      } else {
        setErrorMessage(resultado.message);
      }
    } catch (error) {
      setErrorMessage('Erro ao processar pagamento');
      console.error(error);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handlePagarDividaTotal = async (dividaId: number) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const resultado = await pagarDividaTotal(dividaId);

      if (resultado.success) {
        setSuccessMessage(resultado.message);
        // Atualiza a lista de dívidas
        const dividasCaso = await fetchDividasDoCaso(Number(id));
        setDividas(dividasCaso);
      } else {
        setErrorMessage(resultado.message);
      }
    } catch (error) {
      setErrorMessage('Erro ao processar pagamento total');
      console.error(error);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 5000);
    }
  };

  if (!id || isNaN(Number(id))) {
    notFound();
  }

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
        {/* Seção principal do perfil do caso */}
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

        {/* Seção de informações gerais */}
        <X.Container className="w-full">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Info geral</p>
          </div>
          <X.Divider></X.Divider>
          <X.Button onClick={() => setIsRegistroHorasOpen(true)} className="w-max">
            Registar Horas
          </X.Button>
          <X.Container className="w-full">
            <p className="text-lg font-semibold"> [ID] Processo </p>
            <p> [{id}] #{profileData.processo}</p>
          </X.Container>
          <X.Container className="w-full">
            <p className="text-lg font-semibold"> Resumo </p>
            <p> {profileData.resumo}</p>
          </X.Container>
          <X.Container className="w-full">
            <p className="text-lg font-semibold"> Descrição detalhada </p>
            {profileData.descricao}
          </X.Container>
        </X.Container>
      </div>

      <div className="flex flex-col gap-8 w-1/3">
        {/* Lista de Registos */}
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
                    <tr key={registro.idRegisto} className="border-b border-[var(--secondary-color)]">
                      <td className="p-2">
                        <X.Link href={`/caso/${id}/registo/${registro.idRegisto}`} className="group">
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

        {/* Colaboradores Associados */}
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

        {/* Seção de Dívidas */}
        <X.Container className="w-full">
          <p className="font-semibold">Honorários</p>
          <X.Divider />
          <div className="flex flex-row gap-4">
            <X.Button
              onClick={() => {
                setMostrarModalHonorario(true);
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Registar Honorário
            </X.Button>
          </div>
          <X.Divider />
          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="p-3">Assunto</th>
                  <th className="p-3">Valor</th>
                  <th className="p-3">Data</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {dividas.length > 0 ? (
                  dividas.map((divida) => (
                    <tr key={divida.id} className="border-b border-[var(--secondary-color)]">
                      <td className="p-2">{divida.assunto || "Sem assunto"}</td> {/* Adicionado fallback */}
                      <td className="p-2">{divida.valor.toFixed(2)}€</td>
                      <td className="p-2">{new Date(divida.criado_em).toLocaleDateString('pt-PT')}</td>
                      <td className="p-2">
                        {divida.pago ? (
                          <span className="text-green-500">Pago</span>
                        ) : (
                          <span className="text-red-500">Por pagar</span>
                        )}
                      </td>
                      <td className="p-2 flex gap-2">
                        {!divida.pago && (
                          <>
                            <X.Button
                              size="sm"
                              onClick={() => {
                                setDividaSelecionada(divida.id);
                                setMostrarModalPagamento(true);
                              }}
                            >
                              Pagar
                            </X.Button>
                            <X.Button
                              size="sm"
                              onClick={() => handlePagarDividaTotal(divida.id)}
                              disabled={isLoading}
                            >
                              Pagar Tudo
                            </X.Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      Nenhuma dívida registada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </X.Container>

        {mostrarModalHonorario && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <X.Container className="w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold">Registar Honorário</p>
                <button
                  onClick={() => {
                    setMostrarModalHonorario(false);
                    setErrorMessage(null);
                    setAssuntoHonorario("");
                    setValorHonorario("");
                  }}
                  className="text-gray-500 hover:text-gray-800 text-2xl"
                >
                  &times;
                </button>
              </div>
              <X.Divider />
              <input
                type="text"
                className="w-full p-2 border border-gray-400 rounded mt-4 bg-gray-800 text-white"
                placeholder="Assunto"
                value={assuntoHonorario}
                onChange={(e) => setAssuntoHonorario(e.target.value)}
              />
              <input
                type="number"
                step="0.01"
                className="w-full p-2 border border-gray-400 rounded mt-4 bg-gray-800 text-white"
                placeholder="Valor em €"
                value={valorHonorario}
                onChange={(e) => setValorHonorario(e.target.value)}
              />
              {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
              <div className="mt-4 flex justify-end">
                <X.Button onClick={handleRegistrarHonorario} disabled={isLoading}>
                  {isLoading ? <LoadingSpinner /> : "Confirmar"}
                </X.Button>
              </div>
            </X.Container>
          </div>
        )}

        {/* Modal Pagar Dívida */}
        {mostrarModalPagamento && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <X.Container className="w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold">Pagar Dívida</p>
                <button
                  onClick={() => {
                    setMostrarModalPagamento(false);
                    setErrorMessage(null);
                    setDividaSelecionada(null);
                  }}
                  className="text-gray-500 hover:text-gray-800 text-2xl"
                >
                  &times;
                </button>
              </div>
              <X.Divider />
              <input
                type="number"
                step="0.01"
                className="w-full p-2 border border-gray-400 rounded mt-4 bg-gray-800 text-white"
                placeholder="Valor em €"
                value={valorPagamento}
                onChange={(e) => setValorPagamento(e.target.value)}
              />
              {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
              {successMessage && <p className="text-green-500 text-sm mt-2">{successMessage}</p>}
              <div className="mt-4 flex justify-end">
                <X.Button onClick={handlePagarDivida} disabled={isLoading}>
                  {isLoading ? <LoadingSpinner /> : "Confirmar"}
                </X.Button>
              </div>
            </X.Container>
          </div>
        )}

        {/* Modal Colaborador */}
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
                    {colaboradores.map(colaborador => (
                      <div
                        key={colaborador.id}
                        className={`p-2 rounded cursor-pointer hover:bg-green-100 ${colaboradorSelecionado?.id === colaborador.id ? 'bg-green-100' : ''
                          }`}
                        onClick={() => setColaboradorSelecionado(colaborador)}
                      >
                        <div className="font-medium">{colaborador.nome}</div>
                        <div className="text-xs text-gray-500">{colaborador.email}</div>
                      </div>
                    ))}
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