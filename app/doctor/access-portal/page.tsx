'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DoctorAccessPortal } from "@/components/doctor-access-portal"

export default function DoctorAccessPortalPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in, if not redirect to login
    const isLoggedIn = localStorage.getItem('doctorAuth') === 'authenticated';
    if (!isLoggedIn) {
      router.push('/doctor/login');
    }
  }, [router]);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Patient Records Access</h1>
        <Button variant="outline" onClick={() => router.push('/doctor')}>
          Back to Dashboard
        </Button>
      </div>
      <DoctorAccessPortal />
    </div>
  )
}