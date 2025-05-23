import { getDashboardData } from "@/app/dashboard/actions.ts";
import { FunctionComponent } from "react";
import { Container, Divider, DataField, HeaderLink, ButtonLink, Link } from "../components/xcomponents";
import { getServerSession } from "next-auth";

export default async function Home() {
  const data = await getDashboardData();

  const { casos, colaboradores, clientes, faturamento, maiorDivida, topColaborador, topCliente, session } = data;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 w-full gap-8">
      {/* Casos */}
      <div className="flex flex-col gap-8"> 
        <Container className="w-full">
          <HeaderLink no_padding href="/casos">Casos</HeaderLink>
          <Divider />
          <DataField colorOverride="--open-color">
            <div className="flex justify-between">
              <div>Em Aberto</div>
              <div>{casos.abertos}</div>
            </div>
          </DataField>
          <DataField colorOverride="--error-color">
            <div className="flex justify-between">
              <div>Fechados</div>
              <div>{casos.fechados}</div>
            </div>
          </DataField>
          <DataField colorOverride="--success-color">
            <div className="flex justify-between">
              <div>Terminados</div>
              <div>{casos.terminados}</div>
            </div>
          </DataField>
          <DataField>
            <div className="flex justify-between">
              <div>Total</div>
              <div>{casos.total}</div>
            </div>
          </DataField>
        </Container>
      </div>

      {/* Colaboradores, Clientes, Top Casos */}
      <div className="flex flex-col gap-8">
        <Container className="w-full">
          <HeaderLink no_padding href="/colaboradores">Colaboradores</HeaderLink>
          <Divider />
          <DataField>
            <div className="flex justify-between">
              <div>Total</div>
              <div>{colaboradores}</div>
            </div>
          </DataField>
        </Container>

        <Container className="w-full">
          <HeaderLink no_padding href="/clientes">Clientes</HeaderLink>
          <Divider />
          <DataField>
            <div className="flex justify-between">
              <div>Total</div>
              <div>{clientes}</div>
            </div>
          </DataField>
        </Container>

        <Container className="w-full">
          <HeaderLink no_padding href="/casos">Top Casos</HeaderLink>
          <Divider />
          <p className="font-semibold">Colaborador:</p>
          <Link>[{topColaborador?.id}] {topColaborador?.nome}</Link>
          <DataField>
            <div className="flex justify-between">
              <div>Total</div>
              <div>{topColaborador?.casos.length}</div>
            </div>
          </DataField>
          <p className="font-semibold">Cliente:</p>
          <Link>[{topCliente?.id}] {topCliente?.nome}</Link>
          <DataField>
            <div className="flex justify-between">
              <div>Total</div>
              <div>{topCliente?.casos.length}</div>
            </div>
          </DataField>
        </Container>
      </div>

      {/* Faturamento, Divida */}
      <div className="flex flex-col gap-8">
        <Container className="w-full">
          <p className="font-semibold">Faturamento</p>
          <Divider />
          <DataField colorOverride="--submit-color">
            <div className="flex justify-between">
              <div>A Receber</div>
              <div>€ {faturamento.aReceber}</div>
            </div>
          </DataField>
          <DataField colorOverride="--submit-color">
            <div className="flex justify-between">
              <div>Total Pago</div>
              <div>€ {faturamento.total}</div>
            </div>
          </DataField>
        </Container>

        <Container className="w-full">
          <p className="font-semibold">Maior Dívida</p>
          <Divider />
          {maiorDivida && (
            <>
              <Link>[{maiorDivida.cliente.id}] {maiorDivida.cliente.nome}</Link>
              <DataField colorOverride="--submit-color">
                <div className="flex justify-end">€ {maiorDivida.valor}</div>
              </DataField>
            </>
          )}
        </Container>
      </div>

      {/* Ações Rápidas + Notificações */}
      <div className="flex flex-col gap-8 row-start-1 lg:col-end-4 xl:col-end-5">
        <Container className="w-full">
          <p className="font-semibold">Ações Rápidas</p>
          <Divider />
          {[
            { link: "/criar-colaborador", roles: [1], label: "Criar Colaborador" },
            { link: "/criar-caso", roles: [2], label: "Criar Caso" },
            { link: "/criar-cliente", roles: [2], label: "Criar Cliente" },
            { link: "/criar-evento", roles: [2], label: "Criar Evento" },
          ]
            .filter((acao) => acao.roles.includes(session?.user.role) || acao.roles.length === 0)
            .map((acao) => <ButtonLink key={acao.link} href={acao.link}>{acao.label}</ButtonLink>)
          }
        </Container>

        {session?.user.role === 2 && (
          <Container className="w-full">
            <HeaderLink no_padding href="/notificacoes">Notificações</HeaderLink>
            <Divider />
            <Link>Novo Caso<br /><small style={{ color: "#999" }}>Novo caso criado para...</small></Link>
            <Link>Caso Encerrado<br /><small style={{ color: "#999" }}>O caso #43 foi fechado...</small></Link>
          </Container>
        )}
      </div>
    </div>
  );
}
