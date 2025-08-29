'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function PatientDashboard() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in, if not redirect to login
    const isLoggedIn = localStorage.getItem('patientAuth') === 'authenticated';
    if (!isLoggedIn) {
      router.push('/patient/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('patientAuth');
    localStorage.removeItem('patientData');
    router.push('/patient/login');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Health Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div 
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push('/patient/health-passport')}
        >
          <h2 className="text-xl font-semibold mb-2">Health Passport</h2>
          <p className="text-muted-foreground">View and manage your health records and information</p>
        </div>

        <div 
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push('/patient/medical-records')}
        >
          <h2 className="text-xl font-semibold mb-2">Medical Records</h2>
          <p className="text-muted-foreground">Access your complete medical history</p>
        </div>

        <div 
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push('/patient/emergency-access')}
        >
          <h2 className="text-xl font-semibold mb-2">Emergency Access</h2>
          <p className="text-muted-foreground">Manage emergency access to your records</p>
        </div>
      </div>
    </div>
  );
}
