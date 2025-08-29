import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { patientStore } from '@/lib/data/patient-store';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// 10MB file size limit
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

// Ensure upload directory exists
async function ensureUploadsDir(patientId: string) {
  const uploadDir = path.join(process.cwd(), 'uploads', patientId);
  await mkdir(uploadDir, { recursive: true });
  return uploadDir;
}

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
    const formData = await request.formData();
    
    // Get file and metadata from form data
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string || '';
    const documentType = formData.get('type') as string || 'general';
    
    // Validate required fields
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only documents, PDFs, and images are allowed.' },
        { status: 400 }
      );
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit` },
        { status: 400 }
      );
    }
    
    // Read file as buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create upload directory if it doesn't exist
    const uploadDir = await ensureUploadsDir(patientId);
    
    // Generate unique filename
    const fileExt = path.extname(file.name);
    const fileName = `${Date.now()}_${uuidv4()}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);
    
    // Save file to disk
    await writeFile(filePath, buffer);
    
    // Add document to patient record
    const updatedPatient = await patientStore.addDocument(patientId, {
      name: title,
      type: documentType,
      size: file.size,
      cid: fileName // Using filename as CID for now
    });
    
    const newDocument = updatedPatient.documents.find(d => d.cid === fileName);
    
    if (!newDocument) {
      throw new Error('Failed to add document to patient record');
    }
    
    return NextResponse.json({
      success: true,
      document: newDocument,
      message: 'File uploaded successfully'
    });
    
  } catch (error: any) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to upload document',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
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
    
    // In a real app, check if the user has permission to view these documents
    
    return NextResponse.json({
      success: true,
      documents: patient.documents
    });
    
  } catch (error: any) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}
