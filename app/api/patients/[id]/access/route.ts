import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import { patientStore } from '../../../../../lib/data/patient-store';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const patientId = params.id;
    const { documentId, doctorDid, notes } = await request.json();
    
    if (!documentId || !doctorDid) {
      return NextResponse.json(
        { error: 'Document ID and doctor DID are required' },
        { status: 400 }
      );
    }
    
    // Request access to the document
    const updatedPatient = await patientStore.requestDocumentAccess(
      patientId,
      documentId,
      doctorDid,
      notes
    );
    
    return NextResponse.json({
      success: true,
      message: 'Access requested successfully',
      patient: updatedPatient
    });
    
  } catch (error: any) {
    console.error('Error requesting document access:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to request document access' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const patientId = params.id;
    const { documentId, doctorDid, status, expiresInHours = 24 } = await request.json();
    
    if (!documentId || !doctorDid || !status) {
      return NextResponse.json(
        { error: 'Document ID, doctor DID, and status are required' },
        { status: 400 }
      );
    }
    
    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be either "approved" or "rejected"' },
        { status: 400 }
      );
    }
    
    // Update access status
    const updatedPatient = await patientStore.updateDocumentAccess(
      patientId,
      documentId,
      doctorDid,
      status as 'approved' | 'rejected',
      expiresInHours || 24
    );
    
    return NextResponse.json({
      success: true,
      message: `Access ${status} successfully`,
      patient: updatedPatient
    });
    
  } catch (error: any) {
    console.error('Error updating document access:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update document access' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const patientId = params.id;
    const patient = await patientStore.findByDID(patientId);
    
    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }
    
    // Get all access requests for this patient
    const accessRequests = patient.documents.flatMap((doc: { id: string; name: string; accessRequests: any[]; }) => 
      doc.accessRequests.map((req: any) => ({
        documentId: doc.id,
        documentName: doc.name,
        ...req
      }))
    );
    
    return NextResponse.json({
      success: true,
      accessRequests
    });
    
  } catch (error: any) {
    console.error('Error fetching access requests:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch access requests' },
      { status: 500 }
    );
  }
}
