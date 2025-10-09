import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/app/utils/mongodb';
import User from '@/app/models/users';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ 
        error: 'Token y contraseña son requeridos' 
      }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      }, { status: 400 });
    }

    // Validación adicional de seguridad para la contraseña
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return NextResponse.json({ 
        error: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número' 
      }, { status: 400 });
    }

    // Buscar el usuario con el token válido
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json({ 
        error: 'Token inválido o expirado' 
      }, { status: 400 });
    }

    // Encriptar la nueva contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Actualizar la contraseña y limpiar el token
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpiry: undefined,
      updatedAt: new Date()
    });

    return NextResponse.json({ 
      message: 'Contraseña restablecida exitosamente' 
    }, { status: 200 });

  } catch (error) {
    console.error('Error in reset password:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}