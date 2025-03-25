"use client";

import * as X from "@/components/xcomponents";
import { useState } from "react";

export default function AdicionarRegisto() {
  const [resumo, setResumo] = useState("AAAAA3");
  const [descricao, setDescricao] = useState(
    "Nuno Pinho vs Lidl.\n\nDisputa sobre a acusação de furto de uma embalagem de Compal de Manga por Nuno Pinho em uma loja Lidl.\n\nA Lidl alega o furto, enquanto Nuno Pinho nega a acusação."
  );

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Coluna Esquerda - Formulário (mantido igual) */}
        <X.Container className="w-full md:w-2/3">
          <h1 className="text-xl font-bold mb-2">Adicionar Registo - [43] #AAAA3</h1>
          <X.Divider />

          <div className="space-y-4">
            {/* Dropdown Acontecimento Jurídico */}
            <div>
              <X.Dropdown
                label="Acontecimento Jurídico"
                options={["Selecione...", "Processo Civil", "Processo Penal", "Processo Administrativo"]}
                onSelect={(option) => console.log(option)}
              />
            </div>

            {/* Dropdown Ida a Tribunal */}
            <div>
              <X.Dropdown
                label="Ida a Tribunal"
                options={["Selecione...", "Primeira Sessão", "Audiência de Instrução", "Audiência de Julgamento"]}
                onSelect={(option) => console.log(option)}
              />
            </div>

            {/* Resumo */}
            <div>
              <p className="font-semibold text-sm mb-1">Resumo</p>
              <X.Field
                value={resumo}
                onChange={(e) => setResumo(e.target.value)}
              />
            </div>

            {/* Descrição Detalhada e Botão Criar Caso */}
            <div className="flex flex-col">
              <div className="w-full">
                <p className="font-semibold text-sm mb-1">Descrição Detalhada</p>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full bg-[var(--secondary-color)] rounded p-2 focus:outline-none resize-none"
                  rows={5}
                />
              </div>

              <div className="pt-2 w-full">
                <X.ButtonLink className="block w-full bg-[var(--submit-color)] text-black !py-2">
                  Criar Caso
                </X.ButtonLink>
              </div>
            </div>
          </div>
        </X.Container>

        {/* Coluna Direita - Documentos (MODIFICADA) */}
        <X.Container className="w-full md:w-1/3">
          <h2 className="text-lg font-semibold mb-4">Documentos</h2>
          <X.ButtonLink className="mb-6 w-full">Adicionar Foto</X.ButtonLink>

          {/* Container das imagens - agora em coluna */}
          <div className="flex flex-col gap-4">
            {/* Caixa de imagem 1 - ocupa 100% da largura */}
            <X.DataField className="w-full h-32 flex items-center justify-center">
              <span className="text-gray-500">[Imagem]</span>
            </X.DataField>
            
            {/* Caixa de imagem 2 - ocupa 100% da largura */}
            <X.DataField className="w-full h-32 flex items-center justify-center">
              <span className="text-gray-500">[Imagem]</span>
            </X.DataField>
          </div>
        </X.Container>
      </div>
    </div>
  );
}