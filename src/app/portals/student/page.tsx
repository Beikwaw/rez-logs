'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { UserCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default function StudentPortalPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password, 'student', rememberMe);
      toast.success('Login successful');
      router.push('/student');
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error && error.message === 'Invalid user type') {
        toast.error('This account does not have student privileges');
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage('Password reset email sent!');
    } catch (error) {
      if (error instanceof Error) {
        setResetMessage(`Error: ${error.message}`);
      } else {
        setResetMessage('An unknown error occurred');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Link href="/portals" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to portals
        </Link>
        
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="bg-green-600 p-2 rounded-full">
                <UserCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Student Portal</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your student dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="student@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline"
                    onClick={() => setShowResetPassword(true)}
                  >
                    Forgot password?
                  </button>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked: boolean) => setRememberMe(checked)}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </Label>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700" 
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-2">
            <div className="text-sm text-gray-500">
              Don't have an account?
            </div>
            <div className="text-sm">
              <Link href="/register" className="text-green-600 hover:underline">
                Register for student accommodation
              </Link>
            </div>
          </CardFooter>
        </Card>

        {showResetPassword && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl mb-4 text-center">Forgot Password?</h2>
              <form onSubmit={handlePasswordReset} className="flex flex-col items-center space-y-4">
                <Input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="p-2 border rounded"
                  required
                />
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  Reset Password
                </Button>
              </form>
              {resetMessage && <p className="mt-4 text-center">{resetMessage}</p>}
              <Button
                type="button"
                className="mt-4 w-full bg-gray-600 hover:bg-gray-700"
                onClick={() => setShowResetPassword(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}