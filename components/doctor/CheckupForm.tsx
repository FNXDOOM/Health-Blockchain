'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

type FileWithPreview = {
  file: File;
  preview: string;
  type: string;
};

export default function CheckupForm({ patientDid }: { patientDid: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    diagnosis: '',
    prescription: '',
    notes: '',
    followUpDate: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file),
        type: file.type
      }));
      
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error('Please enter a title for this checkup');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload files first
      const uploadPromises = files.map(async (fileItem) => {
        const formData = new FormData();
        formData.append('file', fileItem.file);
        formData.append('title', `${formData.title} - ${fileItem.file.name}`);
        formData.append('type', fileItem.file.type);
        formData.append('description', formData.description);
        
        const response = await fetch(`/api/patients/${patientDid}/documents`, {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Failed to upload file');
        }
        
        return response.json();
      });
      
      await Promise.all(uploadPromises);
      
      // Create checkup record
      const checkupResponse = await fetch(`/api/patients/${patientDid}/checkups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          files: files.map(f => ({
            name: f.file.name,
            type: f.file.type,
            size: f.file.size
          }))
        }),
      });
      
      if (!checkupResponse.ok) {
        throw new Error('Failed to save checkup record');
      }
      
      toast.success('Checkup recorded successfully');
      router.push(`/doctor/patient/${patientDid}`);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to record checkup');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Record Patient Checkup</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Checkup Title*</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Annual Physical, Follow-up Visit"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="followUpDate">Follow-up Date (if any)</Label>
              <Input
                type="date"
                id="followUpDate"
                name="followUpDate"
                value={formData.followUpDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Checkup Summary*</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief summary of the checkup..."
              rows={3}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnosis</Label>
            <Textarea
              id="diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleInputChange}
              placeholder="Patient's diagnosis..."
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="prescription">Prescription</Label>
            <Textarea
              id="prescription"
              name="prescription"
              value={formData.prescription}
              onChange={handleInputChange}
              placeholder="Prescribed medications and instructions..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any additional notes or recommendations..."
              rows={2}
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <Label>Attach Files (Max 2MB each)</Label>
              <div className="mt-2 flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Add Files
                </Button>
                <p className="text-sm text-muted-foreground">
                  {files.length} file{files.length !== 1 ? 's' : ''} selected
                </p>
              </div>
              <Input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                onChange={handleFileChange}
                accept="image/*,.pdf"
              />
            </div>
            
            {files.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {files.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="border rounded-md p-3 h-full">
                      {file.type.startsWith('image/') ? (
                        <img
                          src={file.preview}
                          alt={file.file.name}
                          className="w-full h-32 object-cover rounded"
                        />
                      ) : (
                        <div className="bg-muted flex items-center justify-center h-32 rounded">
                          <FileText className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <p className="mt-2 text-sm font-medium truncate">
                        {file.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(file.file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove file</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Checkup'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Upload(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function FileText(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}

function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
