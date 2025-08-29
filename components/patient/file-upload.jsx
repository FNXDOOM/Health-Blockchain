import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

const FileUpload = ({ patientId, onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [recordType, setRecordType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit');
        return;
      }
      
      // Check file type
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Invalid file type. Only images, PDFs, and office documents are allowed.');
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    if (!recordType) {
      setError('Please select a record type');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('recordType', recordType);
      formData.append('description', description);
      
      // Upload file to API
      const response = await fetch(`/api/patients/${patientId}/files`, {
        method: 'POST',
        headers: {
          'userId': 'admin' // In a real app, this would be the authenticated user's ID
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload file');
      }
      
      setSuccess(true);
      toast({
        title: 'Upload Successful',
        description: 'Your medical record has been uploaded successfully.',
        variant: 'success',
      });
      
      // Reset form
      setFile(null);
      setRecordType('');
      setDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Notify parent component
      if (onUploadComplete) {
        onUploadComplete(data.file);
      }
      
      // Reset success message after delay
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setError(error.message || 'Failed to upload file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          <span>Upload Medical Record</span>
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Select File</Label>
            <Input
              id="file"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            />
            <p className="text-xs text-muted-foreground">
              Accepted formats: Images (JPEG, PNG, GIF), PDF, Word, Excel. Max size: 10MB
            </p>
          </div>
          
          {file && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm truncate">{file.name}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="recordType">Record Type</Label>
            <Select value={recordType} onValueChange={setRecordType}>
              <SelectTrigger>
                <SelectValue placeholder="Select record type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lab-result">Lab Result</SelectItem>
                <SelectItem value="prescription">Prescription</SelectItem>
                <SelectItem value="imaging">Imaging/Scan</SelectItem>
                <SelectItem value="discharge-summary">Discharge Summary</SelectItem>
                <SelectItem value="vaccination">Vaccination Record</SelectItem>
                <SelectItem value="consultation">Consultation Note</SelectItem>
                <SelectItem value="insurance">Insurance Document</SelectItem>
                <SelectItem value="other">Other Document</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the document..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>File uploaded successfully!</AlertDescription>
            </Alert>
          )}
        </CardContent>
        
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FileUpload;