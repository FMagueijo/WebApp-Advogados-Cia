"use client";
import * as X from "@/components/xcomponents";
import { criarCaso, listarClientes, criarCliente } from "./actions";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ListarClientes from "@/app/(client)/clientes/page";
import { ClienteList } from "@/components/lists/listar_clientes";
import FormCriarCliente from "@/components/forms/criar-cliente/page";
import { redirect } from "next/navigation";

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  codigoPostal: string;
  endereco: string;
}

export default function CriarCaso() {
  const { data: session } = useSession();
  const user = session?.user;

  const [clientes, setClientes] = useState<any[]>([]);
  const [clientesSelecionados, setClientesSelecionados] = useState<Cliente[]>([]);
  const [mostrarModalSelecao, setMostrarModalSelecao] = useState(false);
  const [mostrarModalCriacao, setMostrarModalCriacao] = useState(false);
  const [novoCliente, setNovoCliente] = useState<Omit<Cliente, 'id'>>({
    nome: '',
    email: '',
    telefone: '',
    codigoPostal: '',
    endereco: ''
  });

  useEffect(() => {
    const carregarClientes = async () => {
      try {
        const resultado = await listarClientes();
        setClientes(resultado);
      } catch (error) {
        console.error(error);
      } finally {
      }
    };

    carregarClientes();
  }, []);


  const handleSubmitCaso = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.id) {
      return;
    }

    const form = new FormData(e.currentTarget);
    clientesSelecionados.forEach(cliente => {
      form.append('clientesIds', cliente.id.toString());
    });

    try {
      await criarCaso(form, user.id.toString());
      // Reset form or redirect if needed
      //redirect('/casos');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitCliente = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {

      const clienteCriado = await criarCliente({
        nome: e.currentTarget.nome.value,
        email: e.currentTarget.email.value,
        telefone: e.currentTarget.telefone.value,
        codigoPostal: e.currentTarget.codigoPostal.value,
        endereco: e.currentTarget.endereco.value
      });
      setClientes([...clientes, clienteCriado]);
      setClientesSelecionados([...clientesSelecionados, clienteCriado]);
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
            <X.Submit disabled={clientesSelecionados.length === 0}>
              Criar Caso
            </X.Submit>
          </form>
        </X.Container>

        {/* Lado direito */}
        <X.Container className="xl:w-1/3 h-max">
          <p className="font-semibold">Clientes Associados ({clientesSelecionados.length})</p>
          <X.Divider />

          <div className="flex flex-col gap-2 mb-4">
            <X.Button onClick={() => setMostrarModalSelecao(true)}>
              Adicionar Cliente Existente
            </X.Button>

            <X.Button onClick={() => setMostrarModalCriacao(true)}>
              Criar Novo Cliente
            </X.Button>
          </div>

          <X.Divider />

          <div className="space-y-3">
            {clientesSelecionados.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum cliente selecionado</p>
            ) : (
              clientesSelecionados.map(cliente => (

                <div key={cliente.id} className="flex items-center gap-4">
                  <X.Button
                    onClick={() =>
                      setClientesSelecionados((prevCases) =>
                        prevCases.filter((c) => c.id !== cliente.id)
                      )
                    }
                  >
                    <img
                      className={"min-w-6 flex-shrink-0"}
                      src={"/images/icons/close.svg"}
                      alt={cliente.nome}
                    />
                  </X.Button>
                  <X.Link href={`/caso/${cliente.id}`} className="w-full">
                    [{cliente.id}] #{cliente.nome}
                  </X.Link>
                </div>
              ))
            )}
          </div>
        </X.Container>
      </div>
      <X.Popup title="Selecionar Clientes" isOpen={mostrarModalSelecao} onClose={() => setMostrarModalSelecao(false)}>
        <ClienteList
          selectedCaseIds={clientesSelecionados.map(cliente => cliente.id)}
          onSelect={(clientes) => { setClientesSelecionados(clientes); console.log(clientes); }}
          mode="select"
        ></ClienteList>
      </X.Popup>
      <X.Popup title="Criar Novo Cliente" isOpen={mostrarModalCriacao} onClose={() => setMostrarModalCriacao(false)}>
        <FormCriarCliente onClose={() => { setMostrarModalCriacao(false); }} onSubmit={handleSubmitCliente}></FormCriarCliente>
      </X.Popup>

    </div>
  );
} 