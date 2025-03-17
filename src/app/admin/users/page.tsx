'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllUsers, processRequest, updateUser, UserData } from '@/lib/firestore';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessApplication = async (userId: string, status: 'accepted' | 'denied') => {
    if (!user) return;
    try {
      setProcessingId(userId);
      const message = `Your application has been ${status}`;
      await processRequest(userId, status, message, user.uid || '');
      toast.success(`Application ${status}`);
      await fetchUsers();
    } catch (error) {
      console.error('Error processing application:', error);
      toast.error('Failed to process application');
    } finally {
      setProcessingId(null);
    }
  };

  const handleToggleAdminRole = async (userId: string, currentRole: string) => {
    try {
      setProcessingId(userId);
      const newRole = currentRole === 'admin' ? 'student' : 'admin';
      await updateUser(userId, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    } finally {
      setProcessingId(null);
    }
  };

  const PendingApplications = () => {
    const pendingUsers = users.filter(user => user.applicationStatus === 'pending');
    
    if (pendingUsers.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No pending applications
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {pendingUsers.map(user => (
          <Card key={user.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-medium">{user.name || user.email}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {user.requestDetails && (
                  <div className="text-sm text-muted-foreground mt-2">
                    <p>Accommodation: {user.requestDetails.accommodationType}</p>
                    <p>Location: {user.requestDetails.location}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={!!processingId}
                  onClick={() => handleProcessApplication(user.id, 'denied')}
                >
                  {processingId === user.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Reject'
                  )}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  disabled={!!processingId}
                  onClick={() => handleProcessApplication(user.id, 'accepted')}
                >
                  {processingId === user.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Approve'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const AllUsers = () => {
    return (
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted">
            <tr>
              <th className="px-6 py-3">Name/Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium">{user.name || 'N/A'}</div>
                    <div className="text-muted-foreground">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant={
                      user.applicationStatus === 'accepted'
                        ? 'default'
                        : user.applicationStatus === 'denied'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {user.applicationStatus || 'N/A'}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!!processingId}
                    onClick={() => handleToggleAdminRole(user.id, user.role)}
                  >
                    {processingId === user.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      `Make ${user.role === 'admin' ? 'Student' : 'Admin'}`
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">Pending Applications</TabsTrigger>
              <TabsTrigger value="all">All Users</TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="mt-4">
              <PendingApplications />
            </TabsContent>
            <TabsContent value="all" className="mt-4">
              <AllUsers />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}