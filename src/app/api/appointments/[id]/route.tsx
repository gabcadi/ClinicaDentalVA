import { NextResponse } from 'next/server';
import connectDB from '../../../utils/mongodb';
import Appointment from '../../../models/appointments';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
	try {
		await connectDB();
		const { id } = params;

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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;
    const { description, date, time, confirmed } = await request.json();

    if (!id || !description || !date || !time) {
      return NextResponse.json({ message: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { description, date, time, confirmed },
      { new: true }
    );

    if (!updatedAppointment) {
      return NextResponse.json({ message: 'Cita no encontrada' }, { status: 404 });
    }

    return NextResponse.json(updatedAppointment, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar la cita:', error);
    return NextResponse.json({ message: 'Error al actualizar la cita' }, { status: 500 });
  }
}