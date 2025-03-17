'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Shield, LogOut, Home, Users, AlertCircle, Calendar, Settings, Wrench, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, userData, loading, logout } = useAuth();
  const router = useRouter();
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (!loading && (!userData || userData.role !== 'admin')) {
      router.push('/portals/admin');
    }

    const handleResize = () => {
      setIsMobileScreen(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [userData, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!userData || userData.role !== 'admin') {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/portals/admin');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {isMobileScreen ? (
            <div className="flex items-center space-x-4">
              <Menu className="h-6 w-6" onClick={() => setShowSidebar(!showSidebar)} />
              <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-xl">My Domain Admin</span>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-xl">My Domain Admin</span>
            </div>
          )}
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={user?.photoURL || undefined} />
              <AvatarFallback>{userData.name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {isMobileScreen && showSidebar ? (
          <>
            <aside className="fixed top-0 left-0 w-[70%] h-full z-50 border-r bg-background">
              <nav className="space-y-1 p-4">
                <Link href="/admin">
                  <Button variant="ghost" className="w-full justify-start">
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/admin/users">
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Users
                  </Button>
                </Link>
                <Link href="/admin/complaints">
                  <Button variant="ghost" className="w-full justify-start">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Complaints
                  </Button>
                </Link>
                <Link href="/admin/sleepover">
                  <Button variant="ghost" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Sleepover Requests
                  </Button>
                </Link>
                <Link href="/admin/maintenance">
                  <Button variant="ghost" className="w-full justify-start">
                    <Wrench className="mr-2 h-4 w-4" />
                    Maintenance
                  </Button>
                </Link>
                <Separator className="my-4" />
                <Link href="/admin/settings">
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </Link>
                <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </nav>
            </aside>
            <div className="fixed top-0 right-0 w-[30%] h-full bg-black/40 z-40" onClick={() => setShowSidebar(false)}></div>
          </>
        ) : (
          !isMobileScreen && (
            <aside className="w-64 border-r bg-background">
              <nav className="space-y-1 p-4">
                <Link href="/admin">
                  <Button variant="ghost" className="w-full justify-start">
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/admin/users">
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Users
                  </Button>
                </Link>
                <Link href="/admin/complaints">
                  <Button variant="ghost" className="w-full justify-start">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Complaints
                  </Button>
                </Link>
                <Link href="/admin/sleepover">
                  <Button variant="ghost" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Sleepover Requests
                  </Button>
                </Link>
                <Link href="/admin/maintenance">
                  <Button variant="ghost" className="w-full justify-start">
                    <Wrench className="mr-2 h-4 w-4" />
                    Maintenance
                  </Button>
                </Link>
                <Separator className="my-4" />
                <Link href="/admin/settings">
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </Link>
              </nav>
            </aside>
          )
        )}
        <main className="flex-1 p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}