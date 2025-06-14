"use client"
import { useSession } from "next-auth/react";
import * as X from "../components/xcomponents";
import { FunctionComponent, useEffect, useState } from "react";
import { sys_users, UserRoles } from "@/types/roles";
import { fetchNotificacoes } from "./(notificacoes)/notificacoes/actions";
import { NotificacaoRecebida } from "@prisma/client";
import SimpleSkeleton from "@/components/loading/simple_skeleton";
import NotificacaoDetalhe from "./(notificacoes)/(notificacao)/notificacao";
import { getCasosStats, CasosStats, CasoCount } from "./dashboard/actions";
import { getTotalColaboradores } from "./dashboard/actions";
import { getTopColaborador } from "./dashboard/actions";
import { TopCliente, TopColaborador } from "./dashboard/actions";
import { getTotalClientes } from "./dashboard/actions";
import { getTopCliente } from "./dashboard/actions";
import { getMaiorDivida, MaiorDivida as MaiorDividaType } from "./dashboard/actions";
import { getFaturamentoStats, FaturamentoStats } from "./dashboard/actions";

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
    { link: "/criar-colaborador", roles: [1], label: "Criar Colaborador" },
    { link: "/criar-caso", roles: [2], label: "Criar Caso" },
    { link: "/criar-cliente", roles: [2], label: "Criar Cliente" },
    { link: "/criar-evento", roles: [2], label: "Criar Evento" },

  ].filter((acao) => acao.roles.includes(role as number) || acao.roles.length == 0);

  return (
    <X.Container className="w-full">
      <p className="font-semibold">Ações Rápidas</p>
      <X.Divider></X.Divider>
      {acoes.map((acao) => (
        <X.ButtonLink key={acao.link} href={acao.link}>{acao.label}</X.ButtonLink>
      ))}
    </X.Container>
  );
}

const ColaboradoresStats: FunctionComponent = () => {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const count = await getTotalColaboradores();
        setTotal(count);
      } catch (err) {
        setError("Erro ao carregar dados dos colaboradores");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <X.Container className="w-full">
        <X.HeaderLink no_padding href="/colaboradores">Colaboradores</X.HeaderLink>
        <X.Divider></X.Divider>
        <X.DataField>Carregando...</X.DataField>
      </X.Container>
    );
  }

  if (error) {
    return (
      <X.Container className="w-full">
        <X.HeaderLink no_padding href="/colaboradores">Colaboradores</X.HeaderLink>
        <X.Divider></X.Divider>
        <X.DataField colorOverride="--error-color">{error}</X.DataField>
      </X.Container>
    );
  }

  return (
    <X.Container className="w-full">
      <X.HeaderLink no_padding href="/colaboradores">Colaboradores</X.HeaderLink>
      <X.Divider></X.Divider>
      <X.DataField>
        <div className="flex flex-row gap-4 w-full items-center">
          <div className="flex-1">Total</div>
          <div className="flex-auto text-right">{total}</div>
        </div>
      </X.DataField>
    </X.Container>
  );
};

const TopCasos: FunctionComponent = () => {
  const [topColaborador, setTopColaborador] = useState<TopColaborador | null>(null);
  const [topCliente, setTopCliente] = useState<TopCliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [colaborador, cliente] = await Promise.all([
          getTopColaborador(),
          getTopCliente()
        ]);

        setTopColaborador(colaborador);
        setTopCliente(cliente);
      } catch (err) {
        setError("Erro ao carregar dados dos top casos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <X.Container className="w-full">
        <X.HeaderLink no_padding href="/casos">Top Casos</X.HeaderLink>
        <X.Divider></X.Divider>
        <X.DataField>Carregando...</X.DataField>
      </X.Container>
    );
  }

  if (error) {
    return (
      <X.Container className="w-full">
        <X.HeaderLink no_padding href="/casos">Top Casos</X.HeaderLink>
        <X.Divider></X.Divider>
        <X.DataField colorOverride="--error-color">{error}</X.DataField>
      </X.Container>
    );
  }

  return (
    <X.Container className="w-full">
      <X.HeaderLink no_padding href="/casos">Top Casos</X.HeaderLink>
      <X.Divider></X.Divider>

      <p className="font-semibold">Colaborador:</p>
      <X.Link href={`/colaboradores/${topColaborador?.user_id}`}>
        [{topColaborador?.user_id}] {topColaborador?.nome}
      </X.Link>
      <X.DataField>
        <div className="flex flex-row gap-4 w-full items-center">
          <div className="flex-1">Total</div>
          <div className="flex-auto text-right">{topColaborador?.count || 0}</div>
        </div>
      </X.DataField>

      <p className="font-semibold">Cliente:</p>
      <X.Link href={`/clientes/${topCliente?.cliente_id}`}>
        [{topCliente?.cliente_id}] {topCliente?.nome}
      </X.Link>
      <X.DataField>
        <div className="flex flex-row gap-4 w-full items-center">
          <div className="flex-1">Total</div>
          <div className="flex-auto text-right">{topCliente?.count || 0}</div>
        </div>
      </X.DataField>
    </X.Container>
  );
};

const Notificacoes: FunctionComponent = () => {

  const { data: session } = useSession();
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const [currentNot, setNotif] = useState<any>(null);

  const loadData = async () => {
    try {
      const data = await fetchNotificacoes(Number(session?.user.id), 3);
      setNotificacoes(data);
    } catch (err) {
      console.error("Erro ao carregar notificacoes:", err);
    }
  };

  useEffect(() => {
    if (!session?.user?.id) return;
    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 30000);
    return () => clearInterval(interval);
  }, [session?.user?.id]);

  if (notificacoes == undefined) return <SimpleSkeleton></SimpleSkeleton>;

  
  return (
    <X.Container className="w-full">
      <X.HeaderLink no_padding href="/notificacoes">Notificações</X.HeaderLink>
      <X.Divider></X.Divider>
      {notificacoes.map((noti) => (
        <X.Notification key={noti.id} className="w-full" notificacao={noti.notificacao} lida={noti.lida} onClick={() => { setNotif(noti); }} >
        </X.Notification>
      ))}
      <X.Popup isOpen={currentNot} title="Notificação" onClose={() => { setNotif(null); loadData(); }}>
        <NotificacaoDetalhe notif={currentNot} ></NotificacaoDetalhe>
      </X.Popup>
    </X.Container>
  );
}



const ClientesStats: FunctionComponent = () => {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const count = await getTotalClientes();
        setTotal(count);
      } catch (err) {
        setError("Erro ao carregar dados dos clientes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <X.Container className="w-full">
        <X.HeaderLink no_padding href="/clientes">Clientes</X.HeaderLink>
        <X.Divider></X.Divider>
        <X.DataField>Carregando...</X.DataField>
      </X.Container>
    );
  }

  if (error) {
    return (
      <X.Container className="w-full">
        <X.HeaderLink no_padding href="/clientes">Clientes</X.HeaderLink>
        <X.Divider></X.Divider>
        <X.DataField colorOverride="--error-color">{error}</X.DataField>
      </X.Container>
    );
  }

  return (
    <X.Container className="w-full">
      <X.HeaderLink no_padding href="/clientes">Clientes</X.HeaderLink>
      <X.Divider></X.Divider>
      <X.DataField>
        <div className="flex flex-row gap-4 w-full items-center">
          <div className="flex-1">Total</div>
          <div className="flex-auto text-right">{total}</div>
        </div>
      </X.DataField>
    </X.Container>
  );
};

const FaturamentoStats: FunctionComponent = () => {
  const [faturamentoData, setFaturamentoData] = useState<FaturamentoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFaturamentoStats();
        setFaturamentoData(data);
      } catch (err) {
        setError("Erro ao carregar dados de faturamento");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <X.Container className="w-full">
        <p className="font-semibold">Faturamento</p>
        <X.Divider></X.Divider>
        <X.DataField>Carregando...</X.DataField>
      </X.Container>
    );
  }

  if (error) {
    return (
      <X.Container className="w-full">
        <p className="font-semibold">Faturamento</p>
        <X.Divider></X.Divider>
        <X.DataField colorOverride="--error-color">{error}</X.DataField>
      </X.Container>
    );
  }

  return (
    <X.Container className="w-full">
      <p className="font-semibold">Faturamento</p>
      <X.Divider></X.Divider>
      <X.DataField colorOverride="--error-color">
        <div className="flex flex-row gap-4 w-full items-center">
          <div className="flex-1">A Receber</div>
          <div className="flex-auto text-right">€ {faturamentoData?.valor_a_receber.toFixed(2) || '0.00'}</div>
        </div>
      </X.DataField>
      <X.DataField colorOverride="--success-color">
        <div className="flex flex-row gap-4 w-full items-center">
          <div className="flex-1">Total Pago</div>
          <div className="flex-auto text-right">€ {faturamentoData?.total_pago.toFixed(2) || '0.00'}</div>
        </div>
      </X.DataField>
    </X.Container>
  );
};

const MaiorDivida: FunctionComponent = () => {
  const [maiorDivida, setMaiorDivida] = useState<MaiorDividaType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMaiorDivida();
        setMaiorDivida(data);
      } catch (err) {
        setError("Erro ao carregar dados da maior dívida");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <X.Container className="w-full">
        <p className="font-semibold">Maior Dívida</p>
        <X.Divider></X.Divider>
        <X.DataField>Carregando...</X.DataField>
      </X.Container>
    );
  }

  if (error) {
    return (
      <X.Container className="w-full">
        <p className="font-semibold">Maior Dívida</p>
        <X.Divider></X.Divider>
        <X.DataField colorOverride="--error-color">{error}</X.DataField>
      </X.Container>
    );
  }

  if (!maiorDivida) {
    return (
      <X.Container className="w-full">
        <p className="font-semibold">Maior Dívida</p>
        <X.Divider></X.Divider>
        <X.DataField>Nenhuma dívida pendente</X.DataField>
      </X.Container>
    );
  }

  return (
    <X.Container className="w-full">
      <p className="font-semibold">Maior Dívida</p>
      <X.Divider></X.Divider>
      <X.Link href={`/caso/${maiorDivida.caso_id}`}>
        Caso: [{maiorDivida.caso_id}] {maiorDivida.titulo_caso} 
      </X.Link>
      <X.DataField colorOverride="--error-color">
        <div className="flex flex-row gap-4 w-full items-center">
          <div className="flex-1">Valor em dívida</div>
          <div className="flex-auto text-right">€ {maiorDivida.valor_divida.toFixed(2)}</div>
        </div>
      </X.DataField>
    </X.Container>
  );
};

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 w-full gap-8">
      <div className="flex flex-col grow min-w-auto gap-8">
        <Casos />
      </div>

      <div className="flex flex-col grow min-w-auto gap-8">
        <ColaboradoresStats />
        <ClientesStats />
        <TopCasos />
      </div>

      <div className="flex flex-col grow min-w-auto gap-8">
        <FaturamentoStats />
        <MaiorDivida />
      </div>

      <div className="flex flex-col grow min-w-auto gap-8 row-start-1 lg:col-end-4 xl:col-end-5">
        <AcoesRapidas />
        {session?.user.role == 2 && <Notificacoes />}
      </div>
    </div>
  );
}