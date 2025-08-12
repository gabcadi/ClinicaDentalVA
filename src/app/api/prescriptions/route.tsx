import { NextResponse } from 'next/server';
import connectDB from '../../utils/mongodb';
import Prescription from '../../models/prescription';

export async function POST(request: Request) {
  console.log('Starting prescription creation...');
  
  try {
    console.log('Connecting to DB...');
    await connectDB();
    console.log('DB connected successfully');

    const body = await request.json();
    console.log('Request body received:', JSON.stringify(body, null, 2));

    const { appointmentId, medication, dosage, duration, instructions } = body;

    // Validate input
    if (!appointmentId) {
      console.error('Missing appointmentId');
      return NextResponse.json({ message: 'appointmentId es requerido' }, { status: 400 });
    }

    console.log('Creating new prescription document...');
    const newPrescription = await Prescription.create({
      appointmentId,
      medication,
      dosage,
      duration,
      instructions: instructions || '', // Make optional
    });

    console.log('Prescription created successfully:', newPrescription);
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