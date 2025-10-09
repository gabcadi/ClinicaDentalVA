import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import bcrypt from 'bcryptjs';
import connectDB from '@/app/utils/mongodb';
import User from '@/app/models/users';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function PUT(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await connectDB();

    const { currentPassword, newPassword } = await request.json();

    // Validación de datos
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ 
        error: 'La contraseña actual y nueva son requeridas' 
      }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ 
        error: 'La nueva contraseña debe tener al menos 6 caracteres' 
      }, { status: 400 });
    }

    // Validación adicional de seguridad para la contraseña
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return NextResponse.json({ 
        error: 'La nueva contraseña debe contener al menos una mayúscula, una minúscula y un número' 
      }, { status: 400 });
    }

    // Buscar el usuario en la base de datos
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar la contraseña actual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ 
        error: 'La contraseña actual es incorrecta' 
      }, { status: 400 });
    }

    // Verificar que la nueva contraseña sea diferente
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return NextResponse.json({ 
        error: 'La nueva contraseña debe ser diferente a la actual' 
      }, { status: 400 });
    }

    // Encriptar la nueva contraseña
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar la contraseña en la base de datos
    await User.findByIdAndUpdate(user._id, {
      password: hashedNewPassword,
      updatedAt: new Date()
    });

    return NextResponse.json({ 
      message: 'Contraseña actualizada exitosamente' 
    }, { status: 200 });

  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}