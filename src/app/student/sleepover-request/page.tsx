'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

interface Sleepover {
  id: string;
  guestName: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed';
}

const SECURITY_PIN = '79805'; // Fixed security pin

export default function SleepoverRequest() {
  const [sleepovers, setSleepovers] = useState<Sleepover[]>([]);
  const [hasNewRequest, setHasNewRequest] = useState<string>('no');
  const [guestName, setGuestName] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [signOutPasscode, setSignOutPasscode] = useState('');
  const [sleepoverToSignOut, setSleepoverToSignOut] = useState<Sleepover | null>(null);

  useEffect(() => {
    // Check for sleepovers that need to be signed out
    const interval = setInterval(() => {
      const now = new Date();
      const activeSleepovers = sleepovers.filter(s => 
        s.status === 'active' && new Date(s.endDate) <= now
      );
      
      if (activeSleepovers.length > 0) {
        toast({
          title: "⚠️ Sleepover Sign-Out Reminder",
          description: "You have sleepover guests that need to be signed out. Please proceed to security.",
          variant: "destructive",
        });
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [sleepovers]);

  const handleSleepoverRequest = () => {
    if (!guestName.trim() || !startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (startDate > endDate) {
      toast({
        title: "Error",
        description: "End date cannot be before start date",
        variant: "destructive",
      });
      return;
    }

    const newSleepover: Sleepover = {
      id: Date.now().toString(),
      guestName,
      startDate,
      endDate,
      status: 'active',
    };

    setSleepovers([...sleepovers, newSleepover]);
    setGuestName('');
    setStartDate(undefined);
    setEndDate(undefined);
    
    toast({
      title: "Sleepover Request Submitted",
      description: `${newSleepover.guestName}'s sleepover has been registered. Please remember to visit security for sign-out at the end of the stay.`,
    });
  };

  const handleSignOutAttempt = (sleepover: Sleepover) => {
    setSleepoverToSignOut(sleepover);
  };

  const handleSleepoverSignOut = () => {
    if (!sleepoverToSignOut) return;

    if (signOutPasscode !== SECURITY_PIN) {
      toast({
        title: "Error",
        description: "Incorrect security code. Please ensure security personnel enters the correct code.",
        variant: "destructive",
      });
      return;
    }

    setSleepovers(sleepovers.map(s => 
      s.id === sleepoverToSignOut.id ? { ...s, status: 'completed' } : s
    ));
    setSignOutPasscode('');
    setSleepoverToSignOut(null);

    toast({
      title: "Success",
      description: `${sleepoverToSignOut.guestName}'s sleepover has been completed and signed out.`,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sleepover Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Do you want to request a sleepover?</Label>
            <RadioGroup
              value={hasNewRequest}
              onValueChange={setHasNewRequest}
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

          {hasNewRequest === 'yes' && (
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
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  className="rounded-md border"
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  className="rounded-md border"
                />
              </div>
              <Button onClick={handleSleepoverRequest}>Submit Request</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {sleepovers.filter(s => s.status === 'active').length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Sleepovers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sleepovers
                .filter(s => s.status === 'active')
                .map((sleepover) => (
                  <div key={sleepover.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{sleepover.guestName}</p>
                      <p className="text-sm text-muted-foreground">
                        From: {format(new Date(sleepover.startDate), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        To: {format(new Date(sleepover.endDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleSignOutAttempt(sleepover)}
                    >
                      Visit Security to Sign Out
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {sleepoverToSignOut && (
        <Card>
          <CardHeader>
            <CardTitle>Security Personnel Sign Out</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              This section is for security personnel only. Students must visit the security desk to sign out sleepover guests.
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
              <Button onClick={handleSleepoverSignOut}>Confirm Sign Out</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSleepoverToSignOut(null);
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