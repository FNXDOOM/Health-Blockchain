'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Patient } from '@/types/patient';
import { useRouter } from 'next/navigation';

type PatientContextType = {
  currentPatient: Patient | null;
  setCurrentPatient: (patient: Patient | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
};

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: ReactNode }) {
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on initial load
  useEffect(() => {
    async function checkSession() {
      try {
        const session = localStorage.getItem('patientAuth');
        if (session === 'authenticated') {
          const patientData = localStorage.getItem('patientData');
          if (patientData) {
            setCurrentPatient(JSON.parse(patientData));
          } else {
            // If no patient data but session exists, fetch it
            // This is a placeholder - implement actual auth check
            // await fetchPatientData();
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        localStorage.removeItem('patientAuth');
        localStorage.removeItem('patientData');
      } finally {
        setIsLoading(false);
      }
    }

    checkSession();
  }, []);

  const login = async (patientData: Patient) => {
    setCurrentPatient(patientData);
    localStorage.setItem('patientAuth', 'authenticated');
    localStorage.setItem('patientData', JSON.stringify(patientData));
    router.push('/patient/health-passport');
  };

  const logout = () => {
    setCurrentPatient(null);
    localStorage.removeItem('patientAuth');
    localStorage.removeItem('patientData');
    router.push('/patient/login');
  };

  return (
    <PatientContext.Provider
      value={{
        currentPatient,
        setCurrentPatient: (patient) => {
          setCurrentPatient(patient);
          if (patient) {
            localStorage.setItem('patientData', JSON.stringify(patient));
          } else {
            localStorage.removeItem('patientData');
          }
        },
        isAuthenticated: !!currentPatient,
        isLoading,
        logout,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
}
