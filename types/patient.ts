export interface PatientAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface MedicalRecord {
  id: string;
  cid: string; // IPFS content identifier
  date: string;
  doctor: string;
  doctorId: string;
  diagnosis: string;
  treatment: string;
  medication: string[];
  notes?: string;
  attachments?: string[]; // IPFS CIDs for medical reports/images
  hospital: string;
  roomNumber?: string;
  admissionType?: string;
  dischargeDate?: string;
  testResults?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Insurance {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  validUntil: string;
  coverageDetails?: string;
  documentCid?: string; // IPFS CID for insurance document
}

export interface Patient {
  id: string; // Unique identifier (UUID)
  cid: string; // IPFS content identifier for this record
  name: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  height?: number; // in cm
  weight?: number; // in kg
  address: PatientAddress;
  phone: string;
  email: string;
  emergencyContacts: EmergencyContact[];
  medicalRecordCids: string[]; // Array of IPFS CIDs for medical records
  allergies: string[];
  currentMedications: string[];
  insurance: Insurance;
  profileImageCid?: string; // IPFS CID for profile image
  createdAt: string;
  updatedAt: string;
  lastVisit?: string;
  nextAppointment?: string;
  isActive: boolean;
}

export interface PatientRecordUpdate {
  patientId: string;
  patientCid: string; // Reference to the patient's IPFS record
  updateType: 'medical_record' | 'prescription' | 'test_result' | 'appointment' | 'profile_update';
  dataCid: string; // IPFS CID of the updated data
  timestamp: string;
  updatedBy: string; // Doctor ID or system
  transactionId: string; // Transaction ID from Hyperledger Fabric
  signature?: string; // Digital signature for verification
}

export interface BlockchainRecord {
  id: string;
  patientId: string;
  cid: string; // IPFS CID of the record
  type: string;
  timestamp: string;
  updatedBy: string;
  transactionId: string;
  previousCid?: string; // For maintaining history
}

export interface PatientSearchResult {
  id: string;
  name: string;
  dateOfBirth: string;
  bloodType: string;
  lastVisit?: string;
  cid: string; // IPFS CID of the full record
  blockchainId: string; // ID in the blockchain
}

export interface PatientConsent {
  id: string;
  patientId: string;
  doctorId: string;
  granted: boolean;
  permissions: string[]; // e.g., ['view_medical_history', 'add_records']
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
  transactionId: string;
}
