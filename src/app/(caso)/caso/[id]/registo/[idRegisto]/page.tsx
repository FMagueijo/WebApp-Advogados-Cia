'use client';

import { useEffect, useState } from "react";
import { fetchRegistroProfile, updateRegistroProfile } from "./actions";
import { useParams } from "next/navigation";
import * as X from "@/components/xcomponents";
import SimpleSkeleton from "@/components/loading/simple_skeleton";

interface Documento {
  id: number;
  nome: string;
  caminho: string;
  tipo: string;
  tamanho: number;
  public_id: string;
}

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
    documentos: [] as Documento[],
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
        const { tipo, documentos, ...updateData } = registroData;
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

const handleDownload = async (documento: Documento) => {
  try {
    // Para todos os tipos de arquivo, tentamos primeiro o download direto
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    
    // Se for um arquivo do Cloudinary (contém 'res.cloudinary.com' no caminho)
    if (documento.caminho.includes('res.cloudinary.com') && cloudName) {
      // Extrai o public_id do caminho ou usa o public_id direto
      const publicId = documento.public_id || 
                      documento.caminho.split('/')
                        .slice(7) // Remove as partes iniciais da URL
                        .join('/')
                        .replace(/\..+$/, ''); // Remove a extensão do arquivo
      
      // Cria URL de download direto
      const downloadUrl = `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}`;
      
      // Cria link temporário
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = documento.nome;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Para arquivos que não são do Cloudinary ou quando cloudName não está disponível
      // Usa abordagem genérica com fetch
      const response = await fetch(documento.caminho);
      if (!response.ok) throw new Error('Falha ao buscar o arquivo');
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = documento.nome;
      document.body.appendChild(link);
      link.click();

      // Limpeza
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
    }
  } catch (error) {
    console.error("Erro ao baixar documento:", error);
    // Fallback: abre em nova aba se o download falhar
    window.open(documento.caminho, '_blank');
  }
};
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

      {/* Seção de Documentos */}
      {registroData.documentos && registroData.documentos.length > 0 && (
        <X.Container className="w-full">
          <h1 className="text-xl font-bold mb-4">Documentos Anexados</h1>
          <X.Divider />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {registroData.documentos.map((documento) => {
              const isPDF = documento.tipo === 'application/pdf';
              const isImage = documento.tipo.startsWith('image/');

              return (
                <X.Container key={documento.id} className="p-4 flex flex-col gap-2 group relative">
                  {isPDF ? (
                    <div className="flex flex-col items-center justify-center bg-gray-700 rounded-md p-8 h-full">
                      <img
                        src="/images/icons/pdf-icon.svg"
                        alt="PDF Icon"
                        className="w-16 h-16 mb-2"
                      />
                      <span className="text-sm">PDF Document</span>
                    </div>
                  ) : isImage ? (
                    <div className="relative aspect-square overflow-hidden rounded-md">
                      <img
                        src={documento.caminho}
                        alt={documento.nome}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center bg-gray-700 rounded-md p-8 h-full">
                      <img
                        src="/images/icons/file-icon.svg"
                        alt="File Icon"
                        className="w-16 h-16 mb-2"
                      />
                      <span className="text-sm">{documento.tipo.split('/')[1] || 'File'}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate" title={documento.nome}>
                        {documento.nome}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatFileSize(documento.tamanho)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownload(documento)}
                      className="p-1 hover:bg-gray-700 rounded"
                      aria-label="Download"
                    >
                      <img src="/images/icons/download.svg" className="h-5 w-5" alt="Download" />
                    </button>
                  </div>

                  {/* Mostra mensagem de erro se o download falhar */}
                  {documento.error && (
                    <p className="text-red-500 text-xs mt-1">{documento.error}</p>
                  )}
                </X.Container>
              );
            })}
          </div>
        </X.Container>
      )}
    </div>
  );
}

// O componente DadosField permanece o mesmo
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