"use client";

import * as X from "@/components/xcomponents";
import type { FunctionComponent } from "react";
import { useState, useEffect } from "react";
import { fetchUserProfile, updateUserProfile, updatePassword,contactAdmin } from "./actions";
import { useSession } from "next-auth/react";
import { useFormState, useFormStatus } from "react-dom";

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
);
const Suporte: FunctionComponent = () => {
  const { data: session } = useSession();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordSubmit = async (formData: FormData) => {
    try {
      formData.append('userId', session?.user?.id?.toString() || ''); // Add user ID
      const result = await updatePassword(formData);
      if (result?.success) {
        setMessage({ type: 'success', text: "Senha atualizada com sucesso!" });
        setShowPasswordForm(false);
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : "Erro ao atualizar senha" 
      });
    }
  };

  const handleContactSubmit = async (formData: FormData) => {
    try {
      if (!session?.user?.email) {
        throw new Error("Não foi possível identificar seu email. Por favor, faça login novamente.");
      }
  
      const completeFormData = new FormData();
      completeFormData.append('message', formData.get('message') as string);
      completeFormData.append('title', formData.get('assunto') as string);
      completeFormData.append('userEmail', session.user.email);
      // No need to pass admin email anymore - it's hardcoded
  
      const result = await contactAdmin(completeFormData, Number(session.user.id));
      if (result?.success) {
        setMessage({ type: 'success', text: "Mensagem enviada para joao.silva@email.com com sucesso!" }); // Updated success message
        setShowContactForm(false);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : "Erro ao enviar mensagem para o administrador"
      });
    }
  };
  return (
    <X.Container className="w-full">
      <p className="font-semibold">Área de Suporte</p>
      <X.Divider />
      
      {showPasswordForm ? (
        <form action={handlePasswordSubmit} className="space-y-4">
          <X.Field
            required
            type="password"
            placeholder="Nova Senha"
            name="newPassword"
          />
          <X.Field
            required
            type="password"
            placeholder="Confirmar Nova Senha"
            name="confirmPassword"
          />
          
          {message && (
            <div className={`text-sm ${
              message.type === 'success' ? 'text-green-500' : 'text-red-500'
            }`}>
              {message.text}
            </div>
          )}

          <div className="flex gap-2">
            <X.Submit>Atualizar Senha</X.Submit>
            <X.Button
              onClick={() => setShowPasswordForm(false)}
            >
              Cancelar
            </X.Button>
          </div>
        </form>
      ) : showContactForm ? (
        <form action={handleContactSubmit} className="space-y-4">
          <X.Field
            required
            placeholder="Assunto"
            name="assunto"
            className="w-full"
          />
          <X.Textarea
            required  
            placeholder="Digite sua mensagem"
            name="message"
            className="w-full"
          />
          {message && (
            <div className={`text-sm ${
              message.type === 'success' ? 'text-green-500' : 'text-red-500'
            }`}>
              {message.text}
            </div>
          )}

          <div className="flex gap-2">
            <X.Submit>Enviar Mensagem</X.Submit>
            <X.Button
              onClick={() => setShowContactForm(false)}
            >
              Cancelar
            </X.Button>
          </div>
        </form>
      ) : (
        <X.Button onClick={() => setShowPasswordForm(true)} className="w-full text-center">
          Definir Nova Password
        </X.Button>
      )}
      <X.Button 
            onClick={() => setShowContactForm(true)}
            className="w-full text-center"
          >
            Contactar Admin
          </X.Button>
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
          className={`text-lg text-gray-300 bg-gray-700 p-1 rounded w-full border border-gray-600 focus:border-blue-500 focus:outline-none ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={disabled}
        />
      ) : (
        <p className="text-lg text-gray-500">{valor || "Não definido"}</p>
      )}
    </div>
  </X.Container>
);

export default function PerfilPage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    codigo_postal: ""
  });

  useEffect(() => {
    const loadProfileData = async () => {
      if (!session?.user?.id) return;
      
      try {
        setIsLoading(true);
        const userId = Number(session.user.id);
        const data = await fetchUserProfile(userId);
        setProfileData(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [session]);

  const toggleEditMode = async () => {
    if (isEditing) {
      try {
        setIsLoading(true);
        if (!session?.user?.id) return;
        
        const userId = Number(session.user.id);
        const updatedData = await updateUserProfile(userId, {
          nome: profileData.nome,
          telefone: profileData.telefone,
          endereco: profileData.endereco,
          codigo_postal: profileData.codigo_postal
        });
        
        setProfileData(prev => ({ ...prev, ...updatedData }));
      } catch (error) {
        console.error("Failed to update profile:", error);
      } finally {
        setIsLoading(false);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleFieldChange = (field: keyof typeof profileData) => 
    (value: string) => {
      setProfileData(prev => ({ ...prev, [field]: value }));
    };

  if (isLoading && !profileData.nome) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
        <span className="ml-2">Carregando perfil...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-2/3 space-y-6">
        <X.Container className="w-full">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Meu Perfil</h1>
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
          
          <div className="space-y-4">
            <DadosField
              titulo="Nome Completo"
              valor={profileData.nome}
              editando={isEditing}
              onMudanca={handleFieldChange('nome')}
            />
            
            <DadosField
              titulo="Email"
              valor={profileData.email}
              disabled={true}
            />
            
            <DadosField
              titulo="Telefone"
              valor={profileData.telefone}
              editando={isEditing}
              onMudanca={handleFieldChange('telefone')}
            />
            
            <DadosField
              titulo="Código Postal"
              valor={profileData.codigo_postal}
              editando={isEditing}
              onMudanca={handleFieldChange('codigo_postal')}
            />
            
            <DadosField
              titulo="Endereço"
              valor={profileData.endereco}
              editando={isEditing}
              onMudanca={handleFieldChange('endereco')}
            />
          </div>
        </X.Container>
      </div>
      
      <div className="w-full md:w-1/3">
        <Suporte />
      </div>
    </div>
  );
}