import { NextResponse } from 'next/server';
import { verifyDoctor } from '@/lib/doctor-service';

export async function POST(request: Request) {
  try {
    const { did, licenseNumber } = await request.json();
    
    if (!did || !licenseNumber) {
      return NextResponse.json(
        { error: 'DID and license number are required' },
        { status: 400 }
      );
    }

    const doctor = await verifyDoctor(did, licenseNumber);
    
    if (!doctor) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update last active timestamp
    await updateDoctorActivity(did);

    return NextResponse.json(doctor);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
