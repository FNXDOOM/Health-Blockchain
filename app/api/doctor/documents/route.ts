import { NextRequest, NextResponse } from 'next/server';
import { uploadDoctorDocument, getDoctorDocuments } from '@/lib/doctor-service';

// Get all documents for a doctor
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const doctorId = searchParams.get('doctorId');

  if (!doctorId) {
    return NextResponse.json(
      { error: 'doctorId is required' },
      { status: 400 }
    );
  }

  try {
    const documents = await getDoctorDocuments(doctorId);
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

// Upload a new document
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const doctorId = formData.get('doctorId') as string;
    const documentType = formData.get('documentType') as string;
    const file = formData.get('file') as File | null;

    if (!doctorId || !documentType || !file) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await uploadDoctorDocument(doctorId, file, documentType);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}
