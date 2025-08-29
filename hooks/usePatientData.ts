import { useEffect, useState } from 'react';
import { Patient, MedicalRecord, RealtimeUpdate } from '@/types/patient';
import { supabase } from '@/lib/supabase';

export function usePatientData(patientId: string) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch initial patient data
  useEffect(() => {
    async function fetchPatientData() {
      try {
        setLoading(true);
        
        // Fetch patient data
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('id', patientId)
          .single();

        if (patientError) throw patientError;

        // Fetch medical records
        const { data: recordsData, error: recordsError } = await supabase
          .from('medical_records')
          .select('*')
          .eq('patientId', patientId)
          .order('date', { ascending: false });

        if (recordsError) throw recordsError;

        setPatient(patientData);
        setMedicalRecords(recordsData || []);
      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError(err instanceof Error ? err : new Error('Failed to load patient data'));
      } finally {
        setLoading(false);
      }
    }

    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  // Set up real-time subscription
  useEffect(() => {
    if (!patientId) return;

    const channel = supabase
      .channel(`patient_${patientId}_updates`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'medical_records',
          filter: `patient_id=eq.${patientId}`,
        },
        (payload: RealtimeUpdate) => {
          if (payload.event === 'INSERT') {
            setMedicalRecords(prev => [payload.new, ...prev]);
          } else if (payload.event === 'UPDATE') {
            setMedicalRecords(prev =>
              prev.map(record =>
                record.id === payload.new.id ? payload.new : record
              )
            );
          } else if (payload.event === 'DELETE') {
            setMedicalRecords(prev =>
              prev.filter(record => record.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [patientId]);

  const addMedicalRecord = async (record: Omit<MedicalRecord, 'id' | 'patientId'>) => {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .insert([{ ...record, patientId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error adding medical record:', err);
      throw err;
    }
  };

  const updatePatient = async (updates: Partial<Patient>) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', patientId)
        .select()
        .single();

      if (error) throw error;
      setPatient(data);
      return data;
    } catch (err) {
      console.error('Error updating patient:', err);
      throw err;
    }
  };

  return {
    patient,
    medicalRecords,
    loading,
    error,
    addMedicalRecord,
    updatePatient,
  };
}
