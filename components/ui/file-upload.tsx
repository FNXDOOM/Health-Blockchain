'use client';

import React, { useState, useRef, ChangeEvent, useCallback, useEffect } from 'react';
import { Button } from './button';
import { Label } from './label';
import { Card, CardContent } from './card';
import { Upload, FileText, Loader2, X, CheckCircle2, AlertCircle } from 'lucide-react';

type FileStatus = 'pending' | 'uploading' | 'success' | 'error';

interface FileWithPreview {
  file: File;
  preview: string;
  status: FileStatus;
  error?: string;
}

interface FileUploadProps {
  maxSizeMB?: number;
  accept?: string;
  onUpload?: (files: File[]) => Promise<void>;
  multiple?: boolean;
  label?: string;
  description?: string;
  required?: boolean;
  form?: string;
}

export function FileUpload({
  maxSizeMB = 5,
  accept = 'image/*,.pdf,.doc,.docx',
  onUpload,
  multiple = false,
  label = 'Upload files',
  description = `Max file size: ${maxSizeMB}MB. Accepted formats: ${accept}`,
  required = false,
  form,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      return { 
        valid: false, 
        error: `File size exceeds ${maxSizeMB}MB limit` 
      };
    }
    
    // If accept is set to all files, skip type validation
    if (accept === '*/*') {
      return { valid: true };
    }
    
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
    
    return { valid: true };
  }, [accept, maxSizeMB]);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files).map(file => {
      const validation = validateFile(file);
      return {
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
        status: validation.valid ? 'pending' as const : 'error' as const,
        error: validation.error
      };
    });
    
    setFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);
    
    // Reset the input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [multiple, validateFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }, [isDragging]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    
    const newFiles = Array.from(e.dataTransfer.files).map(file => {
      const validation = validateFile(file);
      return {
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
        status: validation.valid ? 'pending' as const : 'error' as const,
        error: validation.error
      };
    });
    
    setFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);
  }, [multiple, validateFile]);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      const [removed] = newFiles.splice(index, 1);
      
      // Clean up object URL
      if (removed.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      
      return newFiles;
    });
  }, []);

  const handleUpload = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    // If no files and required, show error
    if (files.length === 0) {
      if (required) {
        setFiles([{
          file: new File([], ''),
          preview: '',
          status: 'error',
          error: 'Please select at least one file to upload'
        }]);
      }
      return;
    }
    
    // Filter for valid files
    const validFiles = files.filter(f => f.status === 'pending' || f.status === 'error');
    if (validFiles.length === 0) return;
    
    // Check for any invalid files
    const invalidFiles = validFiles.filter(f => f.status === 'error');
    if (invalidFiles.length > 0) {
      // Update all error files to show their errors
      setFiles(prev => 
        prev.map(f => 
          f.status === 'error' 
            ? { ...f, error: f.error || 'Invalid file. Please check the file requirements.' }
            : f
        )
      );
      return;
    }
    
    // Mark files as uploading
    setFiles(prev => 
      prev.map(f => 
        f.status === 'pending' ? { ...f, status: 'uploading' } : f
      )
    );
    
    setIsUploading(true);
    
    try {
      // Call the upload handler if provided
      if (onUpload) {
        await onUpload(validFiles.map(f => f.file));
      }
      
      // Update status to success
      setFiles(prev =>
        prev.map(f =>
          f.status === 'uploading' 
            ? { ...f, status: 'success' } 
            : f
        )
      );
      
      // If this is part of a form, submit the form
      if (form) {
        const formElement = document.getElementById(form);
        if (formElement && formElement.tagName === 'FORM') {
          (formElement as HTMLFormElement).dispatchEvent(
            new Event('submit', { cancelable: true, bubbles: true })
          );
        }
      }
    } catch (error) {
      // Update status to error
      setFiles(prev =>
        prev.map(f =>
          f.status === 'uploading'
            ? { 
                ...f, 
                status: 'error', 
                error: error instanceof Error ? error.message : 'Upload failed. Please try again.'
              }
            : f
        )
      );
    } finally {
      setIsUploading(false);
    }
  }, [files, onUpload, form, required]);

  const getStatusIcon = useCallback((status: FileWithPreview['status']) => {
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
  }, []);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {label && (
          <div className="flex items-center justify-between">
            <Label>{label}</Label>
            {required && <span className="text-xs text-muted-foreground">Required</span>}
          </div>
        )}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-border/50 hover:border-border hover:bg-muted/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-primary">Click to upload</span> or drag and drop
          </div>
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={accept}
          multiple={multiple}
          aria-label={label || 'File upload'}
          title={label || 'Select files to upload'}
        />
      </div>
      
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {files.length} {files.length === 1 ? 'file' : 'files'} selected
            </span>
            {onUpload && (
              <Button
                type="button"
                size="sm"
                onClick={handleUpload}
                disabled={isUploading || !files.some(f => f.status === 'pending')}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : 'Upload All'}
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            {files.map((file, index) => (
              <div 
                key={`${file.file.name}-${index}`}
                className={`p-3 rounded-lg border ${
                  file.status === 'error' 
                    ? 'bg-destructive/5 border-destructive/30' 
                    : 'bg-background border-border/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt="Preview"
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {file.file.name}
                      </p>
                      <div className="mt-0.5 flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{(file.file.size / 1024).toFixed(1)} KB</span>
                        <span>•</span>
                        <span className="truncate">{file.file.type || 'Unknown type'}</span>
                      </div>
                      {file.error && (
                        <p className="mt-1 text-xs text-destructive">
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
