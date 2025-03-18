'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { NotificationsDropdown } from './NotificationsDropdown';
import { ChatDialog } from './ChatDialog';
import { UserPlus, Calendar, Wrench, AlertCircle } from 'lucide-react';

const links = [
  { 
    href: '/student/daily-guest-sign-in', 
    label: 'Daily Guest Sign-In',
    icon: UserPlus 
  },
  { 
    href: '/student/sleepover-request', 
    label: 'Sleepover Request',
    icon: Calendar 
  },
  { 
    href: '/student/maintenance', 
    label: 'Maintenance',
    icon: Wrench 
  },
  { 
    href: '/student/complaints', 
    label: 'Complaints',
    icon: AlertCircle 
  },
];

export function StudentNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center text-sm font-medium transition-colors hover:text-primary',
              pathname === link.href
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <Icon className="h-4 w-4 mr-2" />
            {link.label}
          </Link>
        );
      })}
      <div className="flex items-center space-x-2 ml-auto">
        <NotificationsDropdown />
        <ChatDialog />
      </div>
    </nav>
  );
}