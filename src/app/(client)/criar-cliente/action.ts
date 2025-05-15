'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache"; // se quiser atualizar algum caminho

interface ClienteData {
  nome: string;
  email: string;
  telefone: string;
  codigoPostal: string;
  endereco: string;
}

export async function criarCliente(data: ClienteData) {
  try {
    const cliente = await prisma.cliente.create({
      data: {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        codigoPostal: data.codigoPostal,
        endereco: data.endereco
      }
    });

    // Se quiser revalidar uma rota, ex: "/clientes"
    // revalidatePath("/clientes");

    return cliente;
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    throw new Error("Erro ao criar cliente.");
  }}