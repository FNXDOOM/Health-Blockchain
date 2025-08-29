import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import OnboardingForm from './onboarding-form';

/**
 * OnboardingFlow Component
 * 
 * This component manages the patient onboarding process, including:
 * - Personal information collection
 * - Medical history
 * - Consent management
 * - Blockchain identity creation
 */
const OnboardingFlow = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Create Your Health Passport</h1>
      
      <div className="mb-8 max-w-3xl mx-auto text-center">
        <p className="text-lg text-muted-foreground">
          Your health passport is a secure, blockchain-based digital record of your medical information.
          It gives you complete control over your health data while allowing seamless sharing with
          healthcare providers you authorize.
        </p>
      </div>
      
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="bg-primary/5">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">Secure & Private</h3>
            <p className="text-sm">Your data is encrypted and stored on a private blockchain network, accessible only with your permission.</p>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/5">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">Full Control</h3>
            <p className="text-sm">You decide who can access your medical records and for how long, with detailed access logs.</p>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/5">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">Emergency Access</h3>
            <p className="text-sm">Optional emergency access ensures critical information is available when needed most.</p>
          </CardContent>
        </Card>
      </div>
      
      <OnboardingForm />
    </div>
  );
};

export default OnboardingFlow;