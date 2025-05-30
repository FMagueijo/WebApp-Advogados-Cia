"use client";
import * as X from "@/components/xcomponents";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchNotificacoes, limparNotificacoes, marcarTodasComoLidas } from "./actions";
import SimpleSkeleton from "@/components/loading/simple_skeleton";

export default function Notificacoes() {

  const { data: session } = useSession();
  const [notifs, setNotificacoes] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const data = await fetchNotificacoes(Number(session?.user.id), null);
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

  if (notifs == undefined) return <SimpleSkeleton></SimpleSkeleton>;

  return (

    <div className="flex justify-center">
      <X.Container className="w-full max-w-4xl">
        <p className="text-lg font-semibold">Notificações</p>
        <X.Divider></X.Divider>
        <div className="flex items-center gap-4">
          <X.Button className="w-max" onClick={() => { marcarTodasComoLidas(Number(session?.user.id)); loadData(); }}>Marcar todas como lidas</X.Button>
          <X.Button className="w-max" onClick={() => { limparNotificacoes(Number(session?.user.id)); loadData(); }}>Limpar Notificações</X.Button>
        </div>
        {notifs.map((noti) => (
          <X.Notification key={noti.id} className="w-full" notificacao={noti.notificacao} lida={noti.lida} >
          </X.Notification>
        ))}
      </X.Container>
    </div>
  );

  const notificacoes = [
    {
      id: 1,
      titulo: "Estado do caso 123 alterado",
      mensagem: "O estado do caso foi alterado de aberto para fechado",
      data: "10 minutos atrás",
      lida: false
    },
    {
      id: 2,
      titulo: "Tem um novo evento na genda",
      mensagem: "Foi adiciona uma reuniao dia 25 de março de 2025 na sua agenda ",
      data: "2 horas atrás",
      lida: true
    },
    {
      id: 3,
      titulo: "Estado do caso 234 alterado",
      mensagem: "O estado do caso foi alterado de aberto para fechado",
      data: "1 dia atrás",
      lida: true
    },
    {
      id: 4,
      titulo: "Estado do caso 598 alterado",
      mensagem: "O estado do caso foi alterado de aberto para fechado",
      data: "2 dias atrás",
      lida: false
    }
  ];

  return (
    <div className="flex justify-center  min-h-screen">
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="flex flex-row gap-2">
          <div className="flex flex-col gap-2 w-full">
            <X.Container className="w-full ">
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">Notificações</p>
                <X.Button>Marcar todas como lidas</X.Button>
              </div>
              <X.Divider></X.Divider>

              <div className="space-y-4">
                {notificacoes.map((notificacao) => (
                  <div
                    key={notificacao.id}
                    className={`p-4 rounded-lg border ${notificacao.lida ? 'bg-black-500' : 'bg-black-500 bg-black-500'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`font-medium ${notificacao.lida ? 'bg-black-700' : 'text-white-700'}`}>
                          {notificacao.titulo}
                        </p>
                        <p className="text-sm text-gray-0">{notificacao.mensagem}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-200">{notificacao.data}</span>

                        {!notificacao.lida && (
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </X.Container>
          </div>
        </div>
      </div>
    </div>
  );
}