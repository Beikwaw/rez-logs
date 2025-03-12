import { 
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  arrayUnion,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { db } from './firebase';

const USERS_COLLECTION = 'users';

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

export interface Complaint {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
  adminResponse?: string;
}

export interface SleepoverRequest {
  id: string;
  userId: string;
  guestName: string;
  guestEmail: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  adminResponse?: string;
}

export interface MaintenanceRequest {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  adminResponse?: string;
}

export const createUser = async (
  userData: Omit<UserData, 'createdAt' | 'applicationStatus'> & {
    requestDetails?: Omit<NonNullable<UserData['requestDetails']>, 'dateSubmitted'>;
  }
) => {
  const userRef = doc(db, USERS_COLLECTION, userData.id);
  const now = new Date();
  
  await setDoc(userRef, {
    ...userData,
    createdAt: now,
    applicationStatus: 'pending',
    requestDetails: userData.requestDetails ? {
      ...userData.requestDetails,
      dateSubmitted: now
    } : undefined,
    communicationLog: []
  });
};

export const getUserById = async (userId: string) => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const data = userSnap.data();
    return {
      id: userSnap.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      requestDetails: data.requestDetails ? {
        ...data.requestDetails,
        dateSubmitted: data.requestDetails.dateSubmitted.toDate()
      } : undefined,
      communicationLog: data.communicationLog?.map((log: any) => ({
        ...log,
        timestamp: log.timestamp.toDate()
      }))
    } as UserData;
  }
  return null;
};

export const getAllUsers = async () => {
  const usersRef = collection(db, USERS_COLLECTION);
  const usersSnap = await getDocs(usersRef);
  return usersSnap.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      requestDetails: data.requestDetails ? {
        ...data.requestDetails,
        dateSubmitted: data.requestDetails.dateSubmitted.toDate()
      } : undefined,
      communicationLog: data.communicationLog?.map((log: any) => ({
        ...log,
        timestamp: log.timestamp.toDate()
      }))
    } as UserData;
  });
};

export const getPendingApplications = async () => {
  const usersRef = collection(db, USERS_COLLECTION);
  const pendingQuery = query(usersRef, where('applicationStatus', '==', 'pending'));
  const pendingSnap = await getDocs(pendingQuery);
  return pendingSnap.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      requestDetails: data.requestDetails ? {
        ...data.requestDetails,
        dateSubmitted: data.requestDetails.dateSubmitted.toDate()
      } : undefined,
      communicationLog: data.communicationLog?.map((log: any) => ({
        ...log,
        timestamp: log.timestamp.toDate()
      }))
    } as UserData;
  });
};

export const processRequest = async (
  userId: string,
  status: 'accepted' | 'denied',
  message: string,
  adminId: string
) => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const now = new Date();

  await updateDoc(userRef, {
    applicationStatus: status,
    communicationLog: arrayUnion({
      message,
      sentBy: 'admin',
      timestamp: Timestamp.fromDate(now)
    })
  });
};

export const addCommunication = async (
  userId: string,
  message: string,
  sentBy: 'admin' | 'student'
) => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const now = new Date();

  await updateDoc(userRef, {
    communicationLog: arrayUnion({
      message,
      sentBy,
      timestamp: Timestamp.fromDate(now)
    })
  });
};

export const updateUser = async (userId: string, updates: Partial<UserData>) => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  await updateDoc(userRef, updates);
};

export const deleteUser = async (userId: string) => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  await deleteDoc(userRef);
};

export const createComplaint = async (complaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt'>) => {
  const complaintsRef = collection(db, 'complaints');
  const now = new Date();
  
  const docRef = await addDoc(complaintsRef, {
    ...complaint,
    createdAt: now,
    updatedAt: now
  });

  return docRef.id;
};

export const createSleepoverRequest = async (request: Omit<SleepoverRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
  const requestsRef = collection(db, 'sleepover_requests');
  const now = new Date();
  
  const docRef = await addDoc(requestsRef, {
    ...request,
    createdAt: now,
    updatedAt: now
  });

  return docRef.id;
};

export const createMaintenanceRequest = async (request: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
  const requestsRef = collection(db, 'maintenance_requests');
  const now = new Date();
  
  const docRef = await addDoc(requestsRef, {
    ...request,
    createdAt: now,
    updatedAt: now
  });

  return docRef.id;
};

export const getComplaints = async () => {
  const complaintsRef = collection(db, 'complaints');
  const complaintsSnap = await getDocs(complaintsRef);
  return complaintsSnap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate()
  })) as Complaint[];
};

export const getSleepoverRequests = async () => {
  const requestsRef = collection(db, 'sleepover_requests');
  const requestsSnap = await getDocs(requestsRef);
  return requestsSnap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
    startDate: doc.data().startDate.toDate(),
    endDate: doc.data().endDate.toDate()
  })) as SleepoverRequest[];
};

export const getMaintenanceRequests = async () => {
  const requestsRef = collection(db, 'maintenance_requests');
  const requestsSnap = await getDocs(requestsRef);
  return requestsSnap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate()
  })) as MaintenanceRequest[];
};

export const updateComplaintStatus = async (complaintId: string, status: Complaint['status'], adminResponse?: string) => {
  const complaintRef = doc(db, 'complaints', complaintId);
  await updateDoc(complaintRef, {
    status,
    adminResponse,
    updatedAt: new Date()
  });
};

export const updateSleepoverRequestStatus = async (requestId: string, status: SleepoverRequest['status'], adminResponse?: string) => {
  const requestRef = doc(db, 'sleepover_requests', requestId);
  await updateDoc(requestRef, {
    status,
    adminResponse,
    updatedAt: new Date()
  });
};

export const updateMaintenanceRequestStatus = async (requestId: string, status: MaintenanceRequest['status'], adminResponse?: string) => {
  const requestRef = doc(db, 'maintenance_requests', requestId);
  await updateDoc(requestRef, {
    status,
    adminResponse,
    updatedAt: new Date()
  });
}; 