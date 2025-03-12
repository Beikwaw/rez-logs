import Link from 'next/link';
import React from 'react';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Login Page</h1>
      <div className="flex flex-col gap-4 w-full max-w-md">
        <Link 
          href="/admin" 
          className="px-6 py-3 bg-blue-600 text-white rounded-md text-center hover:bg-blue-700 transition-colors"
        >
          Login as Admin
        </Link>
        <Link 
          href="/student" 
          className="px-6 py-3 bg-green-600 text-white rounded-md text-center hover:bg-green-700 transition-colors"
        >
          Login as Student
        </Link>
      </div>
    </div>
  );
}