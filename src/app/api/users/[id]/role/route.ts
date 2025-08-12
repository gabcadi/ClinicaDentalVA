import { NextResponse } from 'next/server';
import connectDB from '../../../../utils/mongodb';
import User from '../../../../models/users';

export async function PUT(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { role } = await request.json();

    // Validar rol
    if (!['admin', 'doctor', 'user'].includes(role)) {
      return NextResponse.json(
        { message: 'Rol inválido' }, 
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true } // Devuelve el documento actualizado
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Rol actualizado correctamente', user: updatedUser }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al actualizar el rol:', error);
    return NextResponse.json(
      { message: 'Error al actualizar el rol' }, 
      { status: 500 }
    );
  }
}
