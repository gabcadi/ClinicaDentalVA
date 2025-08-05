import { NextResponse } from 'next/server';
import connectDB from '../../utils/mongodb';
import Patient from '../../models/patients';
import mongoose from 'mongoose';

export async function GET() {  // Eliminado el parámetro req no utilizado
  try {
    await connectDB();
    const patients = await Patient.find({});
    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error al obtener los pacientes:', error);
    return NextResponse.json(
      { message: 'Error al obtener los pacientes' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId, age, id, phone, address } = await req.json();

    const missingFields = [];
    if (!userId) missingFields.push('userId');
    if (!age) missingFields.push('age');
    if (!id) missingFields.push('id');
    if (!phone) missingFields.push('phone');
    if (!address) missingFields.push('address');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          message: 'Campos obligatorios faltantes',
          missingFields 
        },
        { status: 400 }
      );
    }

    // Validación de cédula existente
    const existingPatient = await Patient.findOne({ id });
    if (existingPatient) {
      return NextResponse.json(
        { message: 'Ya existe un paciente con esa cédula' },
        { status: 409 }  // Cambiado a 409 Conflict (más semántico)
      );
    }

    // Creación del paciente
    const newPatient = new Patient({
      userId: new mongoose.Types.ObjectId(userId),
      age: Number(age),  // Conversión explícita a número
      id,
      phone,
      address
    });

    await newPatient.save();
    
    return NextResponse.json(
      { 
        message: 'Paciente creado exitosamente',
        patient: newPatient 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al crear el paciente:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}