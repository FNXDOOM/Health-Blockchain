import { NextResponse } from 'next/server';
import { patientStore } from '@/lib/data/patient-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'fullName', 'dateOfBirth', 'gender', 'bloodGroup',
      'aadhaarNumber', 'phone', 'email', 'address', 'emergencyContact'
    ];
    
    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Check if patient already exists
    try {
      const existingPatient = await patientStore.findByIdentifier(
        body.aadhaarNumber,
        body.phone
      );
      
      if (existingPatient) {
        return NextResponse.json({
          success: true,
          did: existingPatient.did,
          message: 'Patient already exists',
          isNew: false
        });
      }
    } catch (error) {
      // Continue with creation if not found
    }
    
    // Create new patient
    const newPatient = await patientStore.create({
      personalInfo: {
        fullName: body.fullName,
        dateOfBirth: body.dateOfBirth,
        gender: body.gender,
        bloodGroup: body.bloodGroup,
        aadhaarNumber: body.aadhaarNumber,
        phone: body.phone,
        email: body.email,
        address: body.address,
        emergencyContact: body.emergencyContact
      },
      medicalInfo: {
        allergies: body.allergies || [],
        currentMedications: body.currentMedications || [],
        chronicConditions: body.chronicConditions || [],
        surgeries: body.surgeries || []
      }
    });
    
    return NextResponse.json({
      success: true,
      did: newPatient.did,
      message: 'Patient onboarded successfully',
      isNew: true
    });
    
  } catch (error: any) {
    console.error('Error during patient onboarding:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to onboard patient' 
      },
      { status: 500 }
    );
  }
}
