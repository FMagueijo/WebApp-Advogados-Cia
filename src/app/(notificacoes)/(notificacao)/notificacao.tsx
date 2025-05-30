"use client";
import * as X from "@/components/xcomponents";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apagarNotificacoes, fetchNotificacao, fetchNotificacoes, marcarComoLida } from "./actions";
import SimpleSkeleton from "@/components/loading/simple_skeleton";


interface NotificationProfileProps {
  notif: any;
  onDelete?: () => void;
}

export default function NotificacaoDetalhe({ notif, onDelete }: NotificationProfileProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [notificacao, setNotifData] = useState<any | null>(notif);



  if (notificacao == null) {
    return (
      <X.ErrorBox visible hideCloseButton>
        Não foi possivel carregar o perfil da Notificação.
      </X.ErrorBox>
    );
  }

  marcarComoLida(Number(notificacao.id), Number(session?.user.id));
  console.log("Notificacao Detalhe", notificacao);

  return (
    <X.Container className="w-full h-max">
      <p className="font-bold text-2xl">{notificacao.notificacao.titulo}</p>
      <X.Divider />

      <div className="flex items-center">
        {notificacao.notificacao.mensagem}
      </div>

    </X.Container>
  );
}