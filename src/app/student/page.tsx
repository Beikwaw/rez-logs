'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, MessageSquare, Settings, Calendar, Bell } from 'lucide-react';

export default function DashboardPage() {
  const { userData } = useAuth();

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {/* Welcome Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Welcome back, {userData.name}</CardTitle>
              <CardDescription>
                Manage your accommodation and services here
              </CardDescription>
            </div>
            <Badge variant={userData.role === 'admin' ? "default" : "secondary"}>
              {userData.role === 'admin' ? 'Admin' : 'Student'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rent Due
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15 Days</div>
            <p className="text-xs text-muted-foreground">
              Next payment: $750
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Maintenance Requests
            </CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              1 in progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Messages
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              2 unread
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Notifications
            </CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              3 new today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Application Status */}
      <Card>
        <CardHeader>
          <CardTitle>Application Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userData.requestDetails && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">Accommodation Type</p>
                    <p className="text-lg">{userData.requestDetails.accommodationType}</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">Location</p>
                    <p className="text-lg">{userData.requestDetails.location}</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">Date Submitted</p>
                    <p className="text-lg">{userData.requestDetails.dateSubmitted.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">Status</p>
                    <Badge variant={userData.applicationStatus === 'accepted' ? "default" : "secondary"} className="mt-1">
                      {userData.applicationStatus === 'accepted' ? 'Approved' : userData.applicationStatus === 'denied' ? 'Denied' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">My Accommodation</h3>
                <p className="text-sm text-muted-foreground">View your living arrangements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Support</h3>
                <p className="text-sm text-muted-foreground">Get help and support</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Settings</h3>
                <p className="text-sm text-muted-foreground">Configure your preferences</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 