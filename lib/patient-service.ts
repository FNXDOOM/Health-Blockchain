import { ipfsService } from './ipfs';
import { fabricService } from './fabric-service';
import { Patient, PatientRecordUpdate, MedicalRecord } from '@/types/patient';
import { v4 as uuidv4 } from 'uuid';

class PatientService {
  // Create a new patient record
  async createPatient(patientData: Omit<Patient, 'id' | 'cid' | 'createdAt' | 'updatedAt'>): Promise<Patient> {
    try {
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
      await fabricService.createPatientRecord(patient);
      
      return patient;
    } catch (error) {
      console.error('Error creating patient:', error);
      throw new Error('Failed to create patient record');
    }
  }

  // Get a patient by ID
  async getPatient(patientId: string): Promise<Patient | null> {
    try {
      // In a real implementation, you would query your database for the patient's CID
      // For now, we'll get the latest record from the blockchain
      const history = await fabricService.getPatientHistory(patientId);
      if (history.length === 0) return null;
      
      // Get the latest patient record from IPFS
      const latestRecord = history[history.length - 1];
      const patient = await ipfsService.getData<Patient>(latestRecord.cid);
      
      return patient;
    } catch (error) {
      console.error('Error fetching patient:', error);
      throw new Error('Failed to fetch patient record');
    }
  }

  // Add a medical record to a patient
  async addMedicalRecord(patientId: string, recordData: Omit<MedicalRecord, 'id' | 'cid' | 'createdAt' | 'updatedAt'>): Promise<MedicalRecord> {
    try {
      // Create the medical record
      const record: MedicalRecord = {
        ...recordData,
        id: uuidv4(),
        cid: '', // Will be set after IPFS upload
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Upload medical record to IPFS
      const cid = await ipfsService.uploadData(record);
      record.cid = cid;

      // Get the patient
      const patient = await this.getPatient(patientId);
      if (!patient) {
        throw new Error('Patient not found');
      }

      // Update patient's medical record CIDs
      patient.medicalRecordCids = [...patient.medicalRecordCids, cid];
      patient.updatedAt = new Date().toISOString();
      
      // Upload updated patient data to IPFS
      const updatedPatientCid = await ipfsService.uploadData(patient);
      patient.cid = updatedPatientCid;

      // Record the update on the blockchain
      await fabricService.updatePatientRecord({
        patientId: patient.id,
        patientCid: patient.cid,
        updateType: 'medical_record',
        dataCid: cid,
        timestamp: new Date().toISOString(),
        updatedBy: record.doctorId || 'system',
      });

      return record;
    } catch (error) {
      console.error('Error adding medical record:', error);
      throw new Error('Failed to add medical record');
    }
  }

  // Get a patient's medical records
  async getMedicalRecords(patientId: string): Promise<MedicalRecord[]> {
    try {
      const patient = await this.getPatient(patientId);
      if (!patient) {
        throw new Error('Patient not found');
      }

      // Fetch all medical records from IPFS
      const records = await Promise.all(
        patient.medicalRecordCids.map(cid => 
          ipfsService.getData<MedicalRecord>(cid)
        )
      );

      return records.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } catch (error) {
      console.error('Error fetching medical records:', error);
      throw new Error('Failed to fetch medical records');
    }
  }

  // Verify a patient's record on the blockchain
  async verifyRecord(recordId: string): Promise<boolean> {
    return fabricService.verifyRecord(recordId);
  }
}

export const patientService = new PatientService();
