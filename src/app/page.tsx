"use client"
import { useSession } from "next-auth/react";
import * as X from "../components/xcomponents";
import { FunctionComponent } from "react";
import { sys_users, UserRoles } from "@/types/roles";
import { useEffect, useState } from "react";
import { getCasosStats } from "./dashboard/actions";
import { CasoCount, CasosStats } from "./dashboard/actions";

const Casos: FunctionComponent = () => {
  const [casosData, setCasosData] = useState<CasosStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCasosStats();
        setCasosData(data);
      } catch (err) {
        setError("Erro ao carregar dados dos casos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mapeia os nomes dos estados para as cores e labels
  const estadoConfig: Record<string, { color: string; label: string }> = {
    "Aberto": { color: "--open-color", label: "Aberto" },
    "Fechado": { color: "--error-color", label: "Fechados" },
    "Terminado": { color: "--success-color", label: "Terminados" }
  };

  if (loading) {
    return (
      <X.Container className="w-full">
        <X.HeaderLink no_padding href="/casos">Casos</X.HeaderLink>
        <X.Divider></X.Divider>
        <X.DataField>Carregando...</X.DataField>
      </X.Container>
    );
  }

  if (error) {
    return (
      <X.Container className="w-full">
        <X.HeaderLink no_padding href="/casos">Casos</X.HeaderLink>
        <X.Divider></X.Divider>
        <X.DataField colorOverride="--error-color">{error}</X.DataField>
      </X.Container>
    );
  }

  return (
    <X.Container className="w-full">
      <X.HeaderLink no_padding href="/casos">Casos</X.HeaderLink>
      <X.Divider></X.Divider>
      
      {Object.entries(estadoConfig).map(([estado, config]) => {
        const countObj = casosData?.estados.find(c => c.estado === estado);
        const count = countObj ? countObj.count : 0;
        
        return (
          <X.DataField key={estado} colorOverride={config.color}>
            <div className="flex flex-row gap-4 w-full items-center">
              <div className="flex-1">{config.label}</div>
              <div className="flex-auto text-right">{count}</div>
            </div>
          </X.DataField>
        );
      })}
      
      <X.DataField>
        <div className="flex flex-row gap-4 w-full items-center">
          <div className="flex-1">Total</div>
          <div className="flex-auto text-right">{casosData?.total || 0}</div>
        </div>
      </X.DataField>
    </X.Container>
  );
};

const AcoesRapidas: FunctionComponent = () => {

  const { data: session } = useSession();
  const role = session?.user.role;

  const acoes = [
    { link: "/criar-colaborador", roles: [1], label:"Criar Colaborador" },
    { link: "/criar-caso", roles: [2], label:"Criar Caso" },
    { link: "/criar-cliente", roles: [2], label:"Criar Cliente" },
    { link: "/criar-evento", roles: [2], label:"Criar Evento" },

  ].filter((acao) => acao.roles.includes(role as number) || acao.roles.length == 0);

  return (
    <X.Container className="w-full">
      <p className="font-semibold">Ações Rápidas</p>
      <X.Divider></X.Divider>
      {acoes.map((acao) => (
        <X.ButtonLink href={acao.link}>{acao.label}</X.ButtonLink>
      ))}
    </X.Container>
  );
}
const Notificacoes: FunctionComponent = () => {
  return (
    <X.Container className="w-full">
      <X.HeaderLink no_padding href="/notificacoes">Notificações</X.HeaderLink>
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

  const { data: session } = useSession();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 w-full gap-8">
      {/* Column 1: Casos */}
      <div className="flex flex-col grow min-w-auto gap-8"> {/* Takes 2 vertical spaces */}
        <Casos />
      </div>

      <div className="flex flex-col grow min-w-auto gap-8">

        <X.Container className="w-full">
          <X.HeaderLink no_padding href="/colaboradores">Colaboradores</X.HeaderLink>
          <X.Divider></X.Divider>
          <X.DataField>
            <div className="flex flex-row gap-4 w-full items-center ">
              <div className="flex-1">Total</div>
              <div className="flex-auto text-right">9</div>
            </div>
          </X.DataField>
        </X.Container>

        <X.Container className="w-full">
          <X.HeaderLink no_padding href="/clientes">Clientes</X.HeaderLink>
          <X.Divider></X.Divider>
          <X.DataField>
            <div className="flex flex-row gap-4 w-full items-center ">
              <div className="flex-1">Total</div>
              <div className="flex-auto text-right">9</div>
            </div>
          </X.DataField>
        </X.Container>

        <X.Container className="w-full">
          <X.HeaderLink no_padding href="/casos">Top Casos</X.HeaderLink>
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

      <div className="flex flex-col grow min-w-auto gap-8">

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

      <div className="flex flex-col grow min-w-auto gap-8 row-start-1 lg:col-end-4 xl:col-end-5">
        <AcoesRapidas />
        {session?.user.role == 2 && <Notificacoes />}
      </div>
    </div>
  );
}