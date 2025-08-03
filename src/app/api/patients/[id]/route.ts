import { NextResponse } from 'next/server';
import connectDB from '../../../utils/mongodb';
import Patient from '../../../models/patients';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    // Usar populate para obtener también los datos del usuario
    const patient = await Patient.findById(id).populate('userId', 'fullName email');
    
    if (!patient) {
      return NextResponse.json({ message: 'Paciente no encontrado' }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error('Error al obtener el paciente:', error);
    return NextResponse.json({ message: 'Error al obtener el paciente' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const deletedPatient = await Patient.findByIdAndDelete(id);
    
    if (!deletedPatient) {
      return NextResponse.json({ message: 'Paciente no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Paciente eliminado exitosamente',
      patient: deletedPatient
    }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar el paciente:', error);
    return NextResponse.json({ message: 'Error al eliminar el paciente' }, { status: 500 });
  }
}
