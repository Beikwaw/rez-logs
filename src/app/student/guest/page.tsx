'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

export default function GuestPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Guest Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Register Guest
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Guest Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No guest registrations found.</p>
        </CardContent>
      </Card>
    </div>
  );
} 