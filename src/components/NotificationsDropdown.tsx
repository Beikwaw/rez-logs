'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle,
  Calendar,
  Tool,
  MessageCircle,
  UserPlus,
  X
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/context/AuthContext';
import { 
  getMaintenanceRequests, 
  getComplaints, 
  getSleepoverRequests,
  getGuestRegistrations,
  type MaintenanceRequest,
  type Complaint,
  type SleepoverRequest,
  type GuestRegistration
} from '@/lib/firestore';
import { format } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  type: 'maintenance' | 'complaint' | 'sleepover' | 'guest' | 'message';
  read: boolean;
}

export function NotificationsDropdown() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const [maintenance, complaints, sleepovers, guests] = await Promise.all([
        getMaintenanceRequests(),
        getComplaints(),
        getSleepoverRequests(),
        getGuestRegistrations()
      ]);

      const allNotifications: Notification[] = [
        ...maintenance
          .filter(req => req.userId === user.uid && req.status !== 'pending')
          .map(req => ({
            id: req.id,
            title: 'Maintenance Request Update',
            message: `Your maintenance request "${req.title}" has been ${req.status}`,
            timestamp: req.updatedAt,
            type: 'maintenance' as const,
            read: false
          })),
        ...complaints
          .filter(comp => comp.userId === user.uid && comp.status !== 'pending')
          .map(comp => ({
            id: comp.id,
            title: 'Complaint Update',
            message: `Your complaint "${comp.title}" has been ${comp.status}`,
            timestamp: comp.updatedAt,
            type: 'complaint' as const,
            read: false
          })),
        ...sleepovers
          .filter(sleep => sleep.userId === user.uid && sleep.status !== 'pending')
          .map(sleep => ({
            id: sleep.id,
            title: 'Sleepover Request Update',
            message: `Your sleepover request for ${sleep.guestName} has been ${sleep.status}`,
            timestamp: sleep.updatedAt,
            type: 'sleepover' as const,
            read: false
          })),
        ...guests
          .filter(guest => guest.userId === user.uid && guest.status !== 'pending')
          .map(guest => ({
            id: guest.id,
            title: 'Guest Registration Update',
            message: `Guest registration for ${guest.guestName} has been ${guest.status}`,
            timestamp: guest.updatedAt,
            type: 'guest' as const,
            read: false
          }))
      ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setNotifications(allNotifications);
      setUnreadCount(allNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Set up polling every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'maintenance':
        return <Tool className="h-4 w-4" />;
      case 'complaint':
        return <MessageCircle className="h-4 w-4" />;
      case 'sleepover':
        return <Calendar className="h-4 w-4" />;
      case 'guest':
        return <UserPlus className="h-4 w-4" />;
      case 'message':
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h4 className="font-semibold">Notifications</h4>
          {notifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                setUnreadCount(0);
              }}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
              <CheckCircle className="h-8 w-8 mb-2" />
              <p>All caught up!</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 flex gap-3 items-start hover:bg-muted/50 relative ${
                    !notification.read ? 'bg-muted/30' : ''
                  }`}
                >
                  <div className="mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(notification.timestamp, 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
} 