"use client";

import * as X from "@/components/xcomponents";
import { FunctionComponent, useState } from "react";
import { submitRegistroHoras } from "./actions";
import { useSession } from "next-auth/react";

interface RegistrarHorasFormProps {
  onClose: () => void;
  casoId: number;
}

const RegistrarHorasForm: FunctionComponent<RegistrarHorasFormProps> = ({
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
        return;
      }

      onClose();
    } catch (error) {
      console.error("Erro ao registrar horas:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      <X.DateTimePicker value={new Date(formData.data)} onChange={(date) => setFormData({ ...formData, data: date.toString() })} name="Data e Horas" showTimeSelect showDayAdvanceButtons required></X.DateTimePicker>
      <div className="flex flex-row gap-4">
        <X.Field name="Horas" type="number" min={0} max={24} step={1} value={formData.horas} placeholder="Horas" onChange={(e) => setFormData({ ...formData, horas: e.target.value })} required></X.Field>
        <X.Field name="Minutos" type="number" min={0} max={60} step={1} value={formData.minutos} placeholder="Minutos" onChange={(e) => setFormData({ ...formData, minutos: e.target.value })} required></X.Field>
      </div>
      <X.Textarea name="Descrição" value={formData.descricao} placeholder="Descrição" onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}></X.Textarea>
      <X.Submit>
        {isSubmitting ? "Registrando..." : "Registrar Horas"}
      </X.Submit>
    </form>
  );
};

export default RegistrarHorasForm;