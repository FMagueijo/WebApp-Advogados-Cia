"use client";

import * as X from "@/components/xcomponents";

const DadosField = ({
  titulo,
  valor,
  editando = false,
  tipo = "text",
}: {
  titulo: string;
  valor: string;
  editando?: boolean;
  tipo?: "text" | "textarea";
}) => (
  <X.Container className="w-full">
    <div className="space-y-2">
      <h2 className="text-base font-semibold text-white">{titulo}</h2>
      {editando ? (
        tipo === "textarea" ? (
          <textarea
            readOnly
            value={valor}
            className="text-lg text-gray-300 bg-gray-700 p-1 rounded w-full border border-gray-600 focus:border-blue-500 focus:outline-none min-h-[100px]"
          />
        ) : (
          <input
            readOnly
            type="text"
            value={valor}
            className="text-lg text-gray-300 bg-gray-700 p-1 rounded w-full border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        )
      ) : (
        <p className="text-lg text-gray-500">{valor || "Não definido"}</p>
      )}
    </div>
  </X.Container>
);

const PerfilRegisto = () => {
  const casoId = "123";
  const registoId = "456";

  const profileData = {
    tipo: "Tipo Exemplo",
    resumo: "Este é um resumo do registo.",
    descricao:
      "Descrição detalhada do registo que pode ser bastante longa e explicativa.",
    criado_por: "João Silva",
    criado_em: "2025-05-20T15:30:00Z",
  };

  const isEditing = false;
  const isLoading = false;

  return (
    <div className="flex flex-row gap-8">
      <div className="flex flex-col gap-8 w-2/3">
        <X.Container className="w-full">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Perfil do Registo</h1>
            <button
              disabled={isLoading}
              aria-label={isEditing ? "Salvar alterações" : "Editar perfil"}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
              ) : isEditing ? (
                <img
                  src="/images/icons/check.svg"
                  className="h-5 w-5"
                  alt="Salvar"
                />
              ) : (
                <img
                  src="/images/icons/edit.svg"
                  className="h-5 w-5"
                  alt="Editar"
                />
              )}
            </button>
          </div>

          <X.Divider />

          <X.Container className="w-full">
            <p className="text-lg font-semibold">[ID] Registo</p>
            <p>
              [{registoId}] #{profileData.tipo}
            </p>
          </X.Container>

          <DadosField
            titulo="Resumo"
            valor={profileData.resumo}
            editando={isEditing}
            tipo="text"
          />

          <DadosField
            titulo="Descrição detalhada"
            valor={profileData.descricao}
            editando={isEditing}
            tipo="textarea"
          />
        </X.Container>
      </div>

      <div className="flex flex-col gap-8 w-1/3">
        {/* Informações do Registo */}
        <X.Container className="w-full">
          <p className="font-semibold">Informações do Registo</p>
          <X.Divider />
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-400">Tipo</p>
              <p>{profileData.tipo}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Criado por</p>
              <p>{profileData.criado_por}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Data de criação</p>
              <p>
                {new Date(profileData.criado_em).toLocaleDateString("pt-PT", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </X.Container>
      </div>
    </div>
  );
};

export default PerfilRegisto;
