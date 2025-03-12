'use client';

export const dynamic = 'force-dynamic'

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, UserCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-xl">My Domain Student Living</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Welcome to My Domain</h1>
            <p className="text-xl text-muted-foreground">Choose your portal to continue</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">Student Portal</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <UserCircle className="h-12 w-12 text-primary" />
                </div>
                <p className="text-center text-muted-foreground">
                  Access your student dashboard, submit requests, and manage your accommodation
                </p>
                <Link href="/login" className="w-full">
                  <Button size="lg" className="w-full">
                    Login as Student
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">Admin Portal</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Shield className="h-12 w-12 text-primary" />
                </div>
                <p className="text-center text-muted-foreground">
                  Manage users, handle requests, and oversee the student living facility
                </p>
                <Link href="/admin/login" className="w-full">
                  <Button size="lg" className="w-full">
                    Login as Admin
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 bg-secondary text-white">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose md:text-left">
            © 2025 My Domain Student Living. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm hover:underline">
              Privacy
            </Link>
            <Link href="#" className="text-sm hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 