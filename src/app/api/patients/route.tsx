import { NextResponse } from 'next/server';
import connectDB from '../../utils/mongodb';
import Patient from '../../models/patients';

export const GET = async (req: Request) => {
  try {
    await connectDB();
    const patients = await Patient.find({});
    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error al obtener los pacientes:', error);
    return NextResponse.json({ message: 'Error al obtener los pacientes' }, { status: 500 });
  }
};
