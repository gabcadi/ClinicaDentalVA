import { NextResponse } from 'next/server';
import connectDB from '../../utils/mongodb';
import Appointment from '../../models/appointments';
import { sendEmail } from '../../utils/email';
import nodeCron from 'node-cron';
           
export async function POST(request: Request) {
  try {
    await connectDB();

    const { description, date, time } = await request.json();

    if (!description || !date || !time) {
      return NextResponse.json({ message: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    const newAppointment = new Appointment({ description, date, time });
    await newAppointment.save();

    const email = process.env.EMAIL_USER || '';
    
    await sendEmail(
      email,
      'Cita Agendada en Clínica Vargas Araya',
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="text-align: center; color: #007bff;">Clínica Vargas Araya</h2>
        <p style="text-align: center; font-size: 16px; color: #333;">¡Tu cita ha sido agendada exitosamente!</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <div style="font-size: 16px; color: #333;">
          <p><strong>Fecha:</strong> ${date}</p>
          <p><strong>Hora:</strong> ${time}</p>
          <p><strong>Descripción:</strong> ${description}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="text-align: center; font-size: 14px; color: #555;">Gracias por confiar en nosotros. Te llegará un recordatorio un día antes de tu cita.</p>
        <p style="text-align: center; font-size: 12px; color: #999;">Clínica Vargas Araya, San José, Costa Rica</p>
      </div>
      `
    );

    const reminderDate = new Date(date);
    reminderDate.setDate(reminderDate.getDate() - 1); 

    nodeCron.schedule(`${reminderDate.getMinutes()} ${reminderDate.getHours()} ${reminderDate.getDate()} ${reminderDate.getMonth() + 1} *`, async () => {
		await sendEmail(
			email,
			'Recordatorio de Cita en Clínica Vargas Araya en 24 horas',
			`<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="text-align: center; color: #007bff;">Clínica Vargas Araya</h2>
        <p style="text-align: center; font-size: 16px; color: #333;">¡Hola! Este es un recordatorio de tu cita para el día de:</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <div style="font-size: 16px; color: #333;">
          <p><strong>Fecha:</strong> ${date}</p>
          <p><strong>Hora:</strong> ${time}</p>
          <p><strong>Descripción:</strong> ${description}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="text-align: center; font-size: 14px; color: #555;">Gracias por confiar en nosotros. ¡Te esperamos!</p>
        <p style="text-align: center; font-size: 12px; color: #999;">Clínica Vargas Araya, San José, Costa Rica</p>
      </div>`
		);
	});

    return NextResponse.json({ message: 'Cita creada exitosamente' }, { status: 201 });
  } catch (error) {
    console.error('Error al crear la cita:', error);
    return NextResponse.json({ message: 'Error al crear la cita' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const appointments = await Appointment.find().sort({ date: 1, time: 1 });
    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error('Error al obtener las citas:', error);
    return NextResponse.json({ message: 'Error al obtener las citas' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ message: 'ID de la cita es requerido' }, { status: 400 });
    }

    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    if (!deletedAppointment) {
      return NextResponse.json({ message: 'Cita no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Cita eliminada exitosamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar la cita:', error);
    return NextResponse.json({ message: 'Error al eliminar la cita' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const { id, description, date, time } = await request.json();

    if (!id || !description || !date || !time) {
      return NextResponse.json({ message: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { description, date, time },
      { new: true }
    );

    if (!updatedAppointment) {
      return NextResponse.json({ message: 'Cita no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Cita actualizada exitosamente', appointment: updatedAppointment }, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar la cita:', error);
    return NextResponse.json({ message: 'Error al actualizar la cita' }, { status: 500 });
  }
}