import nodemailer from "nodemailer";

function createTransporter() {
  if (process.env.EMAIL_MODE === "json") return nodemailer.createTransport({ jsonTransport: true });
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("Configuración SMTP incompleta");
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
}

export async function sendVerificationEmail({ email, name, token }) {
  const verificationUrl = `${process.env.FRONTEND_URL}/verificar-email?token=${token}`;
  const info = await createTransporter().sendMail({
    from: process.env.SMTP_FROM || "Impulso <no-reply@impulso.local>",
    to: email,
    subject: "Verificá tu cuenta de Impulso",
    text: `Hola ${name}. Verificá tu cuenta: ${verificationUrl}`,
    html: `<h2>Hola ${name}</h2><p>Activá tu cuenta de Impulso desde el siguiente enlace:</p><p><a href="${verificationUrl}">Verificar mi correo</a></p><p>El enlace vence en 24 horas.</p>`
  });
  console.info("[email] Verificación procesada", {
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
    response: info.response
  });
}
