"use client";

import * as X from "@/components/xcomponents";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchClientProfile } from "./action";
import SimpleSkeleton from "@/components/loading/simple_skeleton";

interface DadosFieldProps {
  titulo: string;
  valor: string;
  disabled?: boolean;
}

const DadosField: React.FC<DadosFieldProps> = ({
  titulo,
  valor,
  disabled = false
}) => (
  <div className="space-y-2 w-full">
    <h2 className="text-base font-semibold text-white">{titulo}</h2>
    <p className="text-lg text-gray-500 pb-4 border-b border-gray-700">
      {valor || "Não definido"}
    </p>
  </div>
);

export default function ClientDetailsPage() {
  const params = useParams();
  const [clientData, setClientData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadClientData = async () => {
      try {
        setIsLoading(true);
        const clientId = Number(params.id);
        const data = await fetchClientProfile(clientId);
        setClientData(data);
      } catch (error) {
        console.error("Failed to load client:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClientData();
  }, [params.id]);

  if (!clientData && !isLoading) {
    return (
      <X.ErrorBox visible hideCloseButton>
        Não foi possível carregar o perfil do cliente.
      </X.ErrorBox>
    );
  }

  if (isLoading) {
    return <SimpleSkeleton />;
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      <X.Container className="w-full">
        <h1 className="text-xl font-bold pb-4 border-b border-gray-700">
          {clientData.nome}
        </h1>
        
        <div className="space-y-6 mt-6">
          <DadosField
            titulo="Nome Completo"
            valor={clientData.nome}
          />
          
          <DadosField
            titulo="Email"
            valor={clientData.email}
            disabled={true}
          />
          
          <DadosField
            titulo="Telefone"
            valor={clientData.telefone}
          />
          
          <DadosField
            titulo="Código Postal"
            valor={clientData.codigoPostal}
          />
          
          <DadosField
            titulo="Endereço"
            valor={clientData.endereco}
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
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-6">Nenhum caso encontrado</p>
        )}
      </X.Container>
    </div>
  );
}