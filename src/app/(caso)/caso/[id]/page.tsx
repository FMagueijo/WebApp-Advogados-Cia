"use client";

import * as X from "@/components/xcomponents";
import { useSession } from "next-auth/react";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState, type FunctionComponent } from "react";
import { fetchCasoProfile, updateCasoEstado } from "./actions";
import SimpleSkeleton from "@/components/loading/simple_skeleton";

const Suporte: FunctionComponent = () => {
  const params = useParams();
  const id = params?.id;


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
          <X.ButtonLink href={`/caso/${id}/criar-registo`}>Adicionar registo</X.ButtonLink>
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
                <td className="p-2"><X.Link className="group"><div>Reuniao  (TEMP)</div> </X.Link></td>
                <td className="p-2"><X.DataField className="group"><div>14/02/2025 17:20 </div> </X.DataField></td>
              </tr>
              <tr className="border-b border-[var(--secondary-color)]">
                <td className="p-2"><X.Link className="group"><div>Ev - Ida Tribunal  (TEMP)</div> </X.Link></td>
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
        <X.Link>[23] Nuno Pinho (TEMP)</X.Link>
      </X.Container>
    </>
  );

}




export default function perfilCaso() {
  const params = useParams();
  const id = params?.id;

  if (!id || isNaN(Number(id))) {
    notFound(); // This renders the closest not-found.tsx
  }


  const { data: session } = useSession();
  
  const [estado, setEstado] = useState(false);


  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    id: "",
    processo: "",
    resumo: "",
    descricao: "",
    estado: "",
  });

  useEffect(() => {
    const loadProfileData = async () => {
      if (!session?.user?.id) return;

      try {
        setIsLoading(true);
        const casoId = Number(id);
        const data = await fetchCasoProfile(casoId);
        setProfileData(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [session]);

  const handleEstadoChange = async (newEstado: string) => {
    try {
      setIsLoading(true);
      // Simulate an API call to update the estado
      console.log(`Updating estado to: ${newEstado}`);
      updateCasoEstado(Number(id), newEstado);
      setProfileData((prevData) => ({ ...prevData, estado: newEstado }));
    } catch (error) {
      console.error("Failed to update estado:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if(isLoading){
    return <SimpleSkeleton></SimpleSkeleton>;
  }
  if(!profileData){
    return <X.ErrorBox visible hideCloseButton>Caso não encontrado.</X.ErrorBox>
  }


  return (
    <div className="flex flex-row gap-8">
      <div className="flex flex-col gap-8 w-2/3">
        <X.Container className="w-full" >
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Estado caso</p>
          </div>
          <X.Divider></X.Divider>
          <X.Dropdown
            label="Estado"
            options={["Aberto", "Fechado", "Terminado"]}
            defaultIndex={["Aberto", "Fechado", "Terminado"].indexOf(profileData.estado)}
            onSelect={handleEstadoChange}
          />
        </X.Container>
        <X.Container className="w-full" >
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Info geral</p>
          </div>
          <X.Divider></X.Divider>
          <X.Container className="w-full">
            <p className="text-lg font-semibold"> [ID] Processo </p>
            <p> [{id}] #{profileData.processo}</p>
          </X.Container>
          <X.Container className="w-full">
            <p className="text-lg font-semibold"> Resumo </p>
            <p> {profileData.resumo}</p>
          </X.Container>
          <X.Container className="w-full">
            <p className="text-lg font-semibold"> Descrição detalhada </p>
            {profileData.descricao}
          </X.Container>
        </X.Container>
      </div>



      <div className="flex flex-col gap-8 w-1/3">
        <Suporte />
      </div>
    </div>
  );
}