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
    
    const { name, type, quantity } = await request.json();
    
    if (!name || !type || !quantity) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }

    if (quantity < 1) {
      return NextResponse.json({ error: 'La cantidad debe ser mayor a 0' }, { status: 400 });
    }

    const materialData = {
      name,
      type,
      quantity: Number(quantity),
      createdAt: new Date()
    };

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { 
        $push: { materials: materialData },
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedAppointment) {
      return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 });
    }

    // Get the newly added material (last in array)
    const newMaterial = updatedAppointment.materials?.[updatedAppointment.materials.length - 1];

    return NextResponse.json({ 
      message: 'Material agregado exitosamente',
      material: newMaterial,
      appointment: updatedAppointment
    }, { status: 200 });

  } catch (error) {
    console.error('Error adding material:', error);
    return NextResponse.json({ error: 'Error al agregar material' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const appointment = await Appointment.findById(id).select('materials');
    
    if (!appointment) {
      return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ 
      materials: appointment.materials || []
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching materials:', error);
    return NextResponse.json({ error: 'Error al obtener materiales' }, { status: 500 });
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
    const materialId = searchParams.get('materialId');

    if (!materialId) {
      return NextResponse.json({ error: 'ID del material es requerido' }, { status: 400 });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { 
        $pull: { materials: { _id: materialId } },
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedAppointment) {
      return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Material eliminado exitosamente',
      appointment: updatedAppointment
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting material:', error);
    return NextResponse.json({ error: 'Error al eliminar material' }, { status: 500 });
  }
}
