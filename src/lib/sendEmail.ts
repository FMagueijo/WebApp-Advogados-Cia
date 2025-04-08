// lib/sendEmail.ts
import fetch from 'node-fetch';

export async function enviarEmailNovoColaborador(nome: string, email: string, link: string) {
  const payload = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_PUBLIC_KEY,  // Note que mudamos de PUBLIC_KEY para USER_ID
    accessToken: process.env.EMAILJS_ACCESS_TOKEN, // Adicione isso se estiver usando autenticação reforçada
    template_params: {
      user: nome,
      email: email,
      link: link, 
       }
  };

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost' // Algumas APIs exigem header de origem
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Detalhes do erro:', errorDetails);
      throw new Error(`Falha ao enviar email: ${response.statusText}`);
    }

  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  }
}