import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserData, processRequest } from '@/lib/firestore';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface StudentApplicationsProps {
  applications: UserData[];
  onApplicationProcessed: (userId: string) => void;
}

export function StudentApplications({ applications, onApplicationProcessed }: StudentApplicationsProps) {
  const [selectedApplication, setSelectedApplication] = useState<UserData | null>(null);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessApplication = async (status: 'accepted' | 'denied') => {
    if (!selectedApplication) return;

    setIsProcessing(true);
    try {
      await processRequest(selectedApplication.id, status, message, 'admin');
      toast.success(`Application ${status} successfully`);
      onApplicationProcessed(selectedApplication.id);
      setSelectedApplication(null);
      setMessage('');
    } catch (error) {
      console.error('Error processing application:', error);
      toast.error('Failed to process application');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Student Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applications.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No pending applications</p>
            ) : (
              <div className="grid gap-4">
                {applications.map((application) => (
                  <Card key={application.id} className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => setSelectedApplication(application)}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{application.name} {application.surname}</h3>
                          <p className="text-sm text-muted-foreground">{application.email}</p>
                          <p className="text-sm text-muted-foreground">Room: {application.room_number}</p>
                          <p className="text-sm text-muted-foreground">Place of Study: {application.place_of_study}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Phone: {application.phone}</p>
                          <p className="text-sm text-muted-foreground">Tenant Code: {application.tenant_code}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedApplication && (
        <Card>
          <CardHeader>
            <CardTitle>Process Application</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message to Student</Label>
              <Textarea
                id="message"
                placeholder="Enter a message to the student..."
                value={message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                variant="destructive"
                onClick={() => handleProcessApplication('denied')}
                disabled={isProcessing}
              >
                Reject
              </Button>
              <Button
                onClick={() => handleProcessApplication('accepted')}
                disabled={isProcessing}
              >
                Approve
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 