import * as X from "../components/xcomponents";
import { FunctionComponent } from "react";

const Casos: FunctionComponent = () => {
  return (
    <X.Container className="w-full">
      <X.HeaderLink no_padding>Casos</X.HeaderLink>
      <X.Divider></X.Divider>
      <X.DataField colorOverride="--open-color">
        <div className="flex flex-row gap-4 w-full items-center ">
          <div className="flex-1">Em Aberto</div>
          <div className="flex-auto text-right">9</div>
        </div>
      </X.DataField>
      <X.DataField colorOverride="--error-color">
        <div className="flex flex-row gap-4 w-full items-center ">
          <div className="flex-1">Fechados</div>
          <div className="flex-auto text-right">9</div>
        </div>
      </X.DataField>
      <X.DataField colorOverride="--success-color">
        <div className="flex flex-row gap-4 w-full items-center ">
          <div className="flex-1">Terminados</div>
          <div className="flex-auto text-right">9</div>
        </div>
      </X.DataField>
      <X.DataField>
        <div className="flex flex-row gap-4 w-full items-center ">
          <div className="flex-1">Total</div>
          <div className="flex-auto text-right">31</div>
        </div>
      </X.DataField>
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
const Notificacoes: FunctionComponent = () => {
  return (
    <X.Container className="w-full">
       <X.HeaderLink no_padding>Notificações</X.HeaderLink>
      <X.Divider></X.Divider>
      <X.Link> Novo Caso<br></br>
      <small style={{ color: "#999" }}>
      Novo caso criado para...
  </small></X.Link>
  <X.Link> Caso Encerrado <br></br>
  <small style={{ color: "#999" }}>
  O caso #43 foi fechado...
  </small></X.Link>
      
    </X.Container>
  );



}
export default function Home() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 w-full gap-8">
      {/* Column 1: Casos */}
      <div className="flex flex-col grow gap-8 min-w-auto gap-8"> {/* Takes 2 vertical spaces */}
        <Casos />
      </div>

      <div className="flex flex-col grow gap-8 min-w-auto gap-8">

        <X.Container className="w-full">
          <X.HeaderLink no_padding>Colaboradores</X.HeaderLink>
          <X.Divider></X.Divider>
          <X.DataField>
            <div className="flex flex-row gap-4 w-full items-center ">
              <div className="flex-1">Total</div>
              <div className="flex-auto text-right">9</div>
            </div>
          </X.DataField>
        </X.Container>

        <X.Container className="w-full">
          <X.HeaderLink no_padding>Clientes</X.HeaderLink>
          <X.Divider></X.Divider>
          <X.DataField>
            <div className="flex flex-row gap-4 w-full items-center ">
              <div className="flex-1">Total</div>
              <div className="flex-auto text-right">9</div>
            </div>
          </X.DataField>
        </X.Container>

        <X.Container className="w-full">
          <X.HeaderLink no_padding>Top Casos</X.HeaderLink>
          <X.Divider></X.Divider>
          <p className="font-semibold">Colaborador:</p>
          <X.Link>[4] Telmo Maia</X.Link>
          <X.DataField>
            <div className="flex flex-row gap-4 w-full items-center ">
              <div className="flex-1">Total</div>
              <div className="flex-auto text-right">13</div>
            </div>
          </X.DataField>
          <p className="font-semibold">Cliente:</p>
          <X.Link>[23] Nuno Pinho</X.Link>
          <X.DataField>
            <div className="flex flex-row gap-4 w-full items-center ">
              <div className="flex-1">Total</div>
              <div className="flex-auto text-right">7</div>
            </div>
          </X.DataField>
        </X.Container>

      </div>

      <div className="flex flex-col grow gap-8 min-w-auto gap-8">

        <X.Container className="w-full">
          <p className="font-semibold">Faturamento</p>
          <X.Divider></X.Divider>
          <X.DataField colorOverride="--submit-color">
            <div className="flex flex-row gap-4 w-full items-center ">
              <div className="flex-1">A Receber</div>
              <div className="flex-auto text-right">€ 500</div>
            </div>
          </X.DataField>
          <X.DataField colorOverride="--submit-color">
            <div className="flex flex-row gap-4 w-full items-center ">
              <div className="flex-1">Total Pago</div>
              <div className="flex-auto text-right">€ 34.5m</div>
            </div>
          </X.DataField>
        </X.Container>

        <X.Container className="w-full">
          <p className="font-semibold">Maior Divida</p>
          <X.Divider></X.Divider>
          <X.Link>[23] Nuno Pinho</X.Link>
          <X.DataField colorOverride="--submit-color">
            <div className="flex flex-row gap-4 w-full items-center ">
              <div className="flex-auto text-right">€ 500</div>
            </div>
          </X.DataField>
        </X.Container>
      </div>

      <div className="flex flex-col grow gap-8 min-w-auto gap-8 row-start-1 lg:col-end-4 xl:col-end-5">
        <AcoesRapidas />
        <Notificacoes/>
      </div>
    </div>
  );
}