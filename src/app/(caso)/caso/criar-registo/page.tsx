"use client";

import * as X from "@/components/xcomponents";
import { useState } from "react";
import { useSession } from 'next-auth/react';
import { criarRegistro } from "./actions";
import { useParams, useRouter } from 'next/navigation';

export default function AdicionarRegisto() {
  const { data: session } = useSession();
  const user = session?.user;
  const params = useParams();
  const router = useRouter();
  const casoId = parseInt(params.id as string);

  const [resumo, setResumo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("");
  const [tipoSecundario, setTipoSecundario] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      setErro('Utilizador não autenticado');
      return;
    }

    // Determina o tipo completo do registro
    const tipoCompleto = tipo === "Ida a Tribunal" ? `${tipo} - ${tipoSecundario}` : tipo;

    const formData = new FormData();
    formData.append('resumo', resumo);
    formData.append('descricao', descricao);
    formData.append('tipo', tipoCompleto);

    try {
      await criarRegistro(formData, user.id.toString(), casoId.toString());
      router.push(`/casos/${casoId}`);
    } catch (error) {
      setErro('Erro ao criar registro');
      console.error(error);
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
                  "Selecione...",
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
                    "Selecione...",
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
                    "Selecione...",
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
                <X.Submit>
                  Criar Registo
                </X.Submit>
              </div>
            </div>
          </form>
      </X.Container>
        <X.Container className="w-full md:w-1/3">
          <h2 className="text-lg font-semibold mb-4">Documentos</h2>
          <X.ButtonLink className="mb-6 w-full">Adicionar Foto</X.ButtonLink>

        <div className="flex flex-col gap-4">
            <X.DataField className="w-full h-32 flex items-center justify-center">
              <span className="text-gray-500">[Imagem]</span>
            </X.DataField>

            <X.DataField className="w-full h-32 flex items-center justify-center">
              <span className="text-gray-500">[Imagem]</span>
            </X.DataField>
          </div>
        </X.Container>
      </div>
    </div>
  );
}