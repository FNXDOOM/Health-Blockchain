import { NextResponse } from 'next/server';
import { verifyDoctor, updateDoctorActivity } from '@/lib/doctor-service';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

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
    await updateDoctorActivity({
      id: `activity_${Date.now()}`,
      doctorId: did,
      action: 'LOGIN',
      details: { timestamp: new Date().toISOString() },
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(doctor);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
