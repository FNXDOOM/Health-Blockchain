import EmergencyAccess from '@/components/doctor/emergency-access';
import { BreadcrumbNavigation } from '@/components/breadcrumb-navigation';

export const metadata = {
  title: 'Emergency Access | HealthX Passport',
  description: 'Secure emergency access to patient records with zero-knowledge proof verification',
};

export default function EmergencyAccessPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <BreadcrumbNavigation 
        items={[
          { title: 'Dashboard', href: '/doctor' },
          { title: 'Emergency Access' },
        ]} 
      />
      <EmergencyAccess />
    </div>
  );
}
