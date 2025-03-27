"use client"

import * as X from "@/components/xcomponents";
import type { FunctionComponent } from "react";
import { useState } from "react";

const Suporte: FunctionComponent = () => {
  return (
    <X.Container className="w-full">
      <p className="font-semibold">Área de Suporte</p>
      <X.Divider></X.Divider>
      <X.ButtonLink>Definir Nova Password</X.ButtonLink>    
      <X.ButtonLink>Contactar Admin</X.ButtonLink>    
    </X.Container>
  );
}

interface DadosProps {
  titulo: string;
  valor: string;
  editando?: boolean;
  onMudanca?: (novoValor: string) => void;
}

const Dados: React.FC<DadosProps> = ({ titulo, valor, editando = false, onMudanca }) => (
  <X.Container className="w-full">
    <div className="space-y-2">
      <h2 className="text-base font-semibold text-white">{titulo}</h2> 
      {editando ? (
        <input
          type="text"
          value={valor}
          onChange={(e) => onMudanca && onMudanca(e.target.value)}
          className="text-lg text-gray-300 bg-gray-700 p-1 rounded w-full border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
      ) : (
        <p className="text-lg text-gray-500">{valor}</p>
      )}
    </div>
  </X.Container>
);

export default function Perfil() {
  const [editando, setEditando] = useState(false);
  const [dados, setDados] = useState({
    nome: "Inácio Plebeu Matias",
    email: "inacio@example.com",
    telefone: "+351 912 345 678",
    endereco: "Rua Exemplo, 123, Lisboa",
    outros: "..."
  });

  const alternarEdicao = () => {
    setEditando(!editando);
  };

  const handleMudanca = (campo: keyof typeof dados) => (novoValor: string) => {
    setDados(prev => ({ ...prev, [campo]: novoValor }));
  };

  return (
    <div className="flex flex-row gap-8">
      <div className="flex flex-col gap-8 w-2/3">
        <X.Container className="w-full">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">O meu perfil</p>
            <button 
              onClick={alternarEdicao}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              aria-label={editando ? "Salvar" : "Editar"}
            >
              <img src="/images/icons/edit.svg" className="h-6" />
            </button>
          </div>
          <X.Divider></X.Divider>
          <Dados 
            titulo="Nome Completo" 
            valor={dados.nome} 
            editando={editando}
            onMudanca={handleMudanca('nome')}
          />
          <Dados 
            titulo="Email" 
            valor={dados.email} 
            editando={editando}
            onMudanca={handleMudanca('email')}
          />
          <Dados 
            titulo="Telefone" 
            valor={dados.telefone} 
            editando={editando}
            onMudanca={handleMudanca('telefone')}
          />
          <Dados 
            titulo="Endereço" 
            valor={dados.endereco} 
            editando={editando}
            onMudanca={handleMudanca('endereco')}
          />
          <Dados 
            titulo="Outros dados públicos e privados" 
            valor={dados.outros} 
            editando={editando}
            onMudanca={handleMudanca('outros')}
          />
        </X.Container>
      </div>

      <div className="flex flex-col gap-8 w-1/3">
        <Suporte />
      </div>
    </div>
  );
}