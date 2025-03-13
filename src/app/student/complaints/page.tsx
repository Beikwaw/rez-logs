'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { ComplaintForm } from '@/components/forms/ComplaintForm';
import { useAuth } from '@/context/AuthContext';
import { getComplaints, type Complaint } from '@/lib/firestore';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function ComplaintsPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    if (!user) return;
    try {
      const allComplaints = await getComplaints();
      const userComplaints = allComplaints.filter(complaint => complaint.userId === user.uid);
      setComplaints(userComplaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [user]);

  const handleSuccess = () => {
    setShowForm(false);
    fetchComplaints();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Complaints</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Complaint
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Complaint</CardTitle>
          </CardHeader>
          <CardContent>
            <ComplaintForm
              userId={user?.uid || ''}
              onSuccess={handleSuccess}
              onCancel={() => setShowForm(false)}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading complaints...</p>
          ) : complaints.length === 0 ? (
            <p className="text-muted-foreground">No complaints found.</p>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{complaint.title}</p>
                    <p className="text-sm text-muted-foreground">{complaint.description}</p>
                    <Badge variant={
                      complaint.status === 'resolved' ? 'default' :
                      complaint.status === 'in_progress' ? 'secondary' :
                      'outline'
                    }>
                      {complaint.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(complaint.createdAt, 'MMM d, yyyy')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 