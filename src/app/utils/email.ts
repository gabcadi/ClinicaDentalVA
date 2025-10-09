import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
  tls: {
    rejectUnauthorized: false // Soluciona el problema de certificados
  }
});

export const sendEmail = async (to: string, subject: string, html?: string) => {
  try {

    const info = await transporter.sendMail({
      from: `"Clínica Dental Vargas Araya" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error detallado al enviar email:', error);
    throw error;
  }
};
