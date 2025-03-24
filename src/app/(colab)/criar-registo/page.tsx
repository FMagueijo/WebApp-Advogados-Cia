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
        {/* Coluna Esquerda - Formulário */}
        <X.Container className="w-full md:w-2/3 !p-6 !border-2 !border-[var(--primary-color)]">
          <h1 className="text-xl font-bold mb-2">Adicionar Registo - [43] #AAAA3</h1>
          <X.Divider/>

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
                className="!bg-[var(--secondary-color)] !border-none !p-2"
              />
            </div>

            {/* Descrição Detalhada */}
            <div>
              <p className="font-semibold text-sm mb-1">Descrição Detalhada</p>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full bg-[var(--secondary-color)] rounded p-2 focus:outline-none resize-none"
                rows={5}
              />
            </div>

            {/* Botão Criar Caso */}
            <div className="pt-2">
              <X.ButtonLink className="w-full bg-[var(--submit-color)] text-white !py-2">
                Criar Caso
              </X.ButtonLink>
            </div>
          </div>
        </X.Container>

        {/* Coluna Direita - Documentos COM BORDA BRANCA */}
        <X.Container className="w-full md:w-1/3 !p-6 !border-2 !border-white">
          <h2 className="text-lg font-semibold mb-4">Documentos</h2>
          <X.ButtonLink className="mb-6">Adicionar Foto</X.ButtonLink>
          
          <div className="flex flex-wrap gap-4">
            <X.DataField className="w-24 h-24 flex items-center justify-center">
              <span className="text-gray-500">[Imagem]</span>
            </X.DataField>
            <X.DataField className="w-24 h-24 flex items-center justify-center">
              <span className="text-gray-500">[Imagem]</span>
            </X.DataField>
          </div>
        </X.Container>
      </div>
    </div>
  );
}