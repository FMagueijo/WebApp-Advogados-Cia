import * as X from "@/components/xcomponents";
import type { FunctionComponent } from "react";

interface DadosProps {
  titulo: string;
  valor: string;
}

const Dados: React.FC<DadosProps> = ({ titulo, valor }) => (
    <X.Container className="w-full">
      <div className="space-y-2">
        <h2 className="text-base font-semibold text-white">{titulo}</h2> 
        <p className="text-lg text-gray-500">{valor}</p> 
      </div>
    </X.Container>
  );

export default function Perfil() {
  return (
    <div className="flex flex-row gap-8">
      <div className="w-full">
        <X.Container className="w-full">
        <div className="flex justify-between items-center">
        <p className="text-lg font-semibold">Perfil de 3º</p>
      </div>
          <X.Divider></X.Divider>
          <Dados titulo="Nome Completo" valor="Inácio Plebeu Matias" />
          <Dados titulo="Email" valor="Inácio Plebeu Matias" />
          <Dados titulo="Telefone" valor="Inácio Plebeu Matias" />
          <Dados titulo="Endereço" valor="Inácio Plebeu Matias" />
          <Dados titulo="NIF" valor="192323523" />
          <Dados titulo="Outros dados públicos e privados" valor="..." />
        </X.Container>
      </div>
    </div>
  );
}