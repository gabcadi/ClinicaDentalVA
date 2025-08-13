import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../utils/mongodb';
import Appointment from '../../../../models/appointments';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const { medication, dosage, duration, instructions } = await request.json();
    
    if (!medication || !dosage || !duration || !instructions) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }

    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 });
    }

    const prescriptionData = {
      medication: medication.trim(),
      dosage: dosage.trim(),
      duration: duration.trim(),
      instructions: instructions.trim(),
      createdAt: new Date()
    };

    // Inicializar el array si no existe
    if (!appointment.prescriptions) {
      appointment.prescriptions = [];
    }

    // Agregar la receta manualmente
    appointment.prescriptions.push(prescriptionData);

    // Guardar el documento
    const savedAppointment = await appointment.save();

    // Obtener la receta recién agregada
    const prescriptionsArray = savedAppointment.prescriptions || [];
    const newPrescription = prescriptionsArray[prescriptionsArray.length - 1];

    return NextResponse.json({ 
      message: 'Receta agregada exitosamente',
      prescription: newPrescription,
      appointment: savedAppointment
    }, { status: 200 });

  } catch (error) {
    console.error('=== ERROR in prescription creation ===');
    console.error('Error details:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({ error: 'Error al agregar receta' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const appointment = await Appointment.findById(id).select('prescriptions');
    
    if (!appointment) {
      return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ 
      prescriptions: appointment.prescriptions || []
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return NextResponse.json({ error: 'Error al obtener recetas' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const prescriptionId = searchParams.get('prescriptionId');

    if (!prescriptionId) {
      return NextResponse.json({ error: 'ID de la receta es requerido' }, { status: 400 });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { 
        $pull: { prescriptions: { _id: prescriptionId } },
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedAppointment) {
      return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Receta eliminada exitosamente',
      appointment: updatedAppointment
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting prescription:', error);
    return NextResponse.json({ error: 'Error al eliminar receta' }, { status: 500 });
  }
}
