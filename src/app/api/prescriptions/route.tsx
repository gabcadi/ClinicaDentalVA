import { NextResponse } from 'next/server';
import connectDB from '../../utils/mongodb';
import Prescription from '../../models/prescription';

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const { appointmentId, medication, dosage, duration, instructions } = body;

    // Validate input
    if (!appointmentId) {
      return NextResponse.json({ message: 'appointmentId es requerido' }, { status: 400 });
    }

    if (!medication || !medication.trim()) {
      return NextResponse.json({ message: 'medication es requerido' }, { status: 400 });
    }

    if (!dosage || !dosage.trim()) {
      return NextResponse.json({ message: 'dosage es requerido' }, { status: 400 });
    }

    if (!duration || !duration.trim()) {
      return NextResponse.json({ message: 'duration es requerido' }, { status: 400 });
    }

    if (!instructions || !instructions.trim()) {
      return NextResponse.json({ message: 'instructions es requerido' }, { status: 400 });
    }

    const newPrescription = await Prescription.create({
      appointmentId,
      medication: medication.trim(),
      dosage: dosage.trim(),
      duration: duration.trim(),
      instructions: instructions.trim(),
    });

    return NextResponse.json(newPrescription, { status: 201 });

  } catch (error) {
    console.error('Full error details:', {
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    
    return NextResponse.json(
      { 
        message: 'Error interno al crear receta',
        errorDetails: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await connectDB();
  
  try {
    // Get appointmentId from query parameters
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get('appointmentId');

    let prescriptions;
    
    if (appointmentId) {
      // Find prescriptions for a specific appointment
      prescriptions = await Prescription.find({ appointmentId });
    } else {
      // Get all prescriptions if no appointmentId is provided
      prescriptions = await Prescription.find();
    }

    // Always return an array, even if empty
    return NextResponse.json(prescriptions || [], { status: 200 });
    
  } catch (error) {
    console.error('Error al obtener recetas:', error);
    // Return empty array on error to prevent frontend errors
    return NextResponse.json([], { status: 500 });
  }
}