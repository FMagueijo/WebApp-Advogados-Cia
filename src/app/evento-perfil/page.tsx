"use client";

import * as X from "@/components/xcomponents";
import { useState } from "react";

export default function EventoPage() {
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row">
        {/* Coluna Esquerda - Detalhes do Evento */}
        <X.Container className="w-full md:w-1/2 !rounded-none md:!rounded-r-lg">
          <div className="p-6 space-y-6">
            <h1 className="text-xl font-bold mb-4">Evento</h1>
            
            {/* Abrir no Google Calendar */}
            <X.Link href="#" className="flex items-center gap-2 mb-6">
              <span>Abrir no Google Calendar</span>
            </X.Link>

            {/* Box Assunto */}
            <X.DataField className="!p-4">
              <div>
                <span className="font-bold">Assunto</span>
                <p className="mt-1">Ida a Tribunal</p>
              </div>
            </X.DataField>

            {/* Box Data/Nota */}
            <X.DataField className="!p-4">
              <div>
                <span className="font-bold">Data/Nota</span>
                <p className="mt-1">23 Fevereiro 2025 - 14:30</p>
              </div>
            </X.DataField>

            {/* Box Evento Global */}
            <X.DataField className="!p-4">
              <div>
                <span className="font-bold">Evento Global</span>
                <p className="mt-1">Sim</p>
              </div>
            </X.DataField>
          </div>
        </X.Container>

        {/* Coluna Direita - Informações Associadas */}
        <div className="w-full md:w-1/2">
          {/* Criado Por */}
          <X.Container className="!rounded-none md:!rounded-l-lg">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Criado Por</h2>
              <X.Link href="#">
                [4] Telmo Maia
              </X.Link>
            </div>
          </X.Container>

          {/* Casos Associados */}
          <X.Container className="!rounded-none">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Casos Associados</h2>
              <X.Link href="#">
                [43] #AAAA3
              </X.Link>
            </div>
          </X.Container>

          {/* Colaboradores Associados */}
          <X.Container className="!rounded-none md:!rounded-bl-lg">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Colaboradores Associados</h2>
              <X.Link href="#">
                [4] Telmo Maia
              </X.Link>
            </div>
          </X.Container>
        </div>
      </div>
    </div>
  );
}