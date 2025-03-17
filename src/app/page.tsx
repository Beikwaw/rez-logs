'use client';

export const dynamic = 'force-dynamic'

import React from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, UserCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[url(../assets/bgmain.jpg)]  bg-cover bg-center  ">
      <header className="sticky px-5 top-0 z-50 w-full border-b bg-black  backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container flex h-16 items-center ">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-xl text-white">My Domain Student Living</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center bg-black/40 h-full w-full flex-col">


        <div className="w-full max-w-4xl pt-4">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-6xl text-white font-bold  p-2">Welcome to My Domain</h1>
            <p className="text-xl text-muted-foreground">Choose your portal to continue</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pb-4">
            <Card className="hover:shadow-lg transition-shadow mx-5 md:mx-0">
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
                <Link href="/portals/student" className="w-full">
                  <Button size="lg" className="w-full">
                    Login as Student
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow mx-5 md:mx-0">
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
                <Link href="/portals/admin" className="w-full">
                  <Button size="lg" className="w-full">
                    Login as Admin
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t py-2 bg-secondary text-black px-5 flex items-center justify-center">
        <div className="container  w-full flex flex-col items-center justify-between gap-4  md:flex-row">
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