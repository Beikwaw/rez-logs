"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Home, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { getFirestore, doc, setDoc } from "firebase/firestore"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { app } from "@/lib/firebase"

export default function SignUpPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const auth = getAuth(app)
  const db = getFirestore(app)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    phone: "",
    place_of_study: "",
    room_number: "",
    tenant_code: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    // Email validation
    if (!formData.email.endsWith("@gmail.com")) {
      setError("Please enter a valid Gmail address")
      return false
    }

    // Password validation
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      const user = userCredential.user

      // Create profile in Firestore
      const profileData = {
        id: user.uid,
        email: formData.email,
        full_name: formData.full_name,
        phone: formData.phone,
        place_of_study: formData.place_of_study,
        room_number: formData.room_number,
        tenant_code: formData.tenant_code,
        role: "new-student", // Default role
        status: "pending", // Default status
      }

      await setDoc(doc(db, "users", user.uid), profileData)

      setSuccess(true)
      toast.success("Account created successfully. You can now log in with your credentials")

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/portals/student")
      }, 3000)
    } catch (error: any) {
      console.error("Signup error:", error)
      setError(error.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

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
                <CardTitle className="text-2xl">Account Created!</CardTitle>
                <CardDescription>
                  Your account has been created successfully. You will be redirected to the login page shortly.
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center">
                <Link href="/login">
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
                    <Label htmlFor="email">Gmail Account</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.name@gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      placeholder="John Doe"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                    />
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
                    />
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
                    />
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
                    />
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
                    />
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
                    />
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
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating Account..." : "Sign Up"}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </p>
                </CardFooter>
              </form>
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
  )
}