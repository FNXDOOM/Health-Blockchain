import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Helper functions for patient data
export const patientService = {
  // Get patient by ID
  async getPatient(id: string) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update patient record
  async updatePatient(id: string, updates: Partial<Patient>) {
    const { data, error } = await supabase
      .from('patients')
      .update({ ...updates, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Add medical record
  async addMedicalRecord(patientId: string, record: Omit<MedicalRecord, 'id'>) {
    const { data, error } = await supabase
      .from('medical_records')
      .insert([{ ...record, patientId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Subscribe to real-time updates
  subscribeToPatientUpdates(patientId: string, callback: (update: any) => void) {
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
  },
};
