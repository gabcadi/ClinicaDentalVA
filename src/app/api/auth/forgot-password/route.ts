import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import connectDB from '@/app/utils/mongodb';
import User from '@/app/models/users';
import { sendEmail } from '@/app/utils/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ 
        error: 'El correo electrónico es requerido' 
      }, { status: 400 });
    }

    // Buscar el usuario
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ 
        error: 'Este correo electrónico no está registrado en nuestro sistema. Verifica la dirección o regístrate primero.' 
      }, { status: 404 });
    }

    // Generar token de restablecimiento
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    // Guardar el token en el usuario
    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpiry: resetTokenExpiry
    });

    // Crear el enlace de restablecimiento
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // Plantilla de correo
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Restablecer Contraseña - Clínica Dental Vargas Araya</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0891b2, #0284c7); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #0891b2, #0284c7); color: white !important; padding: 15px 30px; text-decoration: none; text-color: white; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; color: #64748b; font-size: 14px; margin-top: 20px; }
          .warning { background: #fee2e2; border: 1px solid #fecaca; color: #dc2626; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🦷 Clínica Dental Vargas Araya</h1>
            <h2>Restablecer Contraseña</h2>
          </div>
          <div class="content">
            <p>Hola <strong>${user.fullName}</strong>,</p>
            
            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta. Si no fuiste tú quien realizó esta solicitud, puedes ignorar este correo.</p>
            
            <p>Para restablecer tu contraseña, haz clic en el siguiente botón:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
            </div>
            
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; background: #e2e8f0; padding: 10px; border-radius: 4px; font-family: monospace;">${resetUrl}</p>
            
            <div class="warning">
              <strong>⚠️ Importante:</strong>
              <ul>
                <li>Este enlace expirará en <strong>1 hora</strong></li>
                <li>Solo puedes usar este enlace una vez</li>
                <li>Si no solicitaste este cambio, contacta con nosotros inmediatamente</li>
              </ul>
            </div>
            
            <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
            
            <p>Saludos cordiales,<br>
            <strong>Equipo Clínica Dental Vargas Araya</strong></p>
          </div>
          <div class="footer">
            <p>Este es un correo automático, por favor no responder directamente.</p>
            <p>© ${new Date().getFullYear()} Clínica Dental Vargas Araya. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Enviar el correo
    try {
      await sendEmail(
        email,
        'Restablecer Contraseña - Clínica Dental Vargas Araya',
        emailHtml
      );
      
      console.log('✅ Email de recuperación enviado exitosamente a:', email);
      
      return NextResponse.json({ 
        message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña' 
      }, { status: 200 });

    } catch (emailError) {
      console.error('❌ Error específico al enviar email:', emailError);
      
      // Si falla el envío del email, limpiar el token del usuario
      await User.findByIdAndUpdate(user._id, {
        $unset: { resetPasswordToken: 1, resetPasswordExpiry: 1 }
      });
      
      return NextResponse.json({ 
        error: 'Error al enviar el correo. Verifique la configuración del servidor.' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Error general in forgot password:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}