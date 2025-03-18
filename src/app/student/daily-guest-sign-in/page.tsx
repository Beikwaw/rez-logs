'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

interface Guest {
  id: string;
  name: string;
  signInTime: string;
}

const SECURITY_PIN = '79805'; // Fixed security pin

export default function DailyGuestSignIn() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [hasMoreGuests, setHasMoreGuests] = useState<string>('no');
  const [guestName, setGuestName] = useState('');
  const [signOutPasscode, setSignOutPasscode] = useState('');
  const [guestToSignOut, setGuestToSignOut] = useState<Guest | null>(null);

  useEffect(() => {
    // Check for guests that need to be signed out before 23:00
    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      if (hours === 22 && minutes === 45 && guests.length > 0) {
        toast({
          title: "⚠️ Guest Sign-Out Reminder",
          description: "All daily guests must be signed out by 23:00. Please proceed to security to sign out any remaining guests.",
          variant: "destructive",
        });
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [guests]);

  const handleGuestSignIn = () => {
    if (!guestName.trim()) {
      toast({
        title: "Error",
        description: "Please enter the guest's name",
        variant: "destructive",
      });
      return;
    }

    const newGuest: Guest = {
      id: Date.now().toString(),
      name: guestName,
      signInTime: format(new Date(), 'HH:mm'),
    };

    setGuests([...guests, newGuest]);
    setGuestName('');
    
    toast({
      title: "Guest Signed In",
      description: `${newGuest.name} has been signed in successfully. Please remember to visit security when signing out your guest.`,
    });
  };

  const handleSignOutAttempt = (guest: Guest) => {
    setGuestToSignOut(guest);
  };

  const handleGuestSignOut = () => {
    if (!guestToSignOut) return;

    if (signOutPasscode !== SECURITY_PIN) {
      toast({
        title: "Error",
        description: "Incorrect security code. Please ensure security personnel enters the correct code.",
        variant: "destructive",
      });
      return;
    }

    setGuests(guests.filter(g => g.id !== guestToSignOut.id));
    setSignOutPasscode('');
    setGuestToSignOut(null);

    toast({
      title: "Success",
      description: `${guestToSignOut.name} has been signed out successfully.`,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Daily Guest Sign-In</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Do you want to sign in guests?</Label>
            <RadioGroup
              value={hasMoreGuests}
              onValueChange={setHasMoreGuests}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {hasMoreGuests === 'yes' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="guestName">Guest's Full Name</Label>
                <Input
                  id="guestName"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter guest's full name"
                />
              </div>
              <Button onClick={handleGuestSignIn}>Sign In Guest</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {guests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Guests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {guests.map((guest) => (
                <div key={guest.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{guest.name}</p>
                    <p className="text-sm text-muted-foreground">Signed in at: {guest.signInTime}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleSignOutAttempt(guest)}
                  >
                    Visit Security to Sign Out
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {guestToSignOut && (
        <Card>
          <CardHeader>
            <CardTitle>Security Personnel Sign Out</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              This section is for security personnel only. Students must visit the security desk to sign out guests.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="passcode">Security Code (Security Personnel Only)</Label>
              <Input
                id="passcode"
                type="password"
                maxLength={5}
                value={signOutPasscode}
                onChange={(e) => setSignOutPasscode(e.target.value)}
                placeholder="Enter security code"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleGuestSignOut}>Confirm Sign Out</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setGuestToSignOut(null);
                  setSignOutPasscode('');
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 