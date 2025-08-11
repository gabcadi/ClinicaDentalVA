import { NextResponse } from 'next/server';
import connectDB from '../../../utils/mongodb';
import User from '../../../models/users';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error(`Error al obtener el usuario con ID ${id}:`, error);
    return NextResponse.json({ message: 'Error al obtener el usuario' }, { status: 500 });
  }
}