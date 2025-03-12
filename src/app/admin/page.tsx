'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  UserData, 
  getPendingApplications, 
  processRequest,
  getComplaints,
  getSleepoverRequests,
  getMaintenanceRequests,
  Complaint,
  SleepoverRequest,
  MaintenanceRequest
} from '../../lib/firestore';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, AlertCircle, Calendar, Wrench, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [pendingApplications, setPendingApplications] = useState<UserData[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [sleepoverRequests, setSleepoverRequests] = useState<SleepoverRequest[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [applications, complaintsData, sleepoverData, maintenanceData] = await Promise.all([
          getPendingApplications(),
          getComplaints(),
          getSleepoverRequests(),
          getMaintenanceRequests()
        ]);
        
        setPendingApplications(applications);
        setComplaints(complaintsData);
        setSleepoverRequests(sleepoverData);
        setMaintenanceRequests(maintenanceData);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProcessApplication = async (
    userId: string,
    status: 'accepted' | 'denied',
    message: string
  ) => {
    try {
      await processRequest(userId, status, message, user?.uid || '');
      setPendingApplications(prev => prev.filter(app => app.id !== userId));
    } catch (err) {
      setError('Failed to process application');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  const pendingComplaints = complaints.filter(c => c.status === 'pending').length;
  const pendingSleepovers = sleepoverRequests.filter(r => r.status === 'pending').length;
  const pendingMaintenance = maintenanceRequests.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Applications
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApplications.length}</div>
            <p className="text-xs text-muted-foreground">
              New student applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Complaints
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingComplaints}</div>
            <p className="text-xs text-muted-foreground">
              {complaints.length} total complaints
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Sleepovers
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingSleepovers}</div>
            <p className="text-xs text-muted-foreground">
              {sleepoverRequests.length} total requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Maintenance Tasks
            </CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingMaintenance}</div>
            <p className="text-xs text-muted-foreground">
              {maintenanceRequests.length} total tasks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingApplications.slice(0, 3).map(app => (
              <div key={app.id} className="flex items-center space-x-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">New application from {app.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Submitted {format(app.createdAt, 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            ))}
            {sleepoverRequests.slice(0, 3).map(req => (
              <div key={req.id} className="flex items-center space-x-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Sleepover request for {req.guestName}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(req.startDate, 'MMM d')} - {format(req.endDate, 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            ))}
            {complaints.slice(0, 3).map(complaint => (
              <div key={complaint.id} className="flex items-center space-x-4">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{complaint.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Submitted {format(complaint.createdAt, 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            ))}
            {maintenanceRequests.slice(0, 3).map(req => (
              <div key={req.id} className="flex items-center space-x-4">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Wrench className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{req.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Priority: {req.priority}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 