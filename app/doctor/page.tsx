'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function DoctorDashboard() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in, if not redirect to login
    const isLoggedIn = localStorage.getItem('doctorAuth') === 'authenticated';
    if (!isLoggedIn) {
      router.push('/doctor/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('doctorAuth');
    localStorage.removeItem('currentDoctor');
    router.push('/doctor/login');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/doctor/access-portal')}>
          <CardHeader>
            <CardTitle>Access Patient Records</CardTitle>
            <CardDescription>View and manage patient health records</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Access patient health records with proper authorization</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/doctor/nft-panel')}>
          <CardHeader>
            <CardTitle>NFT Management</CardTitle>
            <CardDescription>Manage your medical credentials and access tokens</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">View and manage your medical credentials</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
            <CardDescription>View and manage your schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
