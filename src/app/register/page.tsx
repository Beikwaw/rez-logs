"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { app } from "@/lib/firebase";
import { createUser } from "@/lib/firestore";
import { toast as sonnerToast } from "sonner";

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth(app);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    surname: "",
    phone: "",
    place_of_study: "",
    room_number: "",
    tenant_code: "",
  });

  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [errorField, setErrorField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev: typeof fieldErrors) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    let hasError = false;

    // Email validation
    if (!formData.email.includes("@")) {
      errors.email = "Please enter a valid email address";
      hasError = true;
    }

    // Password validation
    if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      hasError = true;
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      hasError = true;
    }

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "First name is required";
      hasError = true;
    }

    // Surname validation
    if (!formData.surname.trim()) {
      errors.surname = "Last name is required";
      hasError = true;
    }

    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
      hasError = true;
    }

    // Place of study validation
    if (!formData.place_of_study.trim()) {
      errors.place_of_study = "Place of study is required";
      hasError = true;
    }

    // Room number validation
    if (!formData.room_number.trim()) {
      errors.room_number = "Room number is required";
      hasError = true;
    }

    // Tenant code validation
    if (!formData.tenant_code.trim()) {
      errors.tenant_code = "Tenant code is required";
      hasError = true;
    }

    setFieldErrors(errors);

    if (hasError) {
      // Find the first field with an error
      const firstErrorField = Object.keys(errors)[0];
      setErrorField(firstErrorField);
      // Focus the first error field
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.focus();
      }
    }

    return !hasError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});
    setErrorField(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Create profile in Firestore using our function
      await createUser({
        id: user.uid,
        email: formData.email,
        name: formData.name,
        surname: formData.surname,
        phone: formData.phone,
        place_of_study: formData.place_of_study,
        room_number: formData.room_number,
        tenant_code: formData.tenant_code,
        role: "newbie",
        applicationStatus: "pending",
      });

      setSuccess(true);
      sonnerToast.success(
        `Thank you for successfully signing up, ${formData.name}! Your account is being reviewed by management and will be approved within 48 hours. Kindly contact management if it is not resolved within 48 hours.`,
        {
          duration: 5000,
        }
      );

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/portals/student");
      }, 3000);
    } catch (error: any) {
      console.error("Signup error:", error);
      setError(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center">
                <Home className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-xl">My Domain Student Living</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12 bg-muted">
        <div className="container px-4 md:px-6">
          {success ? (
            <Card className="max-w-md mx-auto">
              <CardHeader className="text-center">
                <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4 animate-pulse-slow">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Registration Successful!</CardTitle>
                <CardDescription>
                  Your registration has been submitted and is pending approval by an administrator.
                  You can log in now to check your application status.
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center">
                <Link href="/portals/student">
                  <Button className="bg-primary hover:bg-primary/90">Go to Login</Button>
                </Link>
              </CardFooter>
            </Card>
          ) : (
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Create an Account</CardTitle>
                <CardDescription>Fill in your details to sign up for My Domain Student Living.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={fieldErrors.email ? "border-red-500" : ""}
                    />
                    {fieldErrors.email && (
                      <p className="text-sm text-red-500">{fieldErrors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">First Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={fieldErrors.name ? "border-red-500" : ""}
                    />
                    {fieldErrors.name && (
                      <p className="text-sm text-red-500">{fieldErrors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="surname">Last Name</Label>
                    <Input
                      id="surname"
                      name="surname"
                      value={formData.surname}
                      onChange={handleChange}
                      required
                      className={fieldErrors.surname ? "border-red-500" : ""}
                    />
                    {fieldErrors.surname && (
                      <p className="text-sm text-red-500">{fieldErrors.surname}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={fieldErrors.password ? "border-red-500" : ""}
                    />
                    {fieldErrors.password && (
                      <p className="text-sm text-red-500">{fieldErrors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className={fieldErrors.confirmPassword ? "border-red-500" : ""}
                    />
                    {fieldErrors.confirmPassword && (
                      <p className="text-sm text-red-500">{fieldErrors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(123) 456-7890"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className={fieldErrors.phone ? "border-red-500" : ""}
                    />
                    {fieldErrors.phone && (
                      <p className="text-sm text-red-500">{fieldErrors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="place_of_study">Place of Study</Label>
                    <Input
                      id="place_of_study"
                      name="place_of_study"
                      placeholder="University/College Name"
                      value={formData.place_of_study}
                      onChange={handleChange}
                      required
                      className={fieldErrors.place_of_study ? "border-red-500" : ""}
                    />
                    {fieldErrors.place_of_study && (
                      <p className="text-sm text-red-500">{fieldErrors.place_of_study}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="room_number">Room Number</Label>
                    <Input
                      id="room_number"
                      name="room_number"
                      placeholder="e.g., A-101"
                      value={formData.room_number}
                      onChange={handleChange}
                      required
                      className={fieldErrors.room_number ? "border-red-500" : ""}
                    />
                    {fieldErrors.room_number && (
                      <p className="text-sm text-red-500">{fieldErrors.room_number}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tenant_code">Tenant Code</Label>
                    <Input
                      id="tenant_code"
                      name="tenant_code"
                      placeholder="Your assigned tenant code"
                      value={formData.tenant_code}
                      onChange={handleChange}
                      required
                      className={fieldErrors.tenant_code ? "border-red-500" : ""}
                    />
                    {fieldErrors.tenant_code && (
                      <p className="text-sm text-red-500">{fieldErrors.tenant_code}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                  </Button>
                </CardFooter>
              </form>
              <CardFooter className="flex justify-center border-t pt-4 text-sm">
                Already have an account?{" "}
                <Link href="/portals/student" className="ml-1 text-primary hover:underline">
                  Log in
                </Link>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>

      <footer className="border-t py-6 md:py-0 bg-secondary text-white">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose md:text-left">
            © 2025 My Domain Student Living. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}