'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function EmergencyAccess() {
  const [patientId, setPatientId] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState<'idle' | 'requesting' | 'granted' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientId.trim()) {
      setError('Please enter a patient ID');
      return;
    }

    if (!reason.trim()) {
      setError('Please provide a reason for access');
      return;
    }

    setStatus('requesting');
    setError('');

    try {
      // TODO: Replace with actual emergency access API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus('granted');
    } catch (err) {
      console.error('Emergency access request failed:', err);
      setStatus('error');
      setError('Failed to request emergency access. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Emergency Access</AlertTitle>
        <AlertDescription>
          This feature allows authorized medical personnel to access patient records in emergency situations.
          All access is logged and requires proper justification.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Request Emergency Access</CardTitle>
          <CardDescription>
            Enter the patient's information and reason for emergency access
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'granted' ? (
            <div className="text-center py-8 space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Access Granted</h3>
              <p className="text-muted-foreground">
                You now have temporary emergency access to the patient's records.
              </p>
              <div className="pt-4">
                <Button onClick={() => setStatus('idle')} variant="outline">
                  Make Another Request
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRequestAccess} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input
                    id="patientId"
                    placeholder="Enter patient ID or health record number"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    disabled={status === 'requesting'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Access</Label>
                  <Input
                    id="reason"
                    placeholder="Briefly describe the emergency situation"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    disabled={status === 'requesting'}
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={status === 'requesting'}
                >
                  {status === 'requesting' ? 'Requesting Access...' : 'Request Emergency Access'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <Card className="border-destructive/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-destructive">Important Notice</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>All access is logged and monitored for security purposes.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>You are responsible for any actions taken using your credentials.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>False emergency requests may result in disciplinary action.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
