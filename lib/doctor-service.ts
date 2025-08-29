import { fabricService } from './fabric-service';
import { ipfsService } from './ipfs';
import { patientService } from './patient-service';
import { v4 as uuidv4 } from 'uuid';
import { Buffer } from 'buffer';

// Sample patient data for demonstration
const SAMPLE_PATIENTS = [
  {
    id: 'pid_1001',
    name: 'Rohan Kumar',
    age: 45,
    gender: 'male',
    bloodGroup: 'B+',
    contact: '+919876543210',
    emergencyContact: '+919876543211',
    address: '123 Main St, Bangalore, KA 560001',
    medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
    allergies: ['Penicillin'],
    currentMedications: ['Metformin 500mg', 'Amlodipine 5mg'],
    cid: 'QmXxSampleCid1',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-08-20T14:25:00Z',
    isActive: true,
    medicalRecordCids: []
  },
  {
    id: 'pid_1002',
    name: 'Priya Sharma',
    age: 32,
    gender: 'female',
    bloodGroup: 'A-',
    contact: '+919876543212',
    emergencyContact: '+919876543213',
    address: '456 Oak Ave, Mumbai, MH 400001',
    medicalHistory: ['Asthma', 'Migraine'],
    allergies: ['Dust', 'Pollen'],
    currentMedications: ['Montelukast 10mg', 'Sumatriptan 50mg'],
    cid: 'QmXxSampleCid2',
    createdAt: '2024-02-20T11:15:00Z',
    updatedAt: '2024-08-25T09:45:00Z',
    isActive: true,
    medicalRecordCids: []
  },
  {
    id: 'pid_1003',
    name: 'Amit Patel',
    age: 58,
    gender: 'male',
    bloodGroup: 'O+',
    contact: '+919876543214',
    emergencyContact: '+919876543215',
    address: '789 Pine Rd, Delhi, DL 110001',
    medicalHistory: ['Coronary Artery Disease', 'Hyperlipidemia'],
    allergies: ['Sulfa'],
    currentMedications: ['Atorvastatin 40mg', 'Clopidogrel 75mg'],
    cid: 'QmXxSampleCid3',
    createdAt: '2024-03-10T14:20:00Z',
    updatedAt: '2024-08-28T16:30:00Z',
    isActive: true,
    medicalRecordCids: []
  }
];

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  hospital: string;
  licenseNumber: string;
  address: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorActivity {
  id: string;
  doctorId: string;
  action: string;
  details: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface DocumentMetadata {
  id: string;
  name: string;
  type: string;
  size: number;
  cid: string;
  uploadedBy: string;
  uploadedAt: string;
  patientId: string;
  description?: string;
  tags?: string[];
}

export async function verifyDoctor(did: string, licenseNumber: string): Promise<Doctor | null> {
  try {
    // First check in the blockchain
    const doctor = await fabricService.getPatientRecord(`doctor_${did}`);
    
    if (doctor && doctor.licenseNumber === licenseNumber) {
      return {
        ...doctor,
        isActive: true,
        lastActive: new Date().toISOString()
      } as Doctor;
    }
    
    return null;
  } catch (error) {
    console.error('Error verifying doctor:', error);
    return null;
  }
}

interface UpdateDoctorActivityParams {
  id: string;
  doctorId: string;
  action: string;
  details: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export async function updateDoctorActivity(params: UpdateDoctorActivityParams): Promise<void> {
  try {
    const { id, doctorId, action, details, timestamp, ipAddress, userAgent } = params;
    
    // Store activity details in IPFS
    const cid = await ipfsService.uploadData({
      id,
      doctorId,
      action,
      details: details.sensitive ? '[REDACTED]' : details,
      timestamp,
      ipAddress,
      userAgent,
    });

    // Record the activity on the blockchain
    await fabricService.updatePatientRecord({
      id,
      type: 'DOCTOR_ACTIVITY',
      cid,
      timestamp,
      doctorId,
      action,
    });
  } catch (error) {
    console.error('Error updating doctor activity:', error);
    throw error;
  }
}

export async function uploadDoctorDocument(
  doctorId: string, 
  file: File,
  documentType: string
): Promise<{ ipfsHash: string; timestamp: string }> {
  try {
    // Upload file directly to IPFS
    const ipfsHash = await ipfsService.uploadFile(file);
    
    // Record on blockchain
    const timestamp = new Date().toISOString();
    await fabricService.updatePatientRecord({
      id: `document_${uuidv4()}`,
      doctorId,
      action: 'UPLOAD_DOCUMENT',
      cid: ipfsHash,
      timestamp,
      type: 'DOCTOR_DOCUMENT',
      documentName: file.name,
      documentType: file.type,
    });
    
    return { ipfsHash, timestamp };
  } catch (error) {
    console.error('Error uploading document:', error);
    throw new Error('Failed to upload document');
  }
}

export async function getDoctorDocuments(doctorId: string): Promise<Array<{
  documentId: string;
  ipfsHash: string;
  timestamp: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}>> {
  try {
    const query = {
      selector: {
        type: 'DOCTOR_DOCUMENT',
        doctorId,
      },
      sort: [{ timestamp: 'desc' }],
    };
    
    const result = await fabricService.queryPatientRecords(JSON.stringify(query));
    return result || [];
  } catch (error) {
    console.error('Error fetching doctor documents:', error);
    return [];
  }
}

export async function getDoctorActivity(doctorId: string): Promise<{
  lastActive: string;
  documentCount: number;
  recentActivity: Array<{
    type: string;
    title: string;
    timestamp: string;
  }>;
}> {
  try {
    const result = await fabricService.getPatientRecord(`activity_${doctorId}`);
    return result || {
      lastActive: new Date().toISOString(),
      documentCount: 0,
      recentActivity: []
    };
  } catch (error) {
    console.error('Error fetching doctor activity:', error);
    return {
      lastActive: new Date().toISOString(),
      documentCount: 0,
      recentActivity: []
    };
  }
}

export const uploadDocument = async (
  file: File, 
  doctorId: string, 
  patientId: string,
  metadata: Omit<DocumentMetadata, 'id' | 'cid' | 'uploadedAt' | 'uploadedBy' | 'size'>
): Promise<{ cid: string; url: string } | null> => {
  try {
    // Upload the file to IPFS
    const cid = await ipfsService.uploadFile(file);
    const documentUrl = ipfsService.getGatewayUrl(cid, file.name);
    
    // Create document metadata
    const document: DocumentMetadata = {
      ...metadata,
      id: `doc_${uuidv4()}`,
      name: file.name,
      type: file.type,
      size: file.size,
      cid,
      uploadedBy: doctorId,
      uploadedAt: new Date().toISOString(),
      patientId,
    };

    // Store document metadata in IPFS
    const documentCid = await ipfsService.uploadData(document);
    
    // Record the document upload on the blockchain
    await fabricService.updatePatientRecord({
      id: document.id,
      type: 'DOCUMENT_UPLOAD',
      cid: documentCid,
      timestamp: document.uploadedAt,
      doctorId,
      patientId,
      documentName: document.name,
      documentType: document.type,
    });

    // Log the activity
    await updateDoctorActivity({
      id: `activity_${uuidv4()}`,
      doctorId,
      action: 'DOCUMENT_UPLOAD',
      details: {
        documentId: document.id,
        patientId,
        documentType: document.type,
        size: document.size,
      },
      timestamp: new Date().toISOString(),
      ipAddress: undefined,
      userAgent: 'Doctor Service'
    });

    return { cid, url: documentUrl };
  } catch (error) {
    console.error('Error uploading document:', error);
    throw new Error(`Failed to upload document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Patient Search and Record Management
export async function searchPatients(query: string): Promise<any[]> {
  try {
    // In a real implementation, this would query the blockchain
    // For now, we'll filter the sample data
    const searchTerm = query.toLowerCase();
    return SAMPLE_PATIENTS.filter(patient => 
      patient.id.toLowerCase().includes(searchTerm) ||
      patient.name.toLowerCase().includes(searchTerm) ||
      patient.contact.includes(searchTerm)
    );
  } catch (error) {
    console.error('Error searching patients:', error);
    throw new Error('Failed to search patients');
  }
}

export async function getPatientDetails(patientId: string): Promise<any> {
  try {
    // In a real implementation, this would get the patient from the blockchain
    const patient = SAMPLE_PATIENTS.find(p => p.id === patientId);
    if (!patient) throw new Error('Patient not found');
    
    // Get the patient's medical records from IPFS
    const records = await Promise.all(
      patient.medicalRecordCids.map(cid => 
        ipfsService.getData(cid).catch(() => null)
      )
    );
    
    return {
      ...patient,
      medicalRecords: records.filter(Boolean)
    };
  } catch (error) {
    console.error('Error getting patient details:', error);
    throw new Error('Failed to get patient details');
  }
}

export async function updatePatientRecord(
  patientId: string, 
  updates: any, 
  doctorId: string
): Promise<{ success: boolean; cid?: string }> {
  try {
    // In a real implementation, this would:
    // 1. Get the current patient record from the blockchain
    // 2. Update the record with the new data
    // 3. Store the updated record in IPFS
    // 4. Record the update on the blockchain
    
    const patient = SAMPLE_PATIENTS.find(p => p.id === patientId);
    if (!patient) throw new Error('Patient not found');
    
    // Create a new record with the updates
    const updatedPatient = {
      ...patient,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // In a real implementation, we would upload to IPFS and record on blockchain
    // For now, we'll just log the update
    console.log('Updating patient record:', {
      patientId,
      updates,
      updatedBy: doctorId,
      timestamp: new Date().toISOString()
    });
    
    return { 
      success: true,
      cid: 'QmXxSampleCidUpdated' // In real implementation, this would be the IPFS CID
    };
  } catch (error) {
    console.error('Error updating patient record:', error);
    throw new Error('Failed to update patient record');
  }
}

// Add this function to get sample patients for the demo
export function getSamplePatients() {
  return SAMPLE_PATIENTS;
}
