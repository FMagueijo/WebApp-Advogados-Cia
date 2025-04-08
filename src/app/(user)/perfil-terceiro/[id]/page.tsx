"use client";

import * as X from "@/components/xcomponents";
import type { FunctionComponent } from "react";
import { useState, useEffect } from "react";
import { fetchUserProfile, updateUserProfile } from "./actions";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import { useParams } from "next/navigation";

const Suporte: FunctionComponent = () => {
  return (
    <X.Container className="w-full">
      <p className="font-semibold">Área de Suporte</p>
      <X.Divider />
      <X.ButtonLink>Definir Nova Password</X.ButtonLink>
      <X.ButtonLink>Contactar Admin</X.ButtonLink>
    </X.Container>
  );
};

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
  <X.Container className="w-full">
    <div className="space-y-2">
      <h2 className="text-base font-semibold text-white">{titulo}</h2>
      {editando ? (
        <input
          type="text"
          value={valor}
          onChange={(e) => onMudanca && onMudanca(e.target.value)}
          className={`text-lg text-gray-300 bg-gray-700 p-1 rounded w-full border border-gray-600 focus:border-blue-500 focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          disabled={disabled}
        />
      ) : (
        <p className="text-lg text-gray-500">{valor || "Não definido"}</p>
      )}
    </div>
  </X.Container>
);

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
);

export default function PerfilPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<User | null>(null);

  const params = useParams();
  const user_id = params.id as string;

  useEffect(() => {
    const loadProfileData = async () => {
      if (!session?.user?.id) return;

      try {
        setIsLoading(true);
        const userId = Number(user_id);
        const data = await fetchUserProfile(userId) as User;
        setProfileData(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [session]);

  
  if (isLoading && profileData == null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
        <span className="ml-2">Carregando perfil...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
        <X.Container className="w-full">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">{ profileData?.nome } | <span> Perfil</span></h1>
          </div>

          <X.Divider />

          <div className="space-y-4">
            <DadosField
              titulo="Nome Completo"
              valor={profileData.nome}
            />

            <DadosField
              titulo="Email"
              valor={profileData.email}
              disabled={true}
            />

            <DadosField
              titulo="Telefone"
              valor={profileData.telefone}
            />

            <DadosField
              titulo="Código Postal"
              valor={profileData.codigo_postal}
            />

            <DadosField
              titulo="Endereço"
              valor={profileData.endereco}
            />
          </div>
        </X.Container>
    </div>
  );
}