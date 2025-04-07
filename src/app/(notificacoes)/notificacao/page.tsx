import * as X from "@/components/xcomponents";
import Link from "next/link";

// Tipagem para a notificação
interface Notificacao {
  id: number;
  titulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
  detalhes: {
    casoId: string;
    estadoAnterior: string;
    estadoAtual: string;
    responsavel: string;
    dataAlteracao: string;
    comentarios: string;
  };
}

// Dados mockados (substituir por dados reais)
const notificacao: Notificacao = {
  id: 1,
  titulo: "Estado do caso 123 alterado",
  mensagem: "O estado do caso foi alterado de aberto para fechado. O caso foi resolvido após análise completa da equipe técnica. Todos os documentos relacionados foram arquivados no sistema.",
  data: "10 minutos atrás",
  lida: false,
  detalhes: {
    casoId: "CASE-123",
    estadoAnterior: "Aberto",
    estadoAtual: "Fechado",
    responsavel: "Maria Silva",
    dataAlteracao: "15/03/2025 14:30",
    comentarios: "O cliente confirmou a resolução do problema e está satisfeito com o resultado."
  }
};

export default function NotificacaoDetalhe() {
  return (
    <div className="flex justify-center min-h-screen">
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col gap-4 w-full">
          <X.Container className="w-full">
            {/* Cabeçalho com botão de voltar */}
            <div className="flex justify-between items-center mb-4">
              <Link href="/notificacoes" passHref>
                <X.Button variant="ghost" className="flex items-center gap-1">
                  <X.IconArrowLeft size={16} />
                  Voltar
                </X.Button>
              </Link>
              <span className="text-sm text-gray-400">{notificacao.data}</span>
            </div>

            {/* Título da notificação */}
            <h1 className="text-2xl font-bold mb-2">{notificacao.titulo}</h1>
            
            <X.Divider className="my-4" />

            {/* Conteúdo principal */}
            <div className="space-y-4">
              <p className="text-gray-100">{notificacao.mensagem}</p>
              
              {/* Detalhes expandidos */}
              <div className="bg-gray-800 rounded-lg p-4 mt-6">
                <h2 className="font-semibold mb-3">Detalhes do caso</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">ID do Caso</p>
                    <p className="font-medium">{notificacao.detalhes.casoId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Estado anterior</p>
                    <p className="font-medium">{notificacao.detalhes.estadoAnterior}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Novo estado</p>
                    <p className="font-medium text-green-400">{notificacao.detalhes.estadoAtual}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Responsável</p>
                    <p className="font-medium">{notificacao.detalhes.responsavel}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-400">Comentários</p>
                  <p className="font-medium">{notificacao.detalhes.comentarios}</p>
                </div>
              </div>
            </div>

            <X.Divider className="my-6" />

            {/* Ações */}
            <div className="flex justify-end gap-2">
              <X.Button variant="outline">Arquivar</X.Button>
              <Link href={`/casos/${notificacao.detalhes.casoId}`} passHref>
                <X.Button>Abrir caso</X.Button>
              </Link>
            </div>
          </X.Container>
        </div>
      </div>
    </div>
  );
}