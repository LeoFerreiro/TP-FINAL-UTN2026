import nodemailer from "nodemailer";

function createTransporter() {
  if (process.env.EMAIL_MODE === "json" || !process.env.SMTP_HOST) {
    return nodemailer.createTransport({ jsonTransport: true });
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
  if (process.env.NODE_ENV !== "production") console.info("Email de verificación:", info.message || info);
}
