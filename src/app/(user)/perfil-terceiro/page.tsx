import * as X from "@/components/xcomponents";
import type { FunctionComponent } from "react";


export default function Perfil() {
  return (
    <div className="flex flex-row gap-8">
      <div className="w-full">
        <X.Container className="w-full">
        <div className="flex justify-between items-center">
        <p className="text-lg font-semibold">Perfil de 3º</p>
      </div>
          <X.Divider></X.Divider>
          <X.Dados titulo="Nome Completo" valor="Inácio Plebeu Matias" />
          <X.Dados titulo="Email" valor="Inácio Plebeu Matias" />
          <X.Dados titulo="Telefone" valor="Inácio Plebeu Matias" />
          <X.Dados titulo="Endereço" valor="Inácio Plebeu Matias" />
          <X.Dados titulo="NIF" valor="192323523" />
          <X.Dados titulo="Outros dados públicos e privados" valor="..." />
        </X.Container>
      </div>
    </div>
  );
}