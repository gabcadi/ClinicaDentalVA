import { NextResponse } from 'next/server';
import connectDB from '../../utils/mongodb';
import Patient from '../../models/patients';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    await connectDB();
    const patients = await Patient.find({});
    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error al obtener los pacientes:', error);
    return NextResponse.json({ message: 'Error al obtener los pacientes' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId, age, id, phone, address } = await req.json();

    // Validar datos
    if (!userId || !age || !id || !phone || !address) {
      return NextResponse.json({ message: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    // Verificar si ya existe un paciente con esa cédula
    const existingPatient = await Patient.findOne({ id });
    if (existingPatient) {
      return NextResponse.json({ message: 'Ya existe un paciente con esa cédula' }, { status: 400 });
    }

    // Crear nuevo paciente
    const newPatient = new Patient({
      userId: new mongoose.Types.ObjectId(userId),
      age,
      id,
      phone,
      address
    });

    await newPatient.save();
    
    return NextResponse.json({ 
      message: 'Paciente creado exitosamente',
      patient: newPatient 
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear el paciente:', error);
    return NextResponse.json({ message: 'Error al crear el paciente' }, { status: 500 });
  }
}
