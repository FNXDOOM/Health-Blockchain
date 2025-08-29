import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, FileText, Shield, CheckCircle, AlertCircle } from 'lucide-react';

const EmergencyAccess = () => {
  const [patientId, setPatientId] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accessGranted, setAccessGranted] = useState(false);
  const [patientRecords, setPatientRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [zkpVerification, setZkpVerification] = useState(null);
  const [showZkpDialog, setShowZkpDialog] = useState(false);

  const handleRequestAccess = async (e) => {
    e.preventDefault();
    
    if (!patientId) {
      setError('Please enter a patient ID');
      return;
    }
    
    if (!reason) {
      setError('Please provide a reason for emergency access');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Request emergency access through blockchain API
      const response = await fetch('/api/emergency-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId,
          reason,
          doctorId: 'current-doctor-id', // In a real app, this would be from auth context
          timestamp: new Date().toISOString()
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to request emergency access');
      }
      
      // Simulate fetching patient records
      setPatientRecords([
        {
          id: 'rec-001',
          name: 'Blood Test Results',
          type: 'lab-result',
          createdAt: '2023-10-15T14:30:00Z',
          hash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
        },
        {
          id: 'rec-002',
          name: 'Chest X-Ray',
          type: 'imaging',
          createdAt: '2023-09-22T10:15:00Z',
          hash: '0x3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1'
        },
        {
          id: 'rec-003',
          name: 'Medication History',
          type: 'prescription',
          createdAt: '2023-11-05T09:45:00Z',
          hash: '0x2c624232cdd221771294dfbb310aca000a0df6ac8b66b696d90ef06fdefb64a3'
        }
      ]);
      
      setAccessGranted(true);
    } catch (error) {
      console.error('Error requesting emergency access:', error);
      setError(error.message || 'Failed to request emergency access. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    // In a real implementation, this would trigger ZKP verification
    setShowZkpDialog(true);
  };

  const performZkpVerification = async () => {
    setZkpVerification({ status: 'verifying' });
    
    try {
      // Simulate ZKP verification with the blockchain
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would call the ZKP verification API
      const response = await fetch('/api/zkp-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId,
          recordId: selectedRecord.id,
          doctorId: 'current-doctor-id',
          emergencyAccessId: 'emergency-access-id'
        })
      });
      
      // Simulate successful verification
      setZkpVerification({
        status: 'success',
        message: 'Zero-knowledge proof verified. You have temporary access to this record.',
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes from now
      });
    } catch (error) {
      console.error('Error verifying ZKP:', error);
      setZkpVerification({
        status: 'error',
        message: 'Failed to verify zero-knowledge proof. Please try again.'
      });
    }
  };

  const getRecordTypeName = (type) => {
    switch (type) {
      case 'lab-result': return 'Lab Result';
      case 'prescription': return 'Prescription';
      case 'imaging': return 'Imaging/Scan';
      case 'discharge-summary': return 'Discharge Summary';
      case 'vaccination': return 'Vaccination Record';
      case 'consultation': return 'Consultation Note';
      case 'insurance': return 'Insurance Document';
      default: return 'Other Document';
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Emergency Access Portal</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span>Emergency Medical Access</span>
          </CardTitle>
          <CardDescription>
            Request temporary access to patient records in emergency situations
          </CardDescription>
        </CardHeader>
        
        {!accessGranted ? (
          <form onSubmit={handleRequestAccess}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient Health Passport ID</Label>
                <Input
                  id="patientId"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="Enter patient's Health Passport ID"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason">Emergency Reason</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe the emergency situation requiring access to patient records"
                  rows={3}
                  required
                />
              </div>
              
              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertTitle>Important Notice</AlertTitle>
                <AlertDescription>
                  Emergency access is logged on the blockchain and the patient will be notified.
                  Only request access in genuine emergency situations.
                </AlertDescription>
              </Alert>
              
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            
            <CardFooter>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Processing Request...' : 'Request Emergency Access'}
              </Button>
            </CardFooter>
          </form>
        ) : (
          <>
            <CardContent className="space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>Access Granted</AlertTitle>
                <AlertDescription>
                  You have been granted temporary emergency access to this patient's records.
                  This access will expire in 30 minutes and is being logged on the blockchain.
                </AlertDescription>
              </Alert>
              
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-2">Patient Information</h3>
                <p className="text-sm text-muted-foreground">
                  ID: {patientId}<br />
                  Access Reason: {reason}<br />
                  Access Expires: {new Date(Date.now() + 30 * 60 * 1000).toLocaleTimeString()}
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Available Medical Records</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Click on a record to view. Each access requires zero-knowledge proof verification.
                </p>
                
                <div className="space-y-2">
                  {patientRecords.map((record) => (
                    <div 
                      key={record.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleViewRecord(record)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">{record.name}</h4>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-auto">
                        {getRecordTypeName(record.type)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setAccessGranted(false);
                  setPatientRecords([]);
                  setPatientId('');
                  setReason('');
                }}
                className="w-full"
              >
                Exit Emergency Access
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
      
      {/* Zero-Knowledge Proof Verification Dialog */}
      {selectedRecord && (
        <Dialog open={showZkpDialog} onOpenChange={setShowZkpDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Zero-Knowledge Proof Verification</DialogTitle>
              <DialogDescription>
                Verifying your emergency access rights without revealing the patient's private key
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="font-medium">{selectedRecord.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {getRecordTypeName(selectedRecord.type)} • {new Date(selectedRecord.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              {!zkpVerification ? (
                <div className="text-center space-y-4">
                  <p className="text-sm">
                    To access this record, you need to verify your emergency access rights
                    using zero-knowledge proof technology. This ensures patient privacy while
                    allowing legitimate emergency access.
                  </p>
                  
                  <Button onClick={performZkpVerification}>
                    Verify Access Rights
                  </Button>
                </div>
              ) : zkpVerification.status === 'verifying' ? (
                <div className="text-center space-y-4">
                  <div className="animate-pulse">
                    <p className="text-sm font-medium">Verifying Zero-Knowledge Proof</p>
                    <p className="text-xs text-muted-foreground">
                      This process securely verifies your access rights without compromising patient privacy
                    </p>
                  </div>
                </div>
              ) : zkpVerification.status === 'success' ? (
                <div className="space-y-4">
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle>Verification Successful</AlertTitle>
                    <AlertDescription>{zkpVerification.message}</AlertDescription>
                  </Alert>
                  
                  <div className="bg-muted p-3 rounded text-center">
                    <p className="text-xs text-muted-foreground">
                      Access expires at {new Date(zkpVerification.expiresAt).toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <Button>
                      View Medical Record
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Verification Failed</AlertTitle>
                    <AlertDescription>{zkpVerification.message}</AlertDescription>
                  </Alert>
                  
                  <div className="text-center">
                    <Button variant="outline" onClick={performZkpVerification}>
                      Try Again
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowZkpDialog(false);
                setZkpVerification(null);
              }}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EmergencyAccess;