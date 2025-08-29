import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUpload } from '@/components/patient/file-upload';
import { Shield, CheckCircle, AlertTriangle, Search, Key } from 'lucide-react';

const DoctorVerificationPortal = () => {
  const [verificationStep, setVerificationStep] = useState('identity');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    licenseNumber: '',
    fullName: '',
    institution: '',
    specialization: '',
    email: '',
    phoneNumber: '',
    verificationNotes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitIdentity = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate form
    if (!formData.licenseNumber || !formData.fullName || !formData.institution || !formData.specialization) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }
    
    try {
      // Submit identity verification request to blockchain API
      const response = await fetch('/api/doctors/verify-identity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Verification request failed');
      }
      
      // Move to next step
      setVerificationStep('credentials');
    } catch (error) {
      console.error('Error submitting verification:', error);
      setError(error.message || 'Failed to submit verification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCredentials = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // This would typically involve document verification
      // For now, we'll simulate a successful verification
      
      // In a real implementation, this would verify the uploaded credentials
      // against medical board databases or other verification services
      
      // Move to final step
      setVerificationStep('complete');
      setSuccess(true);
    } catch (error) {
      console.error('Error verifying credentials:', error);
      setError(error.message || 'Failed to verify credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSearch = async (e) => {
    e.preventDefault();
    // This would search for a patient by ID or other identifier
    // and verify the doctor's access rights on the blockchain
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Doctor Verification Portal</h1>
      
      {verificationStep === 'complete' ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              <span>Verification Complete</span>
            </CardTitle>
            <CardDescription>
              Your identity has been verified on the blockchain network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="bg-green-50 text-green-800 border-green-200 mb-6">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Your medical credentials have been verified and securely stored on our private blockchain network.
                You now have access to patient records based on your permissions.
              </AlertDescription>
            </Alert>
            
            <Tabs defaultValue="search">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="search">Patient Search</TabsTrigger>
                <TabsTrigger value="upload">Upload Records</TabsTrigger>
              </TabsList>
              
              <TabsContent value="search" className="space-y-4 pt-4">
                <form onSubmit={handlePatientSearch}>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Input 
                        type="text" 
                        placeholder="Enter patient ID or health passport number" 
                        className="w-full"
                      />
                    </div>
                    <Button type="submit">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </form>
                
                <div className="bg-muted p-8 rounded-lg text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Patient Selected</h3>
                  <p className="text-muted-foreground">
                    Search for a patient using their Health Passport ID to view their records
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="upload" className="space-y-4 pt-4">
                <div className="bg-muted p-8 rounded-lg text-center mb-4">
                  <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Patient Authorization Required</h3>
                  <p className="text-muted-foreground">
                    You need to search for a patient and request access before uploading records
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {verificationStep === 'identity' ? 'Identity Verification' : 'Credential Verification'}
            </CardTitle>
            <CardDescription>
              {verificationStep === 'identity' 
                ? 'Verify your identity to access the blockchain network' 
                : 'Upload your medical credentials for verification'}
            </CardDescription>
          </CardHeader>
          
          {verificationStep === 'identity' ? (
            <form onSubmit={handleSubmitIdentity}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">Medical License Number *</Label>
                    <Input
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      placeholder="Enter your license number"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Dr. Jane Smith"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution/Hospital *</Label>
                    <Input
                      id="institution"
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
                      placeholder="Medical Center Name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization *</Label>
                    <Input
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      placeholder="e.g. Cardiology"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="doctor@hospital.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="verificationNotes">Additional Notes</Label>
                  <Textarea
                    id="verificationNotes"
                    name="verificationNotes"
                    value={formData.verificationNotes}
                    onChange={handleChange}
                    placeholder="Any additional information to help with verification"
                    rows={3}
                  />
                </div>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-primary mt-1 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium">Blockchain Verification</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Your identity will be securely verified and stored on our private Hyperledger blockchain.
                        This ensures tamper-proof credentials and secure access to patient records.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Processing...' : 'Continue to Credential Verification'}
                </Button>
              </CardFooter>
            </form>
          ) : (
            <form onSubmit={handleSubmitCredentials}>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Medical License</Label>
                    <FileUpload 
                      patientId={null} // Not needed for doctor verification
                      onUploadComplete={() => {}}
                    />
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">Board Certification</Label>
                    <FileUpload 
                      patientId={null}
                      onUploadComplete={() => {}}
                    />
                  </div>
                </div>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setVerificationStep('identity')}
                >
                  Back to Identity
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Verifying...' : 'Complete Verification'}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      )}
    </div>
  );
};

export default DoctorVerificationPortal;