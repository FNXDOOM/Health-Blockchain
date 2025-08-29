import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_FILE = path.join(process.cwd(), 'data', 'patients.json');

export interface Patient {
  did: string;
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    bloodGroup: string;
    aadhaarNumber: string;
    phone: string;
    email: string;
    address: string;
    emergencyContact: string;
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    cid: string;
    uploadedAt: string;
    accessRequests: Array<{
      doctorDid: string;
      status: 'approved' | 'rejected' | 'pending';
      requestedAt: string;
      expiresAt?: string;
      notes?: string;
    }>;
  }>;
  auditLogs: Array<{
    timestamp: string;
    action: string;
    actor: string; // DID of who performed the action
    details: Record<string, any>;
  }>;
  medicalInfo: {
    allergies: string[];
    currentMedications: string[];
    chronicConditions: string[];
    surgeries: Array<{
      name: string;
      date: string;
      notes?: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

// Initialize data file if it doesn't exist
async function initDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
}

// Generate a unique DID for new patients
function generateDID(): string {
  return `pat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Load all patients
async function loadPatients(): Promise<Patient[]> {
  await initDataFile();
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

// Save all patients
async function savePatients(patients: Patient[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(patients, null, 2));
}

export const patientStore = {
  // Find patient by DID
  async findByDID(did: string): Promise<Patient | undefined> {
    const patients = await loadPatients();
    return patients.find(p => p.did === did);
  },

  // Find patient by ID
  findByID: async (id: string): Promise<Patient | undefined> => {
    return await patientStore.findByDID(id);
  },

  // Find patient by Aadhaar and phone
  async findByIdentifier(aadhaarNumber: string, phone: string): Promise<Patient | undefined> {
    const patients = await loadPatients();
    return patients.find(p => 
      p.personalInfo.aadhaarNumber === aadhaarNumber && 
      p.personalInfo.phone === phone
    );
  },

  // Create new patient
  async create(patientData: Omit<Patient, 'did' | 'createdAt' | 'updatedAt' | 'documents' | 'auditLogs'>): Promise<Patient> {
    const patients = await loadPatients();
    
    // Check if patient with same Aadhaar or phone exists
    const exists = patients.some(p => 
      p.personalInfo.aadhaarNumber === patientData.personalInfo.aadhaarNumber ||
      p.personalInfo.phone === patientData.personalInfo.phone
    );
    
    if (exists) {
      throw new Error('Patient with same Aadhaar or phone number already exists');
    }
    
    const now = new Date().toISOString();
    const newPatient: Patient = {
      ...patientData,
      did: generateDID(),
      documents: [],
      auditLogs: [{
        timestamp: now,
        action: 'PATIENT_CREATED',
        actor: 'system',
        details: {}
      }],
      createdAt: now,
      updatedAt: now
    };
    
    patients.push(newPatient);
    await savePatients(patients);
    return newPatient;
  },

  // Update patient
  async update(did: string, updates: Partial<Omit<Patient, 'did' | 'createdat'>> & { auditLogs?: Patient['auditLogs'] }): Promise<Patient> {
    const patients = await loadPatients();
    const index = patients.findIndex(p => p.did === did);
    
    if (index === -1) {
      throw new Error('Patient not found');
    }
    
    const updatedPatient = {
      ...patients[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    patients[index] = updatedPatient;
    await savePatients(patients);
    return updatedPatient;
  },

  // Add document
  async addDocument(did: string, document: Omit<Patient['documents'][0], 'id' | 'uploadedAt' | 'accessRequests'>): Promise<Patient> {
    const patient = await this.findByDID(did);
    if (!patient) {
      throw new Error('Patient not found');
    }
    
    const newDocument = {
      ...document,
      id: uuidv4(),
      uploadedAt: new Date().toISOString(),
      accessRequests: []
    };
    
    return this.update(did, {
      documents: [...patient.documents, newDocument],
      auditLogs: [
        ...patient.auditLogs,
        {
          timestamp: new Date().toISOString(),
          action: 'DOCUMENT_UPLOADED',
          actor: 'system',
          details: { documentId: newDocument.id, name: newDocument.name }
        }
      ]
    });
  },

  // Request document access
  async requestDocumentAccess(patientId: string, documentId: string, doctorDid: string, notes?: string): Promise<Patient> {
    const patient = await this.findByDID(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }
    
    const document = patient.documents.find(doc => doc.id === documentId);
    if (!document) {
      throw new Error('Document not found');
    }
    
    const existingRequest = document.accessRequests.find(req => 
      req.doctorDid === doctorDid && req.status === 'pending'
    );
    
    if (existingRequest) {
      throw new Error('Access request already pending');
    }
    
    const updatedDocuments = patient.documents.map(doc => {
      if (doc.id === documentId) {
        return {
          ...doc,
          accessRequests: [
            ...doc.accessRequests,
            {
              doctorDid,
              status: 'pending' as const,
              requestedAt: new Date().toISOString(),
              notes
            }
          ]
        };
      }
      return doc;
    });
    
    return this.update(patientId, {
      documents: updatedDocuments,
      auditLogs: [
        ...patient.auditLogs,
        {
          timestamp: new Date().toISOString(),
          action: 'DOCUMENT_ACCESS_REQUESTED',
          actor: doctorDid,
          details: { documentId, documentName: document.name }
        }
      ]
    });
  },

  // Update document access status
  async updateDocumentAccess(
    patientId: string,
    documentId: string,
    doctorDid: string,
    status: 'approved' | 'rejected',
    expiresInHours: number = 24
  ): Promise<Patient> {
    const patient = await this.findByDID(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }
    
    const updatedDocuments = patient.documents.map(doc => {
      if (doc.id === documentId) {
        const updatedRequests = doc.accessRequests.map(req => {
          if (req.doctorDid === doctorDid && req.status === 'pending') {
            const now = new Date();
            const expiresAt = new Date(now.getTime() + expiresInHours * 60 * 60 * 1000).toISOString();
            return {
              ...req,
              status,
              expiresAt: status === 'approved' ? expiresAt : undefined
            };
          }
          return req;
        });
        
        return {
          ...doc,
          accessRequests: updatedRequests
        };
      }
      return doc;
    });
    
    const document = patient.documents.find(doc => doc.id === documentId);
    if (!document) {
      throw new Error('Document not found');
    }
    
    return this.update(patientId, {
      documents: updatedDocuments,
      auditLogs: [
        ...patient.auditLogs,
        {
          timestamp: new Date().toISOString(),
          action: `DOCUMENT_ACCESS_${status.toUpperCase()}`,
          actor: 'system',
          details: { 
            documentId, 
            doctorDid,
            expiresInHours: status === 'approved' ? expiresInHours : undefined
          }
        }
      ]
    });
  }
};
