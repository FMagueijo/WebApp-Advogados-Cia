"use client"
import React from 'react';
import * as X from "@/components/xcomponents";

const AgendaPage = () => {
    return (
        <X.Container className="w-full">
            <h2 className="text-xl font-semibold mb-4">Agenda</h2>
            <X.Divider />
            
            {/* Filtros */}
            <div className="flex flex-row gap-4 mb-4">
                <X.Dropdown
                    label="Filtros"
                    options={["Fechado", "Terminado"]}
                    onSelect={(selectedOption) => console.log("Opção selecionada:", selectedOption)}
                />
                <X.Dropdown
                    label="Ordenar"
                    options={["Fechado", "Terminado"]}
                    onSelect={(selectedOption) => console.log("Opção selecionada:", selectedOption)}
                />
            </div>
            <X.Divider />
            
            <X.Container>
            <X.Container className="grid grid-cols-3 gap-4">
  {/* Cabeçalho */}
  <div className="font-bold border-b p-2">Hora</div>
  <div className="font-bold border-b p-2">Código</div>
  <div className="font-bold border-b p-2">Descrição</div>
  
  {/* Linhas */}
  <div className="p-2">14:30</div>
  <div className="p-2">#AAAA3</div>
  <div className="p-2">Ida a Tribunal</div>
  
  <div className="p-2">09:30</div>
  <div className="p-2">#AAA17</div>
  <div className="p-2">Destacamento</div>
</X.Container>
            </X.Container>
        </X.Container>
    );
};

export default AgendaPage;