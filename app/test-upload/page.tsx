'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TestUploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (files: File[]) => {
    setIsUploading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setUploadedFiles(prev => [...prev, ...files]);
    setIsUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedFiles.length === 0) return;
    
    const formData = new FormData();
    uploadedFiles.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      alert('Files uploaded successfully!');
      setUploadedFiles([]);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files. Please try again.');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>File Upload Test</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FileUpload
              maxSizeMB={5}
              accept="image/*,.pdf"
              onUpload={handleUpload}
              multiple={true}
              label="Upload your documents"
              description="Max file size: 5MB. Accepted formats: images, PDFs"
            />
            
            {uploadedFiles.length > 0 && (
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-2">Ready to upload ({uploadedFiles.length})</h3>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB • {file.type || 'Unknown type'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isUploading}
                    className="w-full sm:w-auto"
                  >
                    {isUploading ? 'Uploading...' : 'Submit Files'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
