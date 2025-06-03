import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import User from '../../../models/users';
import connectDB from '../../../utils/mongodb';

export async function POST(request: Request) {
    try {
        await connectDB();

        const { name, email, password, confirmPassword } = await request.json();

        if (!name || !email || !password || !confirmPassword) {
            return NextResponse.json({ message: 'Todos los campos son obligatorios' }, { status: 400 });
        }

        if (name.length < 3) {
            return NextResponse.json({ message: 'El nombre debe tener al menos 3 caracteres' }, { status: 400 });   
        }

        const isValidEmail = (email: string) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        if (!isValidEmail(email)) {
            return NextResponse.json({ message: 'Correo electrónico inválido' }, { status: 400 });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ message: 'Las contraseñas no coinciden' }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ message: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'El usuario con ese correo ya existe' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            fullName: name,
            email,
            password: hashedPassword,
            role: 'user',
        });

        await newUser.save();

        return NextResponse.json({ message: 'Usuario creado exitosamente' }, { status: 201 });
    } catch (error) {
        console.error('Error en el registro:', error);
        return NextResponse.json({ message: 'Error al crear el usuario' }, { status: 500 });
    }
}


