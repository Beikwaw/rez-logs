export interface UserData {
  id: string;
  email: string;
  name?: string;
  role: 'student' | 'admin';
  createdAt: Date;
  applicationStatus?: 'pending' | 'accepted' | 'denied';
  requestDetails?: {
    accommodationType: string;
    location: string;
    dateSubmitted: Date;
  };
  communicationLog?: {
    message: string;
    sentBy: 'admin' | 'student';
    timestamp: Date;
  }[];
} 