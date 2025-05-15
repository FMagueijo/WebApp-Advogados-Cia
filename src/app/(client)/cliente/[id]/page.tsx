"use client";

import * as X from "@/components/xcomponents";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchClientProfile, updateClientProfile } from "./action";
import SimpleSkeleton from "@/components/loading/simple_skeleton";

interface DadosFieldProps {
  titulo: string;
  valor: string;
  editando?: boolean;
  onMudanca?: (novoValor: string) => void;
  disabled?: boolean;
}

const DadosField: React.FC<DadosFieldProps> = ({
  titulo,
  valor,
  editando = false,
  onMudanca,
  disabled = false
}) => (
  <div className="space-y-2 w-full">
    <h2 className="text-base font-semibold text-white">{titulo}</h2>
    {editando ? (
      <input
        type="text"
        value={valor}
        onChange={(e) => onMudanca && onMudanca(e.target.value)}
        className={`text-lg text-gray-300 bg-gray-700 p-1 rounded w-full border border-gray-600 focus:border-blue-500 focus:outline-none ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={disabled}
      />
    ) : (
      <p className="text-lg text-gray-500 pb-4 border-b border-gray-700">
        {valor || "Não definido"}
      </p>
    )}
  </div>
);

export default function ClientDetailsPage() {
  const params = useParams();
  const [clientData, setClientData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState<any>(null);

  useEffect(() => {
    const loadClientData = async () => {
      try {
        setIsLoading(true);
        const clientId = Number(params.id);
        const data = await fetchClientProfile(clientId);
        setClientData(data);
        setTempData(data);
      } catch (error) {
        console.error("Failed to load client:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClientData();
  }, [params.id]);

  const toggleEditMode = async () => {
    if (isEditing) {
      try {
        setIsLoading(true);
        const updatedData = await updateClientProfile(Number(params.id), {
          nome: tempData.nome,
          telefone: tempData.telefone,
          endereco: tempData.endereco,
          codigoPostal: tempData.codigoPostal
        });
        
        setClientData(updatedData);
      } catch (error) {
        console.error("Failed to update client:", error);
      } finally {
        setIsLoading(false);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleFieldChange = (field: string) => (value: string) => {
    setTempData((prev: any) => ({ ...prev, [field]: value }));
  };

  if (!clientData && !isLoading) {
    return (
      <X.ErrorBox visible hideCloseButton>
        Não foi possível carregar o perfil do cliente.
      </X.ErrorBox>
    );
  }

  if (isLoading && !clientData) {
    return <SimpleSkeleton />;
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      <X.Container className="w-full">
        <div className="flex justify-between items-center pb-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">
            {clientData.nome}
          </h1>
          <button
            onClick={toggleEditMode}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            disabled={isLoading}
            aria-label={isEditing ? "Salvar alterações" : "Editar perfil"}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : isEditing ? (
              <img src="/images/icons/check.svg" className="h-5 w-5" alt="Salvar" />
            ) : (
              <img src="/images/icons/edit.svg" className="h-5 w-5" alt="Editar" />
            )}
          </button>
        </div>

        <div className="space-y-6 mt-6">
          <DadosField
            titulo="Nome Completo"
            valor={isEditing ? tempData.nome : clientData.nome}
            editando={isEditing}
            onMudanca={handleFieldChange('nome')}
          />
          
          <DadosField
            titulo="Email"
            valor={clientData.email}
            disabled={true}
          />
          
          <DadosField
            titulo="Telefone"
            valor={isEditing ? tempData.telefone : clientData.telefone}
            editando={isEditing}
            onMudanca={handleFieldChange('telefone')}
          />
          
          <DadosField
            titulo="Código Postal"
            valor={isEditing ? tempData.codigoPostal : clientData.codigoPostal}
            editando={isEditing}
            onMudanca={handleFieldChange('codigoPostal')}
          />
          
          <DadosField
            titulo="Endereço"
            valor={isEditing ? tempData.endereco : clientData.endereco}
            editando={isEditing}
            onMudanca={handleFieldChange('endereco')}
          />
        </div>
      </X.Container>

<X.Container className="w-full">
  <h2 className="text-lg font-semibold pb-4 border-b border-gray-700">
    Casos do Cliente
  </h2>
  
  {clientData.casos && clientData.casos.length > 0 ? (
    <div className="space-y-6 mt-6">
      {clientData.casos.map((caso: any) => (
        <div key={caso.id} className="space-y-4">
          <DadosField titulo="Processo" valor={caso.processo} />
          <DadosField titulo="Resumo" valor={caso.resumo} />
          <DadosField titulo="Estado" valor={caso.estado?.nome_estado} />
          {/* Adiciona a seção de dívidas */}
          <div className="space-y-2 w-full">
            <h2 className="text-base font-semibold text-white">Dívidas</h2>
            {caso.dividas && caso.dividas.length > 0 ? (
              caso.dividas.map((divida: any) => (
                <div key={divida.id} className="text-lg text-gray-500 pb-4 border-b border-gray-700">
                  Valor: {divida.valor.toFixed(2)}€ - Status: {divida.pago ? "Pago" : "Por Pagar"}
                </div>
              ))
            ) : (
              <p className="text-lg text-gray-500 pb-4 border-b border-gray-700">Nenhuma dívida registrada</p>
            )}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="mt-6 text-lg text-gray-500">Nenhum caso encontrado</p>
  )}
</X.Container>
    </div>
  );
}