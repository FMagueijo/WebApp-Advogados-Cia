"use client";

import * as X from "@/components/xcomponents";
import { useState } from "react";
import { criarCliente } from "./action";

interface FormCriarClienteProps {
  onClose: () => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function FormCriarCliente({ onClose, onSubmit }: FormCriarClienteProps) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    codigoPostal: "",
    endereco: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await criarCliente(form);
      onClose?.();
      setForm({ nome: "", email: "", telefone: "", codigoPostal: "", endereco: "" });
    } catch (err) {
      onClose?.();
      console.error("Erro ao criar cliente:", err);
    }
  };

  return (
      <div className="w-full max-w-4xl mx-auto px-4">
      <form onSubmit={onSubmit ?? handleSubmit} className="flex flex-col gap-8 w-full">
          <X.Container className="w-full p-8">
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Criar Cliente</p>
            </div>
            <X.Divider />
            <X.Field required type="text" placeholder="Nome Completo" name="nome" value={form.nome} onChange={handleChange} />
            <X.Field required type="email" placeholder="Exemplo@exemplo.com" name="email" value={form.email} onChange={handleChange} />
            <X.Field required type="number" placeholder="Telefone" name="telefone" value={form.telefone} onChange={handleChange} />
            <X.Field required type="text" placeholder="0000-000" name="codigoPostal" value={form.codigoPostal} onChange={handleChange} />
            <X.Field required type="text" placeholder="Endereço" name="endereco" value={form.endereco} onChange={handleChange} />
            <X.Submit>Criar Cliente</X.Submit>
          </X.Container>
        </form>
      </div>
  );
}
