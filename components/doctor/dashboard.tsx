'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUp, Activity, Clock, Stethoscope, Building2 } from 'lucide-react';
import { Doctor } from '@/types/doctor';

export function DoctorDashboard({ doctor }: { doctor: Doctor }) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [activity, setActivity] = useState({
    lastActive: new Date(doctor.lastActive || new Date()).toLocaleString(),
    documentCount: 0,
    recentActivity: []
  });

  useEffect(() => {
    // Fetch initial data
    const fetchData = async () => {
      try {
        const [docsRes, activityRes] = await Promise.all([
          fetch(`/api/doctor/documents?doctorId=${doctor.id}`),
          fetch(`/api/doctor/activity?doctorId=${doctor.id}`)
        ]);
        
        if (docsRes.ok) {
          const docs = await docsRes.json();
          setDocuments(docs);
        }
        
        if (activityRes.ok) {
          const activityData = await activityRes.json();
          setActivity(prev => ({
            ...prev,
            ...activityData,
            lastActive: new Date(activityData.lastActive).toLocaleString()
          }));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
    
    // Set up real-time updates
    const eventSource = new EventSource(`/api/doctor/updates?doctorId=${doctor.id}`);
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'DOCUMENT_UPLOADED') {
        setDocuments(prev => [data.payload, ...prev]);
      } else if (data.type === 'ACTIVITY_UPDATE') {
        setActivity(prev => ({
          ...prev,
          lastActive: new Date(data.payload.timestamp).toLocaleString(),
          documentCount: data.payload.documentCount || prev.documentCount
        }));
      }
    };

    return () => {
      eventSource.close();
    };
  }, [doctor.id]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('doctorId', doctor.id);
      formData.append('documentType', 'medical_report');

      const response = await fetch('/api/doctor/documents', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // The real update will come through the WebSocket
    } catch (error) {
      console.error('Upload error:', error);
      // Handle error (e.g., show toast)
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Specialization</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doctor.specialization || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">
              {doctor.hospital}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Active</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(doctor.lastActive || new Date()).toLocaleTimeString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(doctor.lastActive || new Date()).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activity.documentCount}</div>
            <p className="text-xs text-muted-foreground">
              {documents.length} in current session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">License</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doctor.licenseNumber}</div>
            <p className="text-xs text-muted-foreground">
              {doctor.did}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload New Document</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="document-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/70 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileUp className="w-8 h-8 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, DOCX, JPG, or PNG (MAX. 10MB)
                  </p>
                </div>
                <input
                  id="document-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  disabled={isUploading}
                />
              </label>
            </div>
            {isUploading && (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Uploading document...
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="outline" size="sm" onClick={() => router.push('/doctor/activity')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activity.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {activity.recentActivity.map((item: any, index: number) => (
                  <div key={index} className="flex items-start pb-4 last:pb-0 border-b last:border-0">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {item.type === 'UPLOAD' ? (
                        <FileUp className="h-4 w-4 text-primary" />
                      ) : (
                        <Activity className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="ml-3 space-y-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
