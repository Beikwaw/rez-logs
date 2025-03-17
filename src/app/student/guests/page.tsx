"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { UserPlus, Clock, X, Check, Plus, Trash } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface GuestData {
  id: string
  name: string
  phoneNumber: string
  roomNumber: string
  purpose: string
  fromDate: string
  tillDate: string
  checkInTime: string
  date: string
}

export default function GuestRegistrationPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [activeGuests, setActiveGuests] = useState<GuestData[]>([])
  const [multipleGuests, setMultipleGuests] = useState<"yes" | "no">("no")
  const [additionalGuests, setAdditionalGuests] = useState<{ phoneNumber: string }[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [currentGuest, setCurrentGuest] = useState<GuestData | null>(null)

  const handleMultipleGuestsChange = (value: "yes" | "no") => {
    setMultipleGuests(value)
    if (value === "no") {
      setAdditionalGuests([])
    }
  }

  const addAdditionalGuest = () => {
    if (additionalGuests.length < 2) {
      // Max 2 additional guests (3 total)
      setAdditionalGuests([...additionalGuests, { phoneNumber: "" }])
    } else {
      toast.error("Maximum of 3 guests allowed.")
    }
  }

  const removeAdditionalGuest = (index: number) => {
    const newGuests = [...additionalGuests]
    newGuests.splice(index, 1)
    setAdditionalGuests(newGuests)
  }

  const updateAdditionalGuestPhone = (index: number, phoneNumber: string) => {
    const newGuests = [...additionalGuests]
    newGuests[index].phoneNumber = phoneNumber
    setAdditionalGuests(newGuests)
  }

  const handleRegisterGuest = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Get form data
    const formData = new FormData(e.target as HTMLFormElement)
    const guestName = formData.get("guestName") as string
    const guestPhoneNumber = formData.get("guestPhoneNumber") as string
    const roomNumber = formData.get("roomNumber") as string
    const purpose = formData.get("purpose") as string
    const fromDate = formData.get("fromDate") as string
    const tillDate = formData.get("tillDate") as string

    // Create main guest
    const newGuest: GuestData = {
      id: Date.now().toString(),
      name: guestName,
      phoneNumber: guestPhoneNumber,
      roomNumber: roomNumber,
      purpose: purpose,
      fromDate: fromDate,
      tillDate: tillDate,
      checkInTime: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }

    // Set current guest for confirmation popup
    setCurrentGuest(newGuest)
    setShowConfirmation(true)
    setLoading(false)
  }

  const confirmGuest = () => {
    if (currentGuest) {
      // Add main guest
      setActiveGuests([...activeGuests, currentGuest])

      // Add additional guests if any
      if (multipleGuests === "yes" && additionalGuests.length > 0) {
        const additionalGuestsData = additionalGuests.map((guest, index) => ({
          id: `${Date.now()}-${index + 1}`,
          name: `Additional Guest ${index + 1}`,
          phoneNumber: guest.phoneNumber,
          roomNumber: currentGuest.roomNumber,
          purpose: currentGuest.purpose,
          fromDate: currentGuest.fromDate,
          tillDate: currentGuest.tillDate,
          checkInTime: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        }))

        setActiveGuests((prev) => [...prev, ...additionalGuestsData])
      }

      // Reset form and state
      const form = document.getElementById("guestForm") as HTMLFormElement
      if (form) form.reset()

      setMultipleGuests("no")
      setAdditionalGuests([])
      setCurrentGuest(null)
      setShowConfirmation(false)

      toast.success("Guest registered successfully")
    }
  }

  const handleCheckoutGuest = (guestId: string) => {
    setActiveGuests(activeGuests.filter((guest) => guest.id !== guestId))

    toast.success("Your guest has been checked out successfully.")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Guest Registration</h1>
        <p className="text-white">Register visitors and manage your active guests.</p>
      </div>

      <Tabs defaultValue="register">
        <TabsList className="grid w-full grid-cols-2 bg-white">
          <TabsTrigger value="register" className="text-black">
            Register Guest
          </TabsTrigger>
          <TabsTrigger value="active" className="text-black">
            Active Guests ({activeGuests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="register" className="mt-4">
          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Register a New Guest</CardTitle>
                  <CardDescription>Fill in the details to register a visitor for today.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <form id="guestForm" onSubmit={handleRegisterGuest}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="guestName" className="text-black">
                    Guest Full Name
                  </Label>
                  <Input
                    id="guestName"
                    name="guestName"
                    placeholder="Enter guest's full name"
                    required
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guestPhoneNumber" className="text-black">
                    Guest Phone Number
                  </Label>
                  <Input
                    id="guestPhoneNumber"
                    name="guestPhoneNumber"
                    placeholder="Enter guest's phone number"
                    required
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roomNumber" className="text-black">
                    Room Number
                  </Label>
                  <Input
                    id="roomNumber"
                    name="roomNumber"
                    placeholder="Enter room number"
                    required
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose" className="text-black">
                    Purpose of Visit
                  </Label>
                  <Input
                    id="purpose"
                    name="purpose"
                    placeholder="e.g., Study session, Social visit"
                    required
                    className="bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromDate" className="text-black">
                      From Date
                    </Label>
                    <Input id="fromDate" name="fromDate" type="date" required className="bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tillDate" className="text-black">
                      Till Date
                    </Label>
                    <Input id="tillDate" name="tillDate" type="date" required className="bg-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-black">Would you like to sign in more than one guest?</Label>
                  <RadioGroup
                    value={multipleGuests}
                    onValueChange={(value) => handleMultipleGuestsChange(value as "yes" | "no")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes" className="text-black">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no" className="text-black">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {multipleGuests === "yes" && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-black">Additional Guests</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addAdditionalGuest}
                        disabled={additionalGuests.length >= 2}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Guest
                      </Button>
                    </div>

                    {additionalGuests.map((guest, index) => (
                      <div key={index} className="flex items-end gap-2">
                        <div className="flex-1 space-y-2">
                          <Label htmlFor={`additionalPhone${index}`} className="text-black">
                            Guest {index + 2} Phone Number
                          </Label>
                          <Input
                            id={`additionalPhone${index}`}
                            value={guest.phoneNumber}
                            onChange={(e) => updateAdditionalGuestPhone(index, e.target.value)}
                            placeholder="Enter phone number"
                            required
                            className="bg-white"
                          />
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeAdditionalGuest(index)}>
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="rounded-md bg-muted p-3">
                  <h4 className="mb-2 text-sm font-medium text-black">Guest Policy Reminder</h4>
                  <ul className="text-xs text-black space-y-1">
                    <li>• Guests must leave by 10:00 PM unless a sleepover is approved</li>
                    <li>• You are responsible for your guest's behavior</li>
                    <li>• Guests must be accompanied by you at all times</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Registering..." : "Register Guest"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Active Guests</CardTitle>
              <CardDescription>Currently registered visitors in the building.</CardDescription>
            </CardHeader>
            <CardContent>
              {activeGuests.length === 0 ? (
                <div className="text-center py-6">
                  <Clock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No active guests at the moment</p>
                  <p className="text-xs text-muted-foreground mt-1">Register a guest using the "Register Guest" tab</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeGuests.map((guest) => (
                    <div key={guest.id} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="font-medium text-black">{guest.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Room: {guest.roomNumber}</span>
                          <span>•</span>
                          <span>Phone: {guest.phoneNumber}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          From: {guest.fromDate} to {guest.tillDate}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleCheckoutGuest(guest.id)}>
                        <X className="h-4 w-4 mr-1" />
                        Check-out
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Popup */}
      {showConfirmation && currentGuest && (
        <div className="confirmation-popup">
          <div className="confirmation-popup-content">
            <div className="confirmation-popup-header">Guest Registration Confirmation</div>
            <div className="confirmation-popup-body">
              <p className="mb-2">
                <strong>Guest Name:</strong> {currentGuest.name}
              </p>
              <p className="mb-2">
                <strong>Guest Phone Number:</strong> {currentGuest.phoneNumber}
              </p>
              <p className="mb-2">
                <strong>Room Number:</strong> {currentGuest.roomNumber}
              </p>
              <p className="mb-2">
                <strong>Date and Time of Sign-In:</strong>{" "}
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                , {currentGuest.checkInTime}
              </p>

              {multipleGuests === "yes" && additionalGuests.length > 0 && (
                <div className="mt-4">
                  <p className="font-bold mb-2">Additional Guests:</p>
                  {additionalGuests.map((guest, index) => (
                    <p key={index} className="mb-1">
                      <strong>Guest {index + 2} Phone Number:</strong> {guest.phoneNumber}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <div className="confirmation-popup-footer">
              <Button variant="outline" onClick={() => setShowConfirmation(false)} className="mr-2">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={confirmGuest}>
                <Check className="mr-2 h-4 w-4" />
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

