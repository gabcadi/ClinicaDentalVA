import { NextResponse } from "next/server";
import connectDB from "../../../utils/mongodb";
import Appointment from "../../../models/appointments";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "ID de cita requerido" },
        { status: 400 }
      );
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return NextResponse.json(
        { message: "Cita no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment, { status: 200 });
  } catch (error) {
    console.error("Error al obtener la cita:", error);
    return NextResponse.json(
      { message: "Error al obtener la cita" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "ID de la cita es requerido" },
        { status: 400 }
      );
    }

    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    if (!deletedAppointment) {
      return NextResponse.json(
        { message: "Cita no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Cita eliminada exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar la cita:", error);
    return NextResponse.json(
      { message: "Error al eliminar la cita" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { dateTimeChanged, patientEmail, ...appointmentData } = await request.json();

    if (!id) {
      return NextResponse.json({ message: "ID requerido" }, { status: 400 });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { $set: appointmentData },
      { new: true }
    );

    if (!updatedAppointment) {
      return NextResponse.json(
        { message: "Cita no encontrada" },
        { status: 404 }
      );
    }

    // Si cambió la fecha/hora y hay email del paciente, enviar notificación
    if (dateTimeChanged && patientEmail) {
      try {
        const { sendEmail } = await import('../../../utils/email');
        
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Cambio de Cita - Clínica Dental Vargas Araya</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
              .header { text-align: center; background: linear-gradient(135deg, #3b82f6, #06b6d4); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
              .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              .info-box { background: #e0f2fe; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0; border-radius: 4px; }
              .warning { background: #fef3cd; border-left: 4px solid #f97316; padding: 15px; margin: 20px 0; border-radius: 4px; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🦷 Clínica Dental Vargas Araya</h1>
                <p>Cambio en tu Cita Médica</p>
              </div>
              <div class="content">
                <h2>¡Hola!</h2>
                <p>Te informamos que tu cita médica ha sido <strong>modificada</strong> por nuestro equipo médico.</p>
                
                <div class="info-box">
                  <h3>📅 Nueva Información de tu Cita:</h3>
                  <p><strong>📋 Tratamiento:</strong> ${appointmentData.description}</p>
                  <p><strong>📅 Fecha:</strong> ${new Date(appointmentData.date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                  <p><strong>🕐 Hora:</strong> ${appointmentData.time}</p>
                  <p><strong>✅ Estado:</strong> ${appointmentData.confirmed ? 'Confirmada' : 'Pendiente de confirmación'}</p>
                </div>
                
                <div class="warning">
                  <strong>⚠️ Importante:</strong>
                  <ul>
                    <li>Por favor, anota estos nuevos datos en tu calendario</li>
                    <li>Si no puedes asistir en la nueva fecha/hora, contacta con nosotros lo antes posible</li>
                    <li>Llega 10 minutos antes de tu cita</li>
                  </ul>
                </div>
                
                <p>Si tienes alguna pregunta o necesitas hacer algún cambio adicional, no dudes en contactarnos.</p>
                
                <p>Gracias por tu comprensión y por confiar en nosotros para tu cuidado dental.</p>
                
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

        await sendEmail(
          patientEmail,
          'Cambio en tu Cita - Clínica Dental Vargas Araya',
          emailHtml
        );
      } catch (emailError) {
        console.error('Error al enviar email de notificación:', emailError);
        // No fallar la actualización si el email falla
      }
    }

    return NextResponse.json(updatedAppointment, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar la cita:", error);
    return NextResponse.json(
      { message: "Error al actualizar la cita" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ message: "ID requerido" }, { status: 400 });
    }

    // Actualización completa (todos los campos obligatorios)
    const requiredFields = [
      "description",
      "date",
      "time",
      "confirmed",
      "materials",
      "doctorReport",
      "totalPrice",
    ];
    const isFullUpdate = requiredFields.every((field) => field in body);

    // Campos permitidos en actualizaciones parciales
    const allowedPartialFields = [
      "doctorReport",
      "totalPrice",
      "materials",
      "confirmed",
    ];
    const hasAllowedField = allowedPartialFields.some((field) => field in body);

    // Si no es actualización completa ni contiene al menos un campo permitido
    if (!isFullUpdate && !hasAllowedField) {
      return NextResponse.json(
        { message: "No se han enviado campos válidos para actualizar la cita" },
        { status: 400 }
      );
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!updatedAppointment) {
      return NextResponse.json(
        { message: "Cita no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedAppointment, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar la cita:", error);
    return NextResponse.json(
      { message: "Error al actualizar la cita" },
      { status: 500 }
    );
  }
}
