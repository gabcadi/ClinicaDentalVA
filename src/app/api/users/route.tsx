import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import connectDB from '../../utils/mongodb';
import User from '@/app/models/users';

export const GET = async (request: NextRequest) => {
  try {
    await connectDB();
    
    // Check if email parameter is provided
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    let users;
    if (email) {
      // Filter by email if provided
      users = await User.find({ email: email });
    } else {
      // Return all users if no email filter
      users = await User.find({});
    }
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    return NextResponse.json({ message: 'Error al obtener los usuarios' }, { status: 500 });
  }
};