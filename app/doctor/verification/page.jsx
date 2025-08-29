'use client';
import React from 'react';
import DoctorVerificationPortal from '@/components/doctor/verification-portal';
import { BreadcrumbNavigation } from '@/components/breadcrumb-navigation';

export const metadata = {
  title: 'Doctor Verification | HealthX Passport',
  description: 'Verify your medical credentials on our blockchain network',
};

export default function DoctorVerificationPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <BreadcrumbNavigation />
      <DoctorVerificationPortal />
    </div>
  );
}