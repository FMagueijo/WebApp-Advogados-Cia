import * as X from "@/components/xcomponents";
import type { FunctionComponent } from "react";

const Suporte: FunctionComponent = () => {
  return (
    <X.Container className="w-full">
      <p className="font-semibold">Área de Suporte</p>
      <X.Divider></X.Divider>
      <X.ButtonLink>Definir Nova Password</X.ButtonLink>    
      <X.ButtonLink>Contactar Admin</X.ButtonLink>    
    </X.Container>
  );
}

interface DadosProps {
  titulo: string;
  valor: string;
}

const Dados: React.FC<DadosProps> = ({ titulo, valor }) => (
    <X.Container className="w-full">
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-white">{titulo}</h2> 
        <p className="text-lg text-gray-700">{valor}</p> 
      </div>
    </X.Container>
  );

export default function Perfil() {
  return (
    <div className="flex flex-row gap-8">
      <div className="flex flex-col gap-8 w-2/3">
        <X.Container className="w-full">
        <div className="flex justify-between items-center">
        <p className="text-lg font-semibold">O meu perfil</p>
        <img src="/images/icons/edit.svg" className="h-6" /> 
  </div>
          <X.Divider></X.Divider>
          <Dados titulo="Nome Completo" valor="Inácio Plebeu Matias" />
          <Dados titulo="Email" valor="Inácio Plebeu Matias" />
          <Dados titulo="Telefone" valor="Inácio Plebeu Matias" />
          <Dados titulo="Endereço" valor="Inácio Plebeu Matias" />
          <Dados titulo="Outros dados públicos e privados" valor="..." />
        </X.Container>
      </div>

      <div className="flex flex-col gap-8 w-1/3">
        <Suporte />
      </div>
    </div>
  );
}