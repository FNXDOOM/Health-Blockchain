import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_FILE = path.join(process.cwd(), 'data', 'doctors.json');

export interface Doctor {
  did: string;
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    phone: string;
    email: string;
    address: string;
    specialization: string;
    licenseNumber: string;
    hospital: string;
    yearsOfExperience: number;
  };
  verified: boolean;
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

// Generate a unique DID for new doctors
function generateDID(): string {
  return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Load all doctors
async function loadDoctors(): Promise<Doctor[]> {
  await initDataFile();
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

// Save all doctors
async function saveDoctors(doctors: Doctor[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(doctors, null, 2));
}

export const doctorStore = {
  // Find doctor by DID
  async findByDID(did: string): Promise<Doctor | undefined> {
    const doctors = await loadDoctors();
    return doctors.find(d => d.did === did);
  },

  // Find doctor by license number
  async findByLicense(licenseNumber: string): Promise<Doctor | undefined> {
    const doctors = await loadDoctors();
    return doctors.find(d => d.personalInfo.licenseNumber === licenseNumber);
  },

  // Verify doctor by license number and phone
  async verify(licenseNumber: string, phone: string): Promise<Doctor | undefined> {
    const doctors = await loadDoctors();
    return doctors.find(d => 
      d.personalInfo.licenseNumber === licenseNumber && 
      d.personalInfo.phone === phone
    );
  },

  // Create new doctor
  async create(doctorData: Omit<Doctor, 'did' | 'createdAt' | 'updatedAt' | 'verified'>): Promise<Doctor> {
    const doctors = await loadDoctors();
    
    // Check if doctor with same license or email exists
    const exists = doctors.some(d => 
      d.personalInfo.licenseNumber === doctorData.personalInfo.licenseNumber ||
      d.personalInfo.email === doctorData.personalInfo.email
    );
    
    if (exists) {
      throw new Error('Doctor with same license number or email already exists');
    }
    
    const now = new Date().toISOString();
    const newDoctor: Doctor = {
      ...doctorData,
      did: generateDID(),
      verified: false, // Needs admin verification
      createdAt: now,
      updatedAt: now
    };
    
    doctors.push(newDoctor);
    await saveDoctors(doctors);
    return newDoctor;
  },

  // Update doctor
  async update(did: string, updates: Partial<Omit<Doctor, 'did' | 'createdAt'>>): Promise<Doctor> {
    const doctors = await loadDoctors();
    const index = doctors.findIndex(d => d.did === did);
    
    if (index === -1) {
      throw new Error('Doctor not found');
    }
    
    const updatedDoctor = {
      ...doctors[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    doctors[index] = updatedDoctor;
    await saveDoctors(doctors);
    return updatedDoctor;
  },

  // Verify doctor (admin action)
  async verifyDoctor(did: string): Promise<Doctor> {
    return this.update(did, { verified: true });
  }
};
