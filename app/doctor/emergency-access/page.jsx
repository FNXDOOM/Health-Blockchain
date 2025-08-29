'use client';
import React from 'react';
import EmergencyAccess from '@/components/doctor/emergency-access';
import { BreadcrumbNavigation } from '@/components/breadcrumb-navigation';

export const metadata = {
  title: 'Emergency Access | HealthX Passport',
  description: 'Secure emergency access to patient records with zero-knowledge proof verification',
};

export default function EmergencyAccessPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <BreadcrumbNavigation />
      <EmergencyAccess />
    </div>
  );
}