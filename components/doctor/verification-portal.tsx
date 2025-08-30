'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function DoctorVerificationPortal() {
  const [status, setStatus] = useState<'idle' | 'verifying' | 'verified' | 'error'>('idle');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!licenseNumber.trim()) {
      setError('Please enter your medical license number');
      return;
    }

    setStatus('verifying');
    setError('');

    try {
      // TODO: Replace with actual verification API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus('verified');
    } catch (err) {
      console.error('Verification failed:', err);
      setStatus('error');
      setError('Failed to verify license. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Doctor Verification</CardTitle>
        <CardDescription>
          Verify your medical credentials to gain full access to the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'verified' ? (
          <div className="text-center py-8 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="m9 11 3 3L22 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Verification Complete</h3>
            <p className="text-muted-foreground">
              Your medical credentials have been successfully verified.
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Return to Dashboard
            </Button>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="license">Medical License Number</Label>
              <Input
                id="license"
                placeholder="Enter your medical license number"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                disabled={status === 'verifying'}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Required Documents</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <svg
                    className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>Valid medical license</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>Government-issued ID</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>Proof of employment (if applicable)</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full"
                disabled={status === 'verifying'}
              >
                {status === 'verifying' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Credentials'
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
