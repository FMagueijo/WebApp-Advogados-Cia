"use client";

import * as X from "@/components/xcomponents";
import { criarCaso, listarClientes, criarCliente } from "./actions";
import { useState, useEffect } from 'react';

export default function CriarCaso() {
  const [clientes, setClientes] = useState<Array<{ id: number, nome: string, email: string, telefone: string, codigoPostal: string, endereco: string }>>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<{ id: number, nome: string, email: string, telefone: string, codigoPostal: string, endereco: string } | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [mostrarModalSelecao, setMostrarModalSelecao] = useState(false);
  const [mostrarModalCriacao, setMostrarModalCriacao] = useState(false);
  const [novoCliente, setNovoCliente] = useState({
    nome: '',
    email: '',
    telefone: '',
    codigoPostal: '',
    endereco: ''
  });

  useEffect(() => {
    const carregarClientes = async () => {
      setCarregando(true);
      try {
        const resultado = await listarClientes();
        setClientes(resultado);
      } catch (error) {
        setErro('Erro ao carregar clientes');
        console.error(error);
      } finally {
        setCarregando(false);
      }
    };

    carregarClientes();
  }, []);

  const handleSubmitCaso = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (clienteSelecionado) {
      form.append('clienteId', clienteSelecionado.id.toString());
    }
    await criarCaso(form);
  };

  const handleSubmitCliente = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const clienteCriado = await criarCliente(novoCliente);
      setClientes([...clientes, clienteCriado]);
      setClienteSelecionado(clienteCriado);
      setMostrarModalCriacao(false);
      setNovoCliente({ 
        nome: '', 
        email: '', 
        telefone: '', 
        codigoPostal: '', 
        endereco: '' 
      });
    } catch (error) {
      setErro('Erro ao criar cliente');
      console.error(error);
    }
  };

  const handleRemoverCliente = () => {
    setClienteSelecionado(null);
  };

  const handleClienteSelecionado = (cliente: { id: number, nome: string, email: string, telefone: string, codigoPostal: string, endereco: string }) => {
    setClienteSelecionado(cliente);
    setMostrarModalSelecao(false);
  };

  const handleModalClick = (e: React.MouseEvent, cliente: { id: number, nome: string, email: string, telefone: string, codigoPostal: string, endereco: string }) => {
    e.preventDefault();
    handleClienteSelecionado(cliente);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNovoCliente(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex w-full xl:flex-row justify-center gap-8 flex-col xl:w-4/5">
        {/* Formulário */}
        <X.Container className="xl:w-2/3 h-max">
          <p className="font-semibold">Criar Caso</p>
          <X.Divider />
          <form onSubmit={handleSubmitCaso} className="space-y-4">
            <X.Field required type="text" placeholder="Processo" name="Processo" />
            <X.Field required type="text" placeholder="Resumo" name="Resumo" />
            <X.Textarea maxLength={256} placeholder="Descrição Detalhada" name="Descrição Detalhada" />
            <X.Submit disabled={!clienteSelecionado}>
              Criar Caso
            </X.Submit>
          </form>
        </X.Container>

        {/* Lado direito */}
        <X.Container className="xl:w-1/3 h-max">
          <p className="font-semibold">Clientes Associados</p>
          <X.Divider />

          <div className="flex flex-col gap-2 mb-4">
            <X.Button type="button" onClick={() => setMostrarModalSelecao(true)}>
              Associar Cliente
            </X.Button>

            <X.Button type="button" onClick={() => setMostrarModalCriacao(true)}>
              Criar e Associar Cliente
            </X.Button>
          </div>

          <X.Divider />

          <div className="text-sm">
            Cliente selecionado:{" "}
            {clienteSelecionado ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{clienteSelecionado.nome}</span>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={handleRemoverCliente}
                  >
                    &times;
                  </button>
                </div>
                <div className="text-xs text-gray-600">
                  <div>Email: {clienteSelecionado.email}</div>
                  <div>Telefone: {clienteSelecionado.telefone}</div>
                  <div>CEP: {clienteSelecionado.codigoPostal}</div>
                  <div>Endereço: {clienteSelecionado.endereco}</div>
                </div>
              </div>
            ) : "Nenhum"}
          </div>
        </X.Container>
      </div>

      {/* Modal de Seleção */}
      {mostrarModalSelecao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <X.Container className="w-full max-w-lg max-h-[80vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-semibold">Selecionar Cliente</p>
              <button onClick={() => setMostrarModalSelecao(false)} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
            </div>
            <X.Divider />

            {carregando && <p>Carregando clientes...</p>}
            {erro && <p className="text-red-500">{erro}</p>}

            <div className="space-y-2 mt-4">
              {clientes.map(cliente => (
                <div
                  key={cliente.id}
                  className={`p-2 rounded cursor-pointer hover:bg-blue-100 ${
                    clienteSelecionado?.id === cliente.id ? 'bg-blue-100' : ''
                  }`}
                  onClick={(e) => handleModalClick(e, cliente)}
                >
                  <div>
                    <div className="font-medium">{cliente.nome}</div>
                    <div className="text-xs text-gray-500">
                      {cliente.email} | {cliente.telefone}
                    </div>
                    <div className="text-xs text-gray-400">
                      {cliente.codigoPostal} - {cliente.endereco}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!carregando && clientes.length === 0 && (
              <p className="text-sm text-gray-500 mt-4">Nenhum cliente encontrado.</p>
            )}
          </X.Container>
        </div>
      )}

      {/* Modal de Criação */}
      {mostrarModalCriacao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <X.Container className="w-full max-w-lg relative">
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-semibold">Criar Novo Cliente</p>
              <button onClick={() => setMostrarModalCriacao(false)} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
            </div>
            <X.Divider />

            <form onSubmit={handleSubmitCliente} className="space-y-4">
              <X.Field 
                required 
                type="text" 
                placeholder="Nome Completo" 
                name="nome"
                value={novoCliente.nome}
                onChange={handleInputChange}
              />
              <X.Field 
                required 
                type="email" 
                placeholder="Email" 
                name="email"
                value={novoCliente.email}
                onChange={handleInputChange}
              />
              <X.Field 
                required 
                type="tel" 
                placeholder="Telefone" 
                name="telefone"
                value={novoCliente.telefone}
                onChange={handleInputChange}
              />
              <X.Field 
                required 
                type="text" 
                placeholder="Código Postal" 
                name="codigoPostal"
                value={novoCliente.codigoPostal}
                onChange={handleInputChange}
              />
              <X.Field 
                required 
                type="text" 
                placeholder="Endereço Completo" 
                name="endereco"
                value={novoCliente.endereco}
                onChange={handleInputChange}
              />
              <X.Submit>
                Criar e Associar
              </X.Submit>
            </form>
          </X.Container>
        </div>
      )}
    </div>
  );
}