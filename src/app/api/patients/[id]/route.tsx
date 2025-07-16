import { NextResponse } from 'next/server';
import connectDB from '../../../utils/mongodb';
import Patient from '../../../models/patients';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    await connectDB();
    const patient = await Patient.findById(id);
    if (!patient) {
      return NextResponse.json({ message: 'Paciente no encontrado' }, { status: 404 });
    }
    return NextResponse.json(patient);
  } catch (error) {
    console.error(`Error al obtener el paciente con ID ${id}:`, error);
    return NextResponse.json({ message: 'Error al obtener el paciente' }, { status: 500 });
  }
}