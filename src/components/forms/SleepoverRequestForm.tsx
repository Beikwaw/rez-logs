'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createSleepoverRequest } from '@/lib/firestore';
import { toast } from 'sonner';

interface SleepoverRequestFormProps {
  userId: string;
  onSuccess?: () => void;
}

interface FormData {
  guestName: string;
  guestEmail: string;
  startDate: string;
  endDate: string;
}

export function SleepoverRequestForm({ userId, onSuccess }: SleepoverRequestFormProps) {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const startDate = watch('startDate');

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await createSleepoverRequest({
        userId,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: 'pending'
      });
      toast.success('Sleepover request submitted successfully');
      reset(); // Reset the form fields
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting sleepover request:', error);
      toast.error('Failed to submit sleepover request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="guestName">Guest Name</Label>
        <Input
          id="guestName"
          {...register('guestName', { required: 'Guest name is required' })}
          placeholder="Full name of your guest"
        />
        {errors.guestName && (
          <p className="text-sm text-red-500">{errors.guestName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="guestEmail">Guest Email</Label>
        <Input
          id="guestEmail"
          type="email"
          {...register('guestEmail', { 
            required: 'Guest email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          placeholder="guest@example.com"
        />
        {errors.guestEmail && (
          <p className="text-sm text-red-500">{errors.guestEmail.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            {...register('startDate', { 
              required: 'Start date is required',
              validate: value => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return new Date(value).getTime() >= today.getTime() || 'Start date must be today or later';
              }
            })}
          />
          {errors.startDate && (
            <p className="text-sm text-red-500">{errors.startDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            {...register('endDate', { 
              required: 'End date is required',
              validate: value => !startDate || new Date(value).getTime() >= new Date(startDate).getTime() || 'End date must be after start date'
            })}
          />
          {errors.endDate && (
            <p className="text-sm text-red-500">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => reset()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </Button>
      </div>
    </form>
  );
}