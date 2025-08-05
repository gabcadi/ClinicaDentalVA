import { NextResponse } from 'next/server';
import connectDB from '../../utils/mongodb';
import User from '@/app/models/users';

export const GET = async () => {
  try {
    await connectDB();
    const users = await User.find({});
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    return NextResponse.json({ message: 'Error al obtener los usuarios' }, { status: 500 });
  }
};