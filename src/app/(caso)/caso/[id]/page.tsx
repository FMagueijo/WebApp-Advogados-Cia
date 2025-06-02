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
  fetchDividasDoCaso,
  registrarHonorario,
  pagarDivida,
  pagarDividaTotal,
  adicionarColaboradorAoCaso,
  removerColaboradorDoCaso,
  fetchClientesDoCaso,
  listarClientes,
  adicionarClienteAoCaso,
  removerClienteDoCaso,
} from "./actions";
import SimpleSkeleton from "@/components/loading/simple_skeleton";
import RegistrarHorasForm from "@/app/(caso)/caso/registar-horas/page";
import { ColabList } from "@/components/lists/listar_colab";
import { ClienteList } from "@/components/lists/listar_clientes";

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
  const { data: session } = useSession();
  const params = useParams();
  const id = params?.id;

  const [isRegistroHorasOpen, setIsRegistroHorasOpen] = useState(false);
  const [estado, setEstado] = useState(false);
  const router = useRouter();

  if (!id || isNaN(Number(id))) {
    notFound();
  }


  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para colaboradores
  const [mostrarModalColaborador, setMostrarModalColaborador] = useState(false);
  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState<any | null>(null);
  const [colaboradoresDoCaso, setColaboradoresDoCaso] = useState<any[]>([]);

  // Estados para clientes
  const [mostrarModalCliente, setMostrarModalCliente] = useState(false);
  const [clientes, setClientes] = useState<any[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<any | null>(null);
  const [clientesDoCaso, setClientesDoCaso] = useState<any[]>([]);
  const [selectedClienteHonorario, setSelectedClienteHonorario] = useState<number | null>(null);
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
    const carregarDadosIniciais = async () => {
      try {
        const [resultadoColabs, resultadoClientes] = await Promise.all([
          listarColaboradores(),
          listarClientes()
        ]);
        setColaboradores(resultadoColabs);
        setClientes(resultadoClientes);
      } catch (error) {
        console.error("Erro ao carregar dados iniciais", error);
      }
    };
    carregarDadosIniciais();
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

        const [colaboradoresCaso, clientesCaso, registrosCaso] = await Promise.all([
          fetchColaboradoresDoCaso(casoId),
          fetchClientesDoCaso(casoId),
          fetchRegistrosDoCaso(casoId)
        ]);

        setColaboradoresDoCaso(colaboradoresCaso);
        setClientesDoCaso(clientesCaso);
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
        await Promise.all([
          updateCasoResumo(casoId, profileData.resumo),
          updateCasoDescricao(casoId, profileData.descricao)
        ]);
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



  const handleRegistrarHonorario = async () => {
    if (!assuntoHonorario.trim()) {
      setErrorMessage('Por favor insira um assunto');
      return;
    }

    if (!selectedClienteHonorario) {
      setErrorMessage('Por favor selecione um cliente');
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
        assuntoHonorario,
        selectedClienteHonorario // Pass the selected client ID
      );

      if (resultado.success) {
        setSuccessMessage(resultado.message);
        setAssuntoHonorario('');
        setValorHonorario('');
        setSelectedClienteHonorario(null);
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

  const handleAtualizarColaboradores = async () => {
    try {
      setIsLoading(true);
      const casoId = Number(id);

      // Primeiro, obtenha os colaboradores atuais do banco de dados
      const colaboradoresAtuais = await fetchColaboradoresDoCaso(casoId);

      // Identifique os colaboradores que foram adicionados
      const novosColaboradores = colaboradoresDoCaso.filter(
        novoColab => !colaboradoresAtuais.some(colabAtual => colabAtual.id === novoColab.id)
      );

      // Identifique os colaboradores que foram removidos
      const colaboradoresRemovidos = colaboradoresAtuais.filter(
        colabAtual => !colaboradoresDoCaso.some(novoColab => novoColab.id === colabAtual.id)
      );

      // Adicione os novos colaboradores
      for (const novoColab of novosColaboradores) {
        await adicionarColaboradorAoCaso(casoId, novoColab.id);
      }

      // Remova os colaboradores que foram desmarcados
      for (const colabRemovido of colaboradoresRemovidos) {
        await removerColaboradorDoCaso(casoId, colabRemovido.id);
      }

      // Atualize a lista de colaboradores do caso
      const updatedColaboradores = await fetchColaboradoresDoCaso(casoId);
      setColaboradoresDoCaso(updatedColaboradores);

    } catch (error) {
      console.error('Erro ao atualizar colaboradores:', error);
      // Recarregue os colaboradores do banco de dados em caso de erro
      const updatedColaboradores = await fetchColaboradoresDoCaso(Number(id));
      setColaboradoresDoCaso(updatedColaboradores);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAtualizarClientes = async () => {
    try {
      setIsLoading(true);
      const casoId = Number(id);

      // Primeiro, obtenha os clientes atuais do banco de dados
      const clientesAtuais = await fetchClientesDoCaso(casoId);

      // Identifique os clientes que foram adicionados
      const novosClientes = clientesDoCaso.filter(
        novoCliente => !clientesAtuais.some(clienteAtual => clienteAtual.id === novoCliente.id)
      );

      // Identifique os clientes que foram removidos
      const clientesRemovidos = clientesAtuais.filter(
        clienteAtual => !clientesDoCaso.some(novoCliente => novoCliente.id === clienteAtual.id)
      );

      // Adicione os novos clientes
      for (const novoCliente of novosClientes) {
        await adicionarClienteAoCaso(casoId, novoCliente.id);
      }

      // Remova os clientes que foram desmarcados
      for (const clienteRemovido of clientesRemovidos) {
        await removerClienteDoCaso(casoId, clienteRemovido.id);
      }

      // Atualize a lista de clientes do caso
      const updatedClientes = await fetchClientesDoCaso(casoId);
      setClientesDoCaso(updatedClientes);

    } catch (error) {
      console.error('Erro ao atualizar clientes:', error);
      // Recarregue os clientes do banco de dados em caso de erro
      const updatedClientes = await fetchClientesDoCaso(Number(id));
      setClientesDoCaso(updatedClientes);
    } finally {
      setIsLoading(false);
    }
  }

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

  // Funções para colaboradores
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

  // Funções para clientes
  const handleAdicionarCliente = async () => {
    if (!clienteSelecionado) return;

    try {
      setIsLoading(true);
      const success = await adicionarClienteAoCaso(Number(id), clienteSelecionado.id);

      if (success) {
        const updatedClientes = await fetchClientesDoCaso(Number(id));
        setClientesDoCaso(updatedClientes);
        setMostrarModalCliente(false);
        setClienteSelecionado(null);
      }
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoverCliente = async (clienteId: number) => {
    try {
      setIsLoading(true);
      const success = await removerClienteDoCaso(Number(id), clienteId);

      if (success) {
        const updatedClientes = await fetchClientesDoCaso(Number(id));
        setClientesDoCaso(updatedClientes);
      }
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
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
                  <th className="p-3">Estado</th>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Assunto</th>
                  <th className="p-3">Valor</th>
                  <th className="p-3">Data</th>
                  <th className="p-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {dividas.length > 0 ? (
                  dividas.map((divida) => (
                    <tr key={divida.id} className="border-b border-[var(--secondary-color)]">
                      <td className="p-2">
                        <X.DataField colorOverride={divida.pago ? "--success-color" : "--error-color"} className="min-w-max">
                          <p>
                            {divida.pago ? (
                              "Pago"
                            ) : (
                              "Por Pagar"
                            )}
                          </p>
                        </X.DataField>

                      </td>
                      <td className="p-2"><X.Link href={`/cliente/${divida.cliente.id}`}>{divida.cliente.nome || "Sem nome"}</X.Link></td> {/* Adicionado fallback */}
                      <td className="p-2"><X.DataField>{divida.assunto || "Sem assunto"}</X.DataField></td> {/* Adicionado fallback */}
                      <td className="p-2"><X.DataField >{divida.valor.toFixed(2)}€</X.DataField></td>
                      <td className="p-2"><X.DataField >{new Date(divida.criado_em).toLocaleDateString('pt-PT')}</X.DataField></td>
                      <td className="p-2 flex gap-2">
                        {!divida.pago && (
                          <>
                            <X.Button
                              onClick={() => {
                                setDividaSelecionada(divida.id);
                                setMostrarModalPagamento(true);
                              }}
                              className="min-w-max"
                            >
                              Pagar
                            </X.Button>
                            <X.Button
                              onClick={() => handlePagarDividaTotal(divida.id)}
                              className="min-w-max"
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
                    <tr key={registro.idRegisto} className="border-b border-[var(--secondary-color)]">
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
            <X.Button onClick={() => setIsRegistroHorasOpen(true)} className="w-max">
              Registar Horas
            </X.Button>
          </div>
          <X.Popup isOpen={mostrarModalColaborador} title="Selecionar Colaboradores" onClose={() => { setMostrarModalColaborador(false); handleAtualizarColaboradores(); }} className="w-full h-full">
            <ColabList
              mode="select"
              selectedCaseIds={colaboradoresDoCaso.map((caseItem) => caseItem.id)}
              onSelect={(selectedCases) => {
                setColaboradoresDoCaso(selectedCases);

              }}
            />
          </X.Popup>
          <X.Divider />
          {isLoading ? (
            <SimpleSkeleton />
          ) : colaboradoresDoCaso.length > 0 ? (
            <div className="flex flex-col gap-2">
              {colaboradoresDoCaso.map((colabItem) => (
                <div key={colabItem.id} className="flex items-center gap-4">
                  <X.Button
                    onClick={() => {
                      handleRemoverColaborador(Number(colabItem.id));
                    }

                    }
                  >
                    <img
                      className={"min-w-6 flex-shrink-0"}
                      src={"/images/icons/close.svg"}
                      alt={colabItem.nome}
                    />
                  </X.Button>
                  <X.Link href={`/perfil-terceiro/${colabItem.id}`} className="w-full">
                    <div className="w-full flex flex-col gap-2">
                      <p>[{colabItem.id}] #{colabItem.nome}</p>
                      <p className="font-light">{Number(colabItem.totalHoras).toFixed(2)}h Trabalhadas</p>
                    </div>
                  </X.Link>
                </div>
              ))}
            </div>
          ) : (
            <p>Nenhum colaborador associado a este caso</p>
          )}
        </X.Container>


        <X.Popup
          isOpen={mostrarModalHonorario}
          title="Registar Honorário"
          onClose={() => {
            setMostrarModalHonorario(false);
            setErrorMessage(null);
            setAssuntoHonorario("");
            setValorHonorario("");
            setSelectedClienteHonorario(null);
          }}
          className="w-full h-full"
        >
          <div className="flex flex-col gap-4">
            <X.Dropdown
              label="Selecione um cliente"
              options={clientesDoCaso.map(cliente => (cliente.nome))}
              defaultIndex={selectedClienteHonorario ? clientesDoCaso.findIndex(cliente => cliente.nome === selectedClienteHonorario) : -1}
              onSelect={(value) => setSelectedClienteHonorario(clientesDoCaso.find(cliente => cliente.nome === value)?.id || null)}
            ></X.Dropdown>
            <X.Field
              name="assunto"
              value={assuntoHonorario}
              placeholder="Assunto"
              className="w-full"
              onChange={(e) => setAssuntoHonorario(e.target.value)}
            />
            <X.Field
              type="number"
              step="0.01"
              name="valor"
              min={0}
              value={valorHonorario}
              placeholder="Valor em €"
              className="w-full"
              onChange={(e) => setValorHonorario(e.target.value)}
            />
            {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
            <div className="mt-4 flex justify-end">
              <X.Button onClick={handleRegistrarHonorario}>
                {isLoading ? <LoadingSpinner /> : "Confirmar"}
              </X.Button>
            </div>
          </div>
        </X.Popup>

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
                <X.Button onClick={handlePagarDivida} >
                  {isLoading ? <LoadingSpinner /> : "Confirmar"}
                </X.Button>
              </div>
            </X.Container>
          </div>
        )}

        {/* Modal Colaborador */}
        <X.Container className="w-full">
          <p className="font-semibold">Clientes Associados</p>
          <X.Divider />
          <div className="flex flex-row gap-4">
            <X.Button onClick={() => setMostrarModalCliente(true)}>
              Associar Cliente
            </X.Button>
          </div>
          <X.Popup isOpen={mostrarModalCliente} title="Selecionar Clientes" onClose={() => { setMostrarModalCliente(false); handleAtualizarClientes(); }} className="w-full h-full">
            <ClienteList
              mode="select"
              selectedCaseIds={clientesDoCaso.map((caseItem) => caseItem.id)}
              onSelect={(selectedCases) => {
                setClientesDoCaso(selectedCases);

              }}
            />
          </X.Popup>
          <X.Divider />
          {isLoading ? (
            <SimpleSkeleton />
          ) : clientesDoCaso.length > 0 ? (
            <div className="flex flex-col gap-2">
              {clientesDoCaso.map((cliente) => (
                <div key={cliente.id} className="flex items-center gap-4">
                  <X.Button
                    onClick={() => {
                      handleRemoverCliente(Number(cliente.id));
                    }

                    }
                  >
                    <img
                      className={"min-w-6 flex-shrink-0"}
                      src={"/images/icons/close.svg"}
                      alt={cliente.nome}
                    />
                  </X.Button>
                  <X.Link href={`/cliente/${cliente.id}`} className="w-full">
                    <p>[{cliente.id}] #{cliente.nome} </p>
                    <p>Divida {cliente.totalDivida.toFixed(2)}€</p>
                  </X.Link>
                </div>
              ))}
            </div>
          ) : (
            <p>Nenhum cliente associado a este caso</p>
          )}
        </X.Container>


      </div>
      <X.Popup
        isOpen={isRegistroHorasOpen}
        title="Registar Horas"
        onClose={() => setIsRegistroHorasOpen(false)}
      >
        <RegistrarHorasForm onClose={() => setIsRegistroHorasOpen(false)} casoId={Number(id)}></RegistrarHorasForm>
      </X.Popup>
    </div>
  );
};

export default PerfilCaso;