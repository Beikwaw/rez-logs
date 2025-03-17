'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllGuestRequests, updateGuestStatus } from '@/lib/firestore';
import { RequestActions } from '@/components/admin/RequestActions';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function GuestPage() {
  const [guestRequests, setGuestRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuestRequests();
  }, []);

  const fetchGuestRequests = async () => {
    try {
      setLoading(true);
      const requests = await getAllGuestRequests();
      setGuestRequests(requests);
    } catch (error) {
      console.error('Error fetching guest requests:', error);
      toast.error('Failed to fetch guest requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string, adminResponse?: string) => {
    try {
      await updateGuestStatus(id, status as any, adminResponse);
      await fetchGuestRequests();
    } catch (error) {
      console.error('Error updating guest status:', error);
      toast.error('Failed to update guest status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Guest Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Requests</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              {guestRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium">Guest Visit Request</h3>
                        <p className="text-sm text-muted-foreground">
                          Guest: {request.guestName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Email: {request.guestEmail}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Date: {request.visitDate}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Time: {request.visitTime}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Purpose: {request.purpose}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Submitted on {format(request.createdAt, 'PPP')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.replace('_', ' ')}
                        </Badge>
                        <RequestActions
                          type="guest"
                          data={request}
                          onStatusUpdate={handleStatusUpdate}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="pending">
              {guestRequests
                .filter((request) => request.status === 'pending')
                .map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium">Guest Visit Request</h3>
                          <p className="text-sm text-muted-foreground">
                            Guest: {request.guestName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Email: {request.guestEmail}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Date: {request.visitDate}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Time: {request.visitTime}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Purpose: {request.purpose}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Submitted on {format(request.createdAt, 'PPP')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(request.status)}>
                            {request.status.replace('_', ' ')}
                          </Badge>
                          <RequestActions
                            type="guest"
                            data={request}
                            onStatusUpdate={handleStatusUpdate}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>
            <TabsContent value="approved">
              {guestRequests
                .filter((request) => request.status === 'approved')
                .map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium">Guest Visit Request</h3>
                          <p className="text-sm text-muted-foreground">
                            Guest: {request.guestName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Email: {request.guestEmail}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Date: {request.visitDate}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Time: {request.visitTime}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Purpose: {request.purpose}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Submitted on {format(request.createdAt, 'PPP')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(request.status)}>
                            {request.status.replace('_', ' ')}
                          </Badge>
                          <RequestActions
                            type="guest"
                            data={request}
                            onStatusUpdate={handleStatusUpdate}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>
            <TabsContent value="rejected">
              {guestRequests
                .filter((request) => request.status === 'rejected')
                .map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium">Guest Visit Request</h3>
                          <p className="text-sm text-muted-foreground">
                            Guest: {request.guestName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Email: {request.guestEmail}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Date: {request.visitDate}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Time: {request.visitTime}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Purpose: {request.purpose}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Submitted on {format(request.createdAt, 'PPP')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(request.status)}>
                            {request.status.replace('_', ' ')}
                          </Badge>
                          <RequestActions
                            type="guest"
                            data={request}
                            onStatusUpdate={handleStatusUpdate}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}