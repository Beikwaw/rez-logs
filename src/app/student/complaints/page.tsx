'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

export default function ComplaintsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Complaints</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Complaint
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No complaints found.</p>
        </CardContent>
      </Card>
    </div>
  );
} 