import DoctorVerificationPortal from '@/components/doctor/verification-portal';
import { BreadcrumbNavigation } from '@/components/breadcrumb-navigation';

export const metadata = {
  title: 'Doctor Verification | HealthX Passport',
  description: 'Verify your medical credentials on our blockchain network',
};

export default function VerificationPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <BreadcrumbNavigation 
        items={[
          { title: 'Dashboard', href: '/doctor' },
          { title: 'Verification' },
        ]} 
      />
      <DoctorVerificationPortal />
    </div>
  );
}
