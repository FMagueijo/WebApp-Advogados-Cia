import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import * as X from "../components/xcomponents";
import type { FunctionComponent } from "react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}



const Casos: FunctionComponent = () => {
  return (
    <X.Container className="w-full">
      <p className="font-semibold">Ações Rápidas</p>
      <X.Divider></X.Divider>
      <X.ButtonLink>Criar Colaborador</X.ButtonLink>    
      <X.DataField>AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</X.DataField>
    </X.Container>
  );

}

const AcoesRapidas: FunctionComponent = () => {
  return (
    <X.Container className="w-full">
      <p className="font-semibold">Ações Rápidas</p>
      <X.Divider></X.Divider>
      <X.ButtonLink>Criar Colaborador</X.ButtonLink>
    </X.Container>
  );

}

export default function Home() {
  return (
    <div className="flex flex-row gap-8">
      <div className="flex flex-col gap-8 w-full">
        <X.Container className="w-full">
          a
        </X.Container>
        <X.Container className="w-full">
          a
        </X.Container>
      </div>
      <div className="flex flex-col gap-8 w-full">
        <X.Container className="w-full">
          a
        </X.Container>
        <X.Container className="w-full">
          a
        </X.Container>
      </div>
      <div className="flex flex-col gap-8 w-full">
        <X.Container className="w-full">
          a
        </X.Container>
        <Casos></Casos>
        <Casos></Casos>
        <Casos></Casos>
        <Casos></Casos>
      </div>
      <div className="flex flex-col gap-8 w-full">
        <AcoesRapidas></AcoesRapidas>
      </div>
    </div>
  );
}
