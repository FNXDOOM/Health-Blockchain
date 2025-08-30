import { NextResponse } from 'next/server';
import { getPatientDetails, updatePatientRecord } from '../../../../lib/doctor-service';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const patientId = params.id;
    if (!patientId) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      );
    }
    
    const patient = await getPatientDetails(patientId);
    return NextResponse.json(patient);
    
  } catch (error: any) {
    console.error('Error fetching patient:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch patient details' },
      { status: error.message === 'Patient not found' ? 404 : 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const patientId = params.id;
    const { updates, doctorId } = await request.json();
    
    if (!patientId || !doctorId) {
      return NextResponse.json(
        { error: 'Patient ID and doctor ID are required' },
        { status: 400 }
      );
    }
    
    const result = await updatePatientRecord(patientId, updates, doctorId);
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('Error updating patient:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update patient record' },
      { status: 500 }
    );
  }
}
