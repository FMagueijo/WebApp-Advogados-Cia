"use client";

import * as X from "@/components/xcomponents";
import Link from "next/link";

export default function EventoPage() {
  return (
    <div className="w-full">
      <X.Container className="w-full !p-6 !border-2 !border-[var(--primary-color)]">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Evento</h1>
          <Link 
            href="#" 
            className="flex items-center gap-2 text-blue-500 hover:underline"
            target="_blank"
          >
            Abrir no Google Calendar
            <span className="text-lg">💬</span>
          </Link>
        </div>

        <X.Divider/>

        {/* Seção Assume */}
        <div className="mb-4">
          <h2 className="font-semibold mb-1">Assume</h2>
          <X.DataField className="!bg-[var(--secondary-color)]">
            Ida a Tribunal
          </X.DataField>
        </div>

        {/* Seção Data/Nota */}
        <div className="mb-4">
          <h2 className="font-semibold mb-1">Data/Nota</h2>
          <X.DataField className="!bg-[var(--secondary-color)]">
            23 Fevereiro 2025 - 14:30
          </X.DataField>
        </div>

        {/* Seção Evento Global */}
        <div className="mb-6">
          <h2 className="font-semibold mb-1">Evento Global</h2>
          <X.DataField className="!bg-[var(--secondary-color)]">
            Sim
          </X.DataField>
        </div>

        <X.Divider/>

        {/* Seção Criado Por */}
        <div className="mb-4">
          <h2 className="font-semibold mb-2">Criado Por</h2>
          <X.DataField className="!bg-[var(--secondary-color)]">
            [4] Telmo Maia
          </X.DataField>
        </div>

        {/* Seção Casos Associados */}
        <div className="mb-4">
          <h2 className="font-semibold mb-2">Casos Associados</h2>
          <X.DataField className="!bg-[var(--secondary-color)]">
            [43] #AAA43
          </X.DataField>
        </div>

        {/* Seção Colaboradores Associados */}
        <div>
          <h2 className="font-semibold mb-2">Colaboradores Associados</h2>
          <X.DataField className="!bg-[var(--secondary-color)]">
            [4] Telmo Maia
          </X.DataField>
        </div>
      </X.Container>
    </div>
  );
}