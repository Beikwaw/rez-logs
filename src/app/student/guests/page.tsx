'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { GuestRegistrationForm } from '@/components/forms/GuestRegistrationForm';
import { useAuth } from '@/context/AuthContext';
import { getGuestRegistrations, type GuestRegistration } from '@/lib/firestore';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function GuestsPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [registrations, setRegistrations] = useState<GuestRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = async () => {
    if (!user) return;
    try {
      const userRegistrations = await getGuestRegistrations(user.uid);
      setRegistrations(userRegistrations);
    } catch (error) {
      console.error('Error fetching guest registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [user]);

  const handleSuccess = () => {
    setShowForm(false);
    fetchRegistrations();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Guest Registrations</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Register Guest
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Register New Guest</CardTitle>
          </CardHeader>
          <CardContent>
            <GuestRegistrationForm
              userId={user?.uid || ''}
              onSuccess={handleSuccess}
              onCancel={() => setShowForm(false)}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Guest Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading registrations...</p>
          ) : registrations.length === 0 ? (
            <p className="text-muted-foreground">No guest registrations found.</p>
          ) : (
            <div className="space-y-4">
              {registrations.map((registration) => (
                <div
                  key={registration.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{registration.guestName}</p>
                    <p className="text-sm text-muted-foreground">{registration.guestEmail}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        registration.status === 'approved' ? 'default' :
                        registration.status === 'pending' ? 'secondary' :
                        'destructive'
                      }>
                        {registration.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(registration.visitDate, 'MMM d, yyyy')} at {registration.visitTime}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(registration.createdAt, 'MMM d, yyyy')}
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