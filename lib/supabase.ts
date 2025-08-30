import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Create a mock client if environment variables are missing
const createMockClient = () => ({
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        single: async () => ({ data: null, error: { message: 'Mock client - no real data' } })
      })
    }),
    update: (updates: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: async () => ({ data: null, error: { message: 'Mock client - no real data' } })
        })
      })
    }),
    insert: (data: any) => ({
      select: () => ({
        single: async () => ({ data: null, error: { message: 'Mock client - no real data' } })
      })
    })
  }),
  channel: (name: string) => ({
    on: () => ({
      subscribe: () => ({ unsubscribe: () => {} })
    })
  })
});

// Create the Supabase client with fallback
export const supabase = supabaseUrl === 'https://placeholder.supabase.co' 
  ? createMockClient() as any
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });

// Helper functions for patient data
export const patientService = {
  // Get patient by ID
  async getPatient(id: string) {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Mock patient service - returning placeholder data');
      return {
        id,
        name: 'Mock Patient',
        dateOfBirth: '1990-01-01',
        gender: 'Unknown',
        bloodType: 'Unknown',
        address: {
          street: 'Mock Street',
          city: 'Mock City',
          state: 'Mock State',
          postalCode: '00000',
          country: 'Mock Country'
        },
        phone: '000-000-0000',
        email: 'mock@example.com',
        emergencyContacts: [],
        medicalRecordCids: [],
        allergies: [],
        currentMedications: [],
        insurance: {
          provider: 'Mock Insurance',
          policyNumber: 'MOCK-001',
          validUntil: '2025-12-31'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      };
    }
  },

  // Update patient record
  async updatePatient(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('patients')
        .update({ ...updates, updatedAt: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Mock patient service - returning updated mock data');
      return { id, ...updates, updatedAt: new Date().toISOString() };
    }
  },

  // Add medical record
  async addMedicalRecord(patientId: string, record: any) {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .insert([{ ...record, patientId }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Mock patient service - returning mock medical record');
      return { id: `mock-record-${Date.now()}`, patientId, ...record };
    }
  },

  // Subscribe to real-time updates
  subscribeToPatientUpdates(patientId: string, callback: (update: any) => void) {
    try {
      return supabase
        .channel(`patient_${patientId}_changes`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'medical_records',
            filter: `patient_id=eq.${patientId}`,
          },
          (payload) => callback(payload)
        )
        .subscribe();
    } catch (error) {
      console.warn('Mock subscription service');
      return { unsubscribe: () => {} };
    }
  },
};
