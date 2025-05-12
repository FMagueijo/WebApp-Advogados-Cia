"use client";

import * as X from "@/components/xcomponents";
import { useState, useRef } from "react";
import { useSession } from 'next-auth/react';
import { criarRegistro } from "./actions";
import { notFound, useParams, useRouter } from 'next/navigation';

export default function AdicionarRegisto() {
  const { data: session } = useSession();
  const user = session?.user;
  const params = useParams();
  const router = useRouter();
  const casoId = parseInt(params.id as string);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  if (!casoId || isNaN(Number(casoId))) {
    notFound();
  }

  const [resumo, setResumo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("Acontecimento Jurídico");
  const [tipoSecundario, setTipoSecundario] = useState("");
  const [erro, setErro] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    if (!user?.id) {
      setErro('Utilizador não autenticado');
      setIsCreating(false);
      return;
    }

    const tipoCompleto = tipo === "Ida a Tribunal" ? `${tipo} - ${tipoSecundario}` : tipo;

    const formData = new FormData();
    formData.append('resumo', resumo);
    formData.append('descricao', descricao || '');
    formData.append('tipo', tipoCompleto);
    formData.append('userId', user.id.toString());
    formData.append('casoId', casoId.toString());
    
    // Adiciona arquivos ao FormData
    files.forEach((file, index) => {
      formData.append(`file-${index}`, file);
    });

    try {
      await criarRegistro(formData);
      router.push(`/caso/${casoId}`);
    } catch (error) {
      setErro('Erro ao criar registro');
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-8">
        <X.Container className="w-full md:w-2/3">
          <h1 className="text-xl font-bold mb-2">Adicionar Registo</h1>
          <X.Divider />
          {erro && <p className="text-red-500 mb-4">{erro}</p>}


          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <X.Dropdown
                label="Tipo de Registo"
                options={[
                  "Acontecimento Jurídico",
                  "Ida a Tribunal"
                ]}
                onSelect={(option) => {
                  setTipo(option);
                  setTipoSecundario("");
                }}

              />
            </div>

            {tipo === "Ida a Tribunal" && (
              <div>
                <X.Dropdown
                  label="Tipo de Audiência"
                  options={[
                    "Primeira Sessão",
                    "Audiência de Instrução",
                    "Audiência de Julgamento"
                  ]}
                  onSelect={setTipoSecundario}

                />
              </div>
            )}

            {tipo === "Acontecimento Jurídico" && (
              <div>
                <X.Dropdown
                  label="Tipo de Processo"
                  options={[
                    "Processo Civil",
                    "Processo Penal",
                    "Processo Administrativo"
                  ]}
                  onSelect={setTipoSecundario}

                />
              </div>
            )}

            <div>
              <p className="font-semibold text-sm mb-1">Resumo</p>
              <X.Field
                value={resumo}
                onChange={(e) => setResumo(e.target.value)}
                required
                placeholder="Resumo do registo"
              />
            </div>
 <div className="flex flex-col">
              <div className="w-full">
                <p className="font-semibold text-sm mb-1">Descrição Detalhada</p>
                <X.Textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={5}
                  placeholder="Descrição detalhada do registo"
                />
              </div>

              <div className="pt-2 w-full">
                <X.Submit disabled={isCreating}>
                  {isCreating ? 'Criando...' : 'Criar Registo'}
                </X.Submit>
              </div>
            </div>
          </form>
        </X.Container>

        <X.Container className="w-full md:w-1/3">
          <h2 className="text-lg font-semibold mb-4">Documentos</h2>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept="image/*,.pdf,.doc,.docx"
          />
          
          <X.Button 
            type="button"
            className="mb-6 w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            Adicionar Documentos
          </X.Button>

          <div className="flex flex-col gap-4">
            {files.length === 0 ? (
              <X.DataField className="w-full h-32 flex items-center justify-center">
                <span className="text-gray-500">Nenhum documento adicionado</span>
              </X.DataField>
            ) : (
              files.map((file, index) => (
                <X.DataField key={index} className="w-full p-3 flex items-center justify-between">
                  <div className="truncate flex-1">
                    {file.name}
                    <span className="text-xs text-gray-500 block">
                      {(file.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remover
                  </button>
                </X.DataField>
              ))
            )}
          </div>
        </X.Container>
      </div>
    </div>
  );
}