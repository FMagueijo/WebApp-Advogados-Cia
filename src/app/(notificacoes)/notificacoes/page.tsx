"use client";
import * as X from "@/components/xcomponents";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchNotificacoes, limparNotificacoes, marcarTodasComoLidas } from "./actions";
import SimpleSkeleton from "@/components/loading/simple_skeleton";
import NotificacaoDetalhe from "../(notificacao)/notificacao";

export default function Notificacoes() {

  const { data: session } = useSession();
  const [notifs, setNotificacoes] = useState<any[]>([]);

  const [currentNot, setNotif] = useState<any>(null);

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

  if (notifs == undefined || notifs == null) return <SimpleSkeleton></SimpleSkeleton>;

  return (

    <div className="flex justify-center">
      <X.Container className="w-full max-w-4xl">
        <p className="text-lg font-semibold">Notificações</p>
        <X.Divider></X.Divider>
        <div className="flex items-center gap-4">
          <X.Button className="w-max" onClick={() => { marcarTodasComoLidas(Number(session?.user.id)); loadData(); }}>Marcar todas como lidas</X.Button>
        </div>
        {notifs.map((noti) => (
          <X.Notification key={noti.id} className="w-full" notificacao={noti.notificacao} lida={noti.lida} onClick={() => { setNotif(noti); }} >
          </X.Notification>
        ))}
      </X.Container>
      <X.Popup isOpen={currentNot} title="Notificação" onClose={() => { setNotif(null); loadData(); }}>
        <NotificacaoDetalhe notif={currentNot} ></NotificacaoDetalhe>
      </X.Popup>
    </div>
  );
}