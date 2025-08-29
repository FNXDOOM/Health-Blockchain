'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type FormData = {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  aadhaarNumber: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  allergies: string;
  currentMedications: string;
  chronicConditions: string;
};

export default function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [did, setDid] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    aadhaarNumber: '',
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    allergies: '',
    currentMedications: '',
    chronicConditions: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep1 = () => {
    const { fullName, dateOfBirth, gender, bloodGroup, aadhaarNumber, phone } = formData;
    if (!fullName || !dateOfBirth || !gender || !bloodGroup || !aadhaarNumber || !phone) {
      toast.error('Please fill in all required fields');
      return false;
    }
    
    if (!/^\d{12}$/.test(aadhaarNumber)) {
      toast.error('Please enter a valid 12-digit Aadhaar number');
      return false;
    }
    
    if (!/^\d{10}$/.test(phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) {
      return;
    }
    setStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.address || !formData.emergencyContact) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/patients/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          allergies: formData.allergies.split(',').map(a => a.trim()).filter(Boolean),
          currentMedications: formData.currentMedications.split(',').map(m => m.trim()).filter(Boolean),
          chronicConditions: formData.chronicConditions.split(',').map(c => c.trim()).filter(Boolean),
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to onboard patient');
      }
      
      setDid(data.did);
      setStep(4); // Show success step
      
      // Save DID to localStorage for session management
      if (typeof window !== 'undefined') {
        localStorage.setItem('patientDid', data.did);
      }
      
    } catch (error: any) {
      console.error('Error during patient onboarding:', error);
      toast.error(error.message || 'Failed to complete onboarding');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueToDashboard = () => {
    router.push('/patient/dashboard');
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {step === 4 ? 'Registration Complete!' : `Patient Onboarding (Step ${step}/3)`}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select 
                    value={formData.gender} 
                    onValueChange={(value) => handleSelectChange('gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group *</Label>
                  <Select 
                    value={formData.bloodGroup} 
                    onValueChange={(value) => handleSelectChange('bloodGroup', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aadhaarNumber">Aadhaar Number *</Label>
                  <Input
                    id="aadhaarNumber"
                    name="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    onChange={handleChange}
                    placeholder="12-digit Aadhaar number"
                    maxLength={12}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                      +91
                    </span>
                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit phone number"
                      maxLength={10}
                      className="rounded-l-none"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact *</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                      +91
                    </span>
                    <Input
                      type="tel"
                      id="emergencyContact"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      placeholder="10-digit emergency number"
                      maxLength={10}
                      className="rounded-l-none"
                      required
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">Full Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House no., Street, City, State, Pincode"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium">Medical Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies (comma separated)</Label>
                  <Input
                    id="allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    placeholder="e.g., Penicillin, Peanuts, Dust"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currentMedications">Current Medications (comma separated)</Label>
                  <Input
                    id="currentMedications"
                    name="currentMedications"
                    value={formData.currentMedications}
                    onChange={handleChange}
                    placeholder="e.g., Metformin 500mg, Amlodipine 5mg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="chronicConditions">Chronic Conditions (comma separated)</Label>
                  <Input
                    id="chronicConditions"
                    name="chronicConditions"
                    value={formData.chronicConditions}
                    onChange={handleChange}
                    placeholder="e.g., Diabetes, Hypertension"
                  />
                </div>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-medium text-blue-800">Review Your Information</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Please review all the information you've provided before submitting.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Personal Details</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex">
                      <dt className="w-32 text-muted-foreground">Full Name:</dt>
                      <dd>{formData.fullName}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-muted-foreground">Date of Birth:</dt>
                      <dd>{new Date(formData.dateOfBirth).toLocaleDateString()}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-muted-foreground">Gender:</dt>
                      <dd className="capitalize">{formData.gender}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-muted-foreground">Blood Group:</dt>
                      <dd>{formData.bloodGroup}</dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex">
                      <dt className="w-32 text-muted-foreground">Phone:</dt>
                      <dd>+91 {formData.phone}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-muted-foreground">Email:</dt>
                      <dd>{formData.email}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-muted-foreground">Emergency:</dt>
                      <dd>+91 {formData.emergencyContact}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-muted-foreground">Address:</dt>
                      <dd className="truncate">{formData.address}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              <div className="pt-4">
                <h4 className="font-medium mb-2">Medical Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h5 className="text-muted-foreground text-sm">Allergies</h5>
                    <p>{formData.allergies || 'None'}</p>
                  </div>
                  <div>
                    <h5 className="text-muted-foreground text-sm">Medications</h5>
                    <p>{formData.currentMedications || 'None'}</p>
                  </div>
                  <div>
                    <h5 className="text-muted-foreground text-sm">Conditions</h5>
                    <p>{formData.chronicConditions || 'None'}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="consent"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <label htmlFor="consent" className="text-sm">
                    I confirm that all the information provided is accurate to the best of my knowledge.
                  </label>
                </div>
              </div>
            </div>
          )}
          
          {step === 4 && did && (
            <div className="text-center py-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Onboarding Successful!</h3>
              <p className="mt-2 text-sm text-gray-500">
                Your patient profile has been created successfully.
              </p>
              
              <div className="mt-6 bg-blue-50 p-4 rounded-md max-w-md mx-auto">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Your Patient ID:</span>
                </p>
                <p className="mt-1 font-mono text-lg font-bold text-blue-800 break-all">
                  {did}
                </p>
                <p className="mt-2 text-xs text-blue-600">
                  Please save this ID for future reference. You'll need it to access your health records.
                </p>
              </div>
              
              <div className="mt-6">
                <Button onClick={handleContinueToDashboard}>
                  Go to Dashboard
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        
        {step < 4 && (
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={step === 1 || isSubmitting}
            >
              Back
            </Button>
            
            {step < 3 ? (
              <Button 
                type="button" 
                onClick={handleNext}
                disabled={isSubmitting}
              >
                Next
              </Button>
            ) : (
              <Button 
                type="button" 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
