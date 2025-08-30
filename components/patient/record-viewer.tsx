'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Record {
  id: string;
  name: string;
  date: string;
  type: string;
}

export default function RecordViewer() {
  const [records, setRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching records
    const fetchRecords = async () => {
      try {
        // TODO: Replace with actual API call
        const mockRecords: Record[] = [
          { id: '1', name: 'Medical Report - 2023', date: '2023-10-15', type: 'report' },
          { id: '2', name: 'Lab Results - Blood Test', date: '2023-09-20', type: 'lab' },
          { id: '3', name: 'Prescription - Dr. Smith', date: '2023-08-05', type: 'prescription' },
        ];
        
        setRecords(mockRecords);
      } catch (error) {
        console.error('Error fetching records:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading records...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Medical Records</CardTitle>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <p className="text-muted-foreground">No records found.</p>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{record.name}</h3>
                  <p className="text-sm text-muted-foreground">{record.date}</p>
                </div>
                <Badge variant="outline" className="capitalize">
                  {record.type}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
