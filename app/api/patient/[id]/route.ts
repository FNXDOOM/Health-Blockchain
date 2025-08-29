import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { fabricClient } from '@/lib/fabric-client';
import { Patient, PatientRecordUpdate } from '@/types/patient';

// GET /api/patient/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Get patient data from Supabase
    const { data: patient, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    // Get audit trail from Hyperledger Fabric
    await fabricClient.connect('admin'); // Use appropriate user ID
    const history = await fabricClient.getPatientHistory(id);
    await fabricClient.disconnect();

    return NextResponse.json({
      ...patient,
      auditTrail: history
    });

  } catch (error) {
    console.error('Error fetching patient data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient data' },
      { status: 500 }
    );
  }
}

// PATCH /api/patient/[id]
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updates = await request.json();
    
    // Update patient in Supabase
    const { data: patient, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Log update to Hyperledger Fabric
    const updateRecord: PatientRecordUpdate = {
      patientId: id,
      updateType: 'medical_record',
      data: updates,
      timestamp: new Date().toISOString(),
      updatedBy: 'doctor-1', // Get from auth context
    };

    await fabricClient.connect('admin');
    await fabricClient.logPatientUpdate(updateRecord);
    await fabricClient.disconnect();

    return NextResponse.json(patient);

  } catch (error) {
    console.error('Error updating patient data:', error);
    return NextResponse.json(
      { error: 'Failed to update patient data' },
      { status: 500 }
    );
  }
}
