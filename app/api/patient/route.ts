import { NextResponse } from 'next/server';
import { ipfsService } from '@/lib/ipfs';
import { fabricService } from '@/lib/fabric-service';
import { Patient, PatientRecordUpdate } from '@/types/patient';
import { v4 as uuidv4 } from 'uuid';

// POST /api/patient - Create a new patient record
export async function POST(request: Request) {
  try {
    const patientData: Omit<Patient, 'id' | 'cid' | 'createdAt' | 'updatedAt'> = await request.json();
    
    // Create patient record with metadata
    const patient: Patient = {
      ...patientData,
      id: uuidv4(),
      cid: '', // Will be set after IPFS upload
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      medicalRecordCids: [],
    };

    // Upload patient data to IPFS
    const cid = await ipfsService.uploadData(patient);
    patient.cid = cid;

    // Record the creation on the blockchain
    const transactionId = await fabricService.createPatientRecord(patient);
    
    return NextResponse.json({
      success: true,
      data: {
        ...patient,
        transactionId,
      },
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create patient record' },
      { status: 500 }
    );
  }
}

// GET /api/patient?search=query - Search for patients
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search');

    // In a real implementation, you would query your database or search index
    // For now, we'll return an empty array as a placeholder
    return NextResponse.json({
      success: true,
      data: [],
    });
  } catch (error) {
    console.error('Error searching patients:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search patients' },
      { status: 500 }
    );
  }
}
