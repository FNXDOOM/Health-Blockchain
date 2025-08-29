'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Card, CardContent } from './card';
import { Upload, FileText, Loader2, X, CheckCircle2, AlertCircle } from 'lucide-react';

type FileStatus = 'pending' | 'uploading' | 'success' | 'error';

type FileWithPreview = {
  file: File;
  preview: string;
  status: FileStatus;
  error?: string;
};

type FileUploadProps = {
  maxSizeMB?: number;
  accept?: string;
  onUpload?: (files: File[]) => Promise<void>;
  multiple?: boolean;
  label?: string;
  description?: string;
};

export function FileUpload({
  maxSizeMB = 5,
  accept = 'image/*,.pdf,.doc,.docx',
  onUpload,
  multiple = false,
  label = 'Upload files',
  description = `Max file size: ${maxSizeMB}MB. Accepted formats: ${accept}`,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      return { 
        valid: false, 
        error: `File size exceeds ${maxSizeMB}MB limit` 
      };
    }
    
    if (accept !== '*/*') {
      const acceptedTypes = accept.split(',').map(type => type.trim().toLowerCase());
      const fileType = file.type.toLowerCase();
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      const isAccepted = acceptedTypes.some(type => {
        // Handle wildcard types like 'image/*'
        if (type.endsWith('/*')) {
          return fileType.startsWith(type.split('/*')[0]);
        }
        // Handle specific types and extensions
        return fileType === type || 
               (fileExtension && type.startsWith('.') && type === fileExtension) ||
               type === fileType;
      });
      
      if (!isAccepted) {
        return { 
          valid: false, 
          error: `File type not allowed. Accepted types: ${accept}` 
        };
      }
    }
    
    return { valid: true };
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => {
        const validation = validateFile(file);
        return {
          file,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
          status: validation.valid ? 'pending' as const : 'error' as const,
          error: validation.error
        };
      });
      
      if (!multiple) {
        setFiles(newFiles);
      } else {
        setFiles(prev => [...prev, ...newFiles]);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map(file => {
        const validation = validateFile(file);
        return {
          file,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
          status: validation.valid ? 'pending' as const : 'error' as const,
          error: validation.error
        };
      });
      
      if (!multiple) {
        setFiles(newFiles);
      } else {
        setFiles(prev => [...prev, ...newFiles]);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      const removed = newFiles.splice(index, 1);
      // Clean up object URLs to prevent memory leaks
      removed.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0 || !onUpload) return;
    
    const validFiles = files.filter(f => f.status === 'pending' || f.status === 'error');
    if (validFiles.length === 0) return;
    
    // Update status to uploading
    setFiles(prev => 
      prev.map(f => (f.status === 'pending' ? { ...f, status: 'uploading' } : f))
    );
    
    setIsUploading(true);
    
    try {
      // Call the upload handler with all files
      await onUpload(validFiles.map(f => f.file));
      
      // Update status to success
      setFiles(prev =>
        prev.map(f =>
          f.status === 'uploading' ? { ...f, status: 'success' } : f
        )
      );
      
    } catch (error) {
      // Update status to error
      setFiles(prev =>
        prev.map(f =>
          f.status === 'uploading'
            ? { ...f, status: 'error', error: 'Upload failed' }
            : f
        )
      );
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status: FileWithPreview['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {label && <Label>{label}</Label>}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/10' : 'border-border'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-primary">Click to upload</span> or
            drag and drop
          </div>
          <p className="text-xs text-muted-foreground">
            {accept !== '*/*' ? `Supported formats: ${accept}` : 'Any file type'}
          </p>
        </div>
        <input
          id="file-upload"
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={accept}
          multiple={multiple}
          aria-label="Select files to upload"
          title="Select files to upload"
        />
        <label 
          htmlFor="file-upload" 
          className="sr-only"
        >
          Select files to upload
        </label>
      </div>
      
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {files.length} {files.length === 1 ? 'file' : 'files'} selected
            </span>
            {onUpload && (
              <Button
                type="button"
                size="sm"
                onClick={handleUpload}
                disabled={isUploading || files.every(f => f.status !== 'pending')}
              >
                {isUploading ? 'Uploading...' : 'Upload All'}
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            {files.map((file, index) => (
              <Card key={`${file.file.name}-${index}`} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {file.preview ? (
                          <img
                            src={file.preview}
                            alt=""
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {file.file.name}
                        </p>
                        <div className="mt-0.5 flex items-center space-x-1 text-xs text-muted-foreground">
                          <span>{(file.file.size / 1024).toFixed(1)} KB</span>
                          <span>•</span>
                          <span>{file.file.type || 'Unknown type'}</span>
                        </div>
                        {file.error && (
                          <p className="mt-1 text-xs text-red-500">
                            {file.error}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(file.status)}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove file</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
