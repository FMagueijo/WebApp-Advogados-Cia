"use client";

import * as X from "@/components/xcomponents";
import { useState, type FunctionComponent } from "react";

const Suporte: FunctionComponent = () => {
   const [colaboradores] = useState([
      { id: 1, nome: "Humberto Macedo", email: "boy.macedo@hotmail.com", casos: 4, estado: "Desbloqueado", ativo: false },
      { id: 2, nome: "Nuno Pinho", email: "npinho@outlook.com", casos: 7, estado: "Desbloqueado", ativo: false },
      { id: 3, nome: "Mariana Silva", email: "advmarisilva@gmail.com", casos: 3, estado: "Bloqueado", ativo: true },
      { id: 4, nome: "Telmo Maia", email: "telmo.ma.ia@gmail.com", casos: 13, estado: "Desbloqueado", ativo: false },
    ]);
  return (
    <>
    <X.Container className="w-full">
      <p className="font-semibold">Lista Registos</p>
      <X.Divider></X.Divider>
      <div className="flex flex-row">
      <X.ButtonLink>Adicionar registo</X.ButtonLink>   
      </div>
      <div className="flex flex-row gap-4">
      <X.Dropdown 
                        label="Filtros"
                        options={["", ""]}
                        onSelect={(selectedOption) => console.log("Opção selecionada:", selectedOption)}
                      />   
      <X.Dropdown 
                        label="Ordenar"
                        options={["Data Ascendente ", "Data Desscendente"]}
                        onSelect={(selectedOption) => console.log("Opção selecionada:", selectedOption)}
                      />    
      </div> 
      <X.Divider></X.Divider>
      <div className="overflow-x-auto">
  <table className="w-full">
    <thead>
      <tr className="text-left ">
        <th className="p-3">Resumo</th>
        <th className="p-3">Data Criada</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-[var(--secondary-color)]">
        <td className="p-2"><X.Link className="group"><div>Reuniao</div> </X.Link></td>
        <td className="p-2"><X.DataField className="group"><div>14/02/2025 17:20 </div> </X.DataField></td>
      </tr>
      <tr className="border-b border-[var(--secondary-color)]">
        <td className="p-2"><X.Link className="group"><div>Ev - Ida Tribunal</div> </X.Link></td>
        <td className="p-2"><X.DataField className="group"><div>10/02/2025 14:20 </div> </X.DataField></td>
      </tr>
    </tbody>
  </table>
</div> 
    </X.Container>
    <X.Container className="w-full">
    <p className="font-semibold">Colaboradores Associados </p>
    <X.Divider></X.Divider>
    <div className="flex flex-row">
      <X.ButtonLink>Associar colaborador</X.ButtonLink>   
      </div>
      <X.Divider></X.Divider>
        <X.Link>[23] Nuno Pinho</X.Link>
    </X.Container>
    </>
  );
  
}




export default function perfilCaso() {
  return (
    <div className="flex flex-row gap-8">
      <div className="flex flex-col gap-8 w-2/3">
        <X.Container className="w-full" >
        <div className="flex justify-between items-center">
        <p className="text-lg font-semibold">Estado caso</p>
      </div>
          <X.Divider></X.Divider>
           <X.Dropdown 
                        label="Aberto"
                        options={["Aberto","Fechado", "Terminado"]}
                        onSelect={(selectedOption) => console.log("Opção selecionada:", selectedOption)}
                      /> 
                      

        </X.Container>
        <X.Container className="w-full" >   
        <div className="flex justify-between items-center">
        <p className="text-lg font-semibold">Info geral</p>
      </div>
          <X.Divider></X.Divider>
          <X.Container className="w-full">
          <p className="text-lg font-semibold"> [ID] processo</p>
          <p> [43] #AAA43</p>
          </X.Container>
          <X.Container className="w-full">
          <p className="text-lg font-semibold"> Resumo </p>
          <p>  Roubo - Disputa</p>
          </X.Container>
          <X.Container className="w-full">
          <p className="text-lg font-semibold"> Descrição detalhada </p>
          <p>Nuno Pinho vs Lidl.</p>
          <p>Disputa sobre a acusação de furto de uma embalagem de Compal de Manga por Nuno Pinho em uma loja Lidl.</p>
          <p>A Lidl alega o furto, enquanto Nuno Pinho nega a acusação.</p>
          </X.Container>
        </X.Container>
      </div>
      
      

      <div className="flex flex-col gap-8 w-1/3">
        <Suporte />
      </div>
    </div>
  );
}