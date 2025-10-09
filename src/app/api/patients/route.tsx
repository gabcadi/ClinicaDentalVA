import { NextResponse } from 'next/server';
import connectDB from '../../utils/mongodb';
import Patient from '../../models/patients';
import mongoose from 'mongoose';

export async function GET() {
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

    // Verificar si ya existe un paciente con ese userId
    const existingUserAsPatient = await Patient.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (existingUserAsPatient) {
      return NextResponse.json({ message: 'Este usuario ya está registrado como paciente' }, { status: 400 });
    }

    // Importar el modelo User para actualizar el rol
    const { default: User } = await import('../../models/users');

    // Verificar que el usuario existe y su rol actual
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    // Iniciar transacción para asegurar consistencia
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        // Crear nuevo paciente
        const newPatient = new Patient({
          userId: new mongoose.Types.ObjectId(userId),
          age,
          id,
          phone,
          address
        });

        await newPatient.save({ session });

        // Actualizar el rol del usuario a "patient"
        await User.findByIdAndUpdate(
          userId,
          { 
            role: 'patient',
            updatedAt: new Date()
          },
          { session }
        );
      });

      await session.commitTransaction();
      
      return NextResponse.json({ 
        message: 'Paciente creado exitosamente y rol de usuario actualizado',
        patient: await Patient.findOne({ userId: new mongoose.Types.ObjectId(userId) })
      }, { status: 201 });
    } catch (transactionError) {
      await session.abortTransaction();
      throw transactionError;
    } finally {
      await session.endSession();
    }
    
  } catch (error) {
    console.error('Error al crear el paciente:', error);
    return NextResponse.json({ message: 'Error al crear el paciente' }, { status: 500 });
  }
}
