import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/utils/mongodb';
import Patient from '@/app/models/patients';
import User from '@/app/models/users';
import { getServerSession } from 'next-auth/next';

export async function GET(request: NextRequest) {
  try {
    // Ensure user is authenticated
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = request.nextUrl.searchParams.get('email');
    if (!email) {
      return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
    }

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find patient associated with the user
    const patient = await Patient.findOne({ userId: user._id }).populate('userId');
    
    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found for this user' }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error('Error fetching patient by user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
