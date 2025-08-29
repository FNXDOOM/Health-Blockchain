import React from 'react';
import RecordViewer from '@/components/patient/record-viewer';
import FileUpload from '@/components/patient/file-upload';
import { BreadcrumbNavigation } from '@/components/breadcrumb-navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata = {
  title: 'Medical Records | HealthX Passport',
  description: 'View and manage your blockchain-secured medical records',
};

export default function PatientRecordsPage() {
  // In a real application, this would come from authentication context
  const patientId = 'current-patient-id';
  
  return (
    <div className="container mx-auto px-4 py-6">
      <BreadcrumbNavigation />
      
      <h1 className="text-3xl font-bold mb-8">My Medical Records</h1>
      
      <Tabs defaultValue="records" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="records">View Records</TabsTrigger>
          <TabsTrigger value="upload">Upload New Record</TabsTrigger>
        </TabsList>
        
        <TabsContent value="records" className="mt-6">
          <RecordViewer patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="upload" className="mt-6">
          <FileUpload 
            patientId={patientId} 
            onUploadComplete={() => {
              // In a real app, this would refresh the records list
              console.log('Upload complete');
            }} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}