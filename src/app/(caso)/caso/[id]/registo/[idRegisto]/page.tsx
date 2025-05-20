'use client';

import { useEffect, useState } from "react";
import { fetchRegistroProfile, updateRegistroProfile } from "./actions";
import { useParams } from "next/navigation";
import * as X from "@/components/xcomponents";
import SimpleSkeleton from "@/components/loading/simple_skeleton";

export default function RegistroPerfil() {
  const params = useParams();
  const registroId = Number(params.idRegisto);
  const casoId = Number(params.idcaso);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [registroData, setRegistroData] = useState({
    tipo: "",
    resumo: "",
    descricao: "",
  });

  useEffect(() => {
    const carregar = async () => {
      try {
        setIsLoading(true);
        if (!registroId) throw new Error("ID do registo inválido");
        const data = await fetchRegistroProfile(registroId);
        setRegistroData(data);
      } catch (e) {
        console.error("Erro ao carregar registro:", e);
      } finally {
        setIsLoading(false);
      }
    };
    if (registroId) carregar();
  }, [registroId]);

  const handleFieldChange = (field: keyof typeof registroData) => (value: string) => {
    setRegistroData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEditMode = async () => {
    if (isEditing) {
      try {
        setIsLoading(true);
        const { tipo, ...updateData } = registroData;
        const updated = await updateRegistroProfile(registroId, updateData);
        setRegistroData(prev => ({ ...prev, ...updated }));
      } catch (e) {
        console.error("Erro ao atualizar:", e);
      } finally {
        setIsLoading(false);
      }
    }
    setIsEditing(!isEditing);
  };

  if (isLoading && !registroData.resumo) {
    return <SimpleSkeleton />;
  }

  return (
    <div className="flex flex-col gap-8">
      <X.Container className="w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Detalhes do Registro</h1>
          <button
  onClick={toggleEditMode}
  className="p-2 rounded-full hover:bg-gray-700 transition-colors"
  disabled={isLoading}
  aria-label={isEditing ? "Guardar alterações" : "Editar registro"}
>
  {isLoading ? (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
  ) : isEditing ? (
    <img src="/images/icons/check.svg" className="h-5 w-5" alt="Guardar" />
  ) : (
    <img src="/images/icons/edit.svg" className="h-5 w-5" alt="Editar" />
  )}
</button>

        </div>
        
        <X.Divider />
        
        <div className="space-y-4">
          <DadosField
            titulo="Tipo"
            valor={registroData.tipo}
            editando={false}
            disabled
          />
          
          <DadosField
            titulo="Resumo"
            valor={registroData.resumo}
            editando={isEditing}
            onMudanca={handleFieldChange("resumo")}
          />
          
          <DadosField
            titulo="Descrição"
            valor={registroData.descricao}
            editando={isEditing}
            onMudanca={handleFieldChange("descricao")}
            textarea
          />
        </div>
      </X.Container>
    </div>
  );
}

interface DadosFieldProps {
  titulo: string;
  valor: string;
  editando?: boolean;
  onMudanca?: (novoValor: string) => void;
  disabled?: boolean;
  textarea?: boolean;
}

const DadosField: React.FC<DadosFieldProps> = ({
  titulo,
  valor,
  editando = false,
  onMudanca,
  disabled = false,
  textarea = false
}) => (
  <X.Container className="w-full">
    <div className="space-y-2">
      <h2 className="text-base font-semibold text-white">{titulo}</h2>
      {editando && !disabled ? (
        textarea ? (
          <textarea
            value={valor}
            onChange={(e) => onMudanca && onMudanca(e.target.value)}
            className="text-lg text-gray-300 bg-gray-700 p-2 rounded w-full border border-gray-600 focus:border-blue-500 focus:outline-none min-h-[100px]"
          />
        ) : (
          <input
            type="text"
            value={valor}
            onChange={(e) => onMudanca && onMudanca(e.target.value)}
            className="text-lg text-gray-300 bg-gray-700 p-2 rounded w-full border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        )
      ) : (
        <p className="text-lg text-gray-300 whitespace-pre-wrap">{valor || "Não definido"}</p>
      )}
    </div>
  </X.Container>
);