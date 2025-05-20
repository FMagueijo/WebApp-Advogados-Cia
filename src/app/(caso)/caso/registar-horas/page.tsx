"use client";

import * as X from "@/components/xcomponents";
import { FunctionComponent, useState } from "react";
import { submitRegistroHoras } from "./actions";
import { useSession } from "next-auth/react";

interface RegistrarHorasFormProps {
  isOpen: boolean;
  onClose: () => void;
  casoId: number;
}

const RegistrarHorasForm: FunctionComponent<RegistrarHorasFormProps> = ({
  isOpen,
  onClose,
  casoId,
}) => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    data: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16),
    horas: "1",
    minutos: "00",
    descricao: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      alert("Sessão inválida. Por favor, faça login novamente.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await submitRegistroHoras({
        casoId: Number(casoId),
        colaboradorId: Number(session.user.id),
        tempo: `${formData.horas}:${formData.minutos}`,
        data: formData.data,
        descricao: formData.descricao,
      });

      if (result.error) {
        alert(`Erro: ${result.error}`);
        return;
      }

      alert(result.message);
      onClose();
    } catch (error) {
      console.error("Erro ao registrar horas:", error);
      alert("Ocorreu um erro ao registrar as horas");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Registrar Horas Trabalhadas</h2>
        
        <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
          <p className="font-semibold text-gray-800">Colaborador:</p>
          <p className="text-gray-700">{session?.user?.email || "Usuário atual"}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800">
              Data e Hora
            </label>
            <input
              type="datetime-local"
              value={formData.data}
              onChange={(e) =>
                setFormData({ ...formData, data: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              required
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-800">
                Horas
              </label>
              <select
                value={formData.horas}
                onChange={(e) =>
                  setFormData({ ...formData, horas: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                required
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i} className="text-gray-900">
                    {i}h
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-800">
                Minutos
              </label>
              <select
                value={formData.minutos}
                onChange={(e) =>
                  setFormData({ ...formData, minutos: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                required
              >
                {["00", "15", "30", "45"].map((min) => (
                  <option key={min} value={min} className="text-gray-900">
                    {min}min
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800">
              Descrição
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) =>
                setFormData({ ...formData, descricao: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <X.Button
              onClick={onClose}
              
              className=""
            >
              Cancelar
            </X.Button>
            <X.Submit
        
              className=""
            >
              {isSubmitting ? "Registrando..." : "Registrar Horas"}
            </X.Submit>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrarHorasForm;