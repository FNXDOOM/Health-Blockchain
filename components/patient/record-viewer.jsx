import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Download, Shield, Clock, Eye, Lock, CheckCircle, AlertTriangle } from 'lucide-react';

const RecordViewer = ({ patientId }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [accessLog, setAccessLog] = useState([]);
  const [showAccessLog, setShowAccessLog] = useState(false);

  useEffect(() => {
    // Fetch patient records from the blockchain API
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/patients/${patientId}/records`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch records');
        }
        
        const data = await response.json();
        setRecords(data.records);
      } catch (error) {
        console.error('Error fetching records:', error);
        setError('Failed to load medical records. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (patientId) {
      fetchRecords();
    }
  }, [patientId]);

  const handleViewRecord = async (record) => {
    setSelectedRecord(record);
    
    // Fetch access log for this record
    try {
      const response = await fetch(`/api/patients/${patientId}/records/${record.id}/access-log`);
      if (response.ok) {
        const data = await response.json();
        setAccessLog(data.accessLog);
      }
    } catch (error) {
      console.error('Error fetching access log:', error);
    }
  };

  const verifyOnBlockchain = async () => {
    if (!selectedRecord) return;
    
    setVerifying(true);
    setVerificationStatus(null);
    
    try {
      // Call blockchain verification API
      const response = await fetch(`/api/verify-record`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recordId: selectedRecord.id,
          patientId: patientId,
          hash: selectedRecord.hash
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.verified) {
        setVerificationStatus({
          status: 'verified',
          message: 'Record verified on blockchain. Data integrity confirmed.',
          timestamp: data.timestamp,
          blockNumber: data.blockNumber
        });
      } else {
        setVerificationStatus({
          status: 'failed',
          message: data.message || 'Record verification failed. Data may have been tampered with.'
        });
      }
    } catch (error) {
      console.error('Error verifying record:', error);
      setVerificationStatus({
        status: 'error',
        message: 'Verification service unavailable. Please try again later.'
      });
    } finally {
      setVerifying(false);
    }
  };

  const downloadRecord = async () => {
    if (!selectedRecord) return;
    
    try {
      const response = await fetch(`/api/patients/${patientId}/records/${selectedRecord.id}/download`);
      
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
      
      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'medical-record.pdf';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/i);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading record:', error);
    }
  };

  const getRecordTypeIcon = (type) => {
    switch (type) {
      case 'lab-result': return <FileText className="h-4 w-4" />;
      case 'prescription': return <FileText className="h-4 w-4" />;
      case 'imaging': return <FileText className="h-4 w-4" />;
      case 'discharge-summary': return <FileText className="h-4 w-4" />;
      case 'vaccination': return <FileText className="h-4 w-4" />;
      case 'consultation': return <FileText className="h-4 w-4" />;
      case 'insurance': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medical Records</CardTitle>
          <CardDescription>Loading your secure medical records...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medical Records</CardTitle>
          <CardDescription>There was an error loading your records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6 text-center">
            <div>
              <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
              <p className="text-muted-foreground">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Records</CardTitle>
        <CardDescription>
          Your blockchain-secured medical records. All access is logged and verified.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No Records Found</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              You don't have any medical records uploaded yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <div 
                key={record.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleViewRecord(record)}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {getRecordTypeIcon(record.type)}
                  </div>
                  <div>
                    <h4 className="font-medium">{record.name || getRecordTypeName(record.type)}</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="ml-auto mr-2">
                  {getRecordTypeName(record.type)}
                </Badge>
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {selectedRecord && (
        <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedRecord.name || getRecordTypeName(selectedRecord.type)}</DialogTitle>
              <DialogDescription>
                Uploaded on {new Date(selectedRecord.createdAt).toLocaleDateString()} • {selectedRecord.fileSize} KB
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="preview">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="verification">Blockchain Verification</TabsTrigger>
                <TabsTrigger value="access" onClick={() => setShowAccessLog(true)}>Access Log</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  {selectedRecord.fileType?.startsWith('image/') ? (
                    <img 
                      src={`/api/patients/${patientId}/records/${selectedRecord.id}/content`}
                      alt={selectedRecord.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-center p-8">
                      <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        {selectedRecord.fileType === 'application/pdf' ? 'PDF Document' : 'Document Preview Not Available'}
                      </p>
                      <Button variant="outline" className="mt-4" onClick={downloadRecord}>
                        <Download className="h-4 w-4 mr-2" />
                        Download to View
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedRecord.description || 'No description provided'}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="verification" className="space-y-4">
                <div className="bg-muted p-6 rounded-lg text-center">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-medium mb-2">Blockchain Verification</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Verify this record's integrity by checking its hash against the blockchain ledger.
                  </p>
                  
                  {!verificationStatus ? (
                    <Button onClick={verifyOnBlockchain} disabled={verifying}>
                      {verifying ? 'Verifying...' : 'Verify on Blockchain'}
                    </Button>
                  ) : verificationStatus.status === 'verified' ? (
                    <div className="space-y-4">
                      <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-start">
                        <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <div className="text-left">
                          <p className="font-medium">Record Verified</p>
                          <p className="text-sm">{verificationStatus.message}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-background p-3 rounded border">
                          <p className="text-muted-foreground">Block Number</p>
                          <p className="font-mono">{verificationStatus.blockNumber}</p>
                        </div>
                        <div className="bg-background p-3 rounded border">
                          <p className="text-muted-foreground">Timestamp</p>
                          <p>{new Date(verificationStatus.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <Button variant="outline" onClick={verifyOnBlockchain}>
                        Verify Again
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start">
                        <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <div className="text-left">
                          <p className="font-medium">Verification Failed</p>
                          <p className="text-sm">{verificationStatus.message}</p>
                        </div>
                      </div>
                      
                      <Button variant="outline" onClick={verifyOnBlockchain}>
                        Try Again
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    Record Hash
                  </h4>
                  <p className="text-xs font-mono bg-background p-2 rounded border overflow-x-auto">
                    {selectedRecord.hash}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="access" className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-4">Access History</h4>
                  
                  {accessLog.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No access records found for this document.
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {accessLog.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell>{log.userName}</TableCell>
                            <TableCell>{log.userRole}</TableCell>
                            <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                            <TableCell>{log.action}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedRecord(null)}>
                Close
              </Button>
              <Button onClick={downloadRecord}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default RecordViewer;