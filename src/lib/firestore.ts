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
  addDoc,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

const USERS_COLLECTION = 'users';

export interface UserData {
  applicationStatus: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  roomNumber: string;
  department: string;
  level: string;
  matricNumber: string;
  role: 'student' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  communicationLog: {
    type: 'complaint' | 'maintenance' | 'sleepover' | 'guest';
    message: string;
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

export interface GuestRegistration {
  id: string;
  userId: string;
  guestName: string;
  guestEmail: string;
  visitDate: string;
  visitTime: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  adminResponse?: string;
}

export const createUser = async (userData: Omit<UserData, 'createdAt' | 'updatedAt' | 'communicationLog'>) => {
  const userRef = doc(db, USERS_COLLECTION, userData.id);
  const now = new Date();
  
  await setDoc(userRef, {
    ...userData,
    createdAt: now,
    updatedAt: now,
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
      updatedAt: data.updatedAt.toDate(),
      communicationLog: data.communicationLog?.map((log: any) => ({
        ...log,
        timestamp: log.timestamp.toDate()
      })) || []
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
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      communicationLog: data.communicationLog?.map((log: any) => ({
        ...log,
        timestamp: log.timestamp?.toDate() || new Date()
      })) || []
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
      updatedAt: data.updatedAt.toDate(),
      communicationLog: data.communicationLog?.map((log: any) => ({
        ...log,
        timestamp: log.timestamp.toDate()
      })) || []
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

export const modifyComplaintStatus = async (complaintId: string, status: Complaint['status'], adminResponse?: string) => {
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

export const createGuestRegistration = async (registration: Omit<GuestRegistration, 'id' | 'createdAt' | 'updatedAt'>) => {
  const registrationsRef = collection(db, 'guest_registrations');
  const now = new Date();
  
  const docRef = await addDoc(registrationsRef, {
    ...registration,
    createdAt: now,
    updatedAt: now
  });

  return docRef.id;
};

export const getGuestRegistrations = async (userId: string) => {
  const registrationsRef = collection(db, 'guest_registrations');
  const registrationsQuery = query(registrationsRef, where('userId', '==', userId));
  const registrationsSnap = await getDocs(registrationsQuery);
  return registrationsSnap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate()
  })) as GuestRegistration[];
}; 

export const updateRequestStatus = async (requestId: string, status: string) => {
  const requestRef = doc(db, 'requests', requestId);
  await updateDoc(requestRef, {
    status
  });
};

export const assignStaffToRequest = async (requestId: string, staffId: string) => {
  const requestRef = doc(db, 'requests', requestId);
  await updateDoc(requestRef, {
    staffId
  });
};

export async function getAllComplaints() {
  const complaintsRef = collection(db, 'complaints');
  const q = query(complaintsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  }));
}

export async function updateComplaintStatus(
  id: string,
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected',
  adminResponse?: string
) {
  const complaintRef = doc(db, 'complaints', id);
  await updateDoc(complaintRef, {
    status,
    adminResponse,
    updatedAt: serverTimestamp(),
  });
}

export async function assignStaffToComplaint(complaintId: string, staffId: string) {
  const complaintRef = doc(db, 'complaints', complaintId);
  await updateDoc(complaintRef, {
    assignedStaffId: staffId,
    updatedAt: serverTimestamp(),
  });
}

export async function getAllMaintenanceRequests() {
  const maintenanceRef = collection(db, 'maintenance');
  const q = query(maintenanceRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  }));
}

export async function updateMaintenanceStatus(
  id: string,
  status: 'pending' | 'in_progress' | 'completed' | 'rejected',
  adminResponse?: string
) {
  const maintenanceRef = doc(db, 'maintenance', id);
  await updateDoc(maintenanceRef, {
    status,
    adminResponse,
    updatedAt: serverTimestamp(),
  });
}

export async function assignStaffToMaintenance(maintenanceId: string, staffId: string) {
  const maintenanceRef = doc(db, 'maintenance', maintenanceId);
  await updateDoc(maintenanceRef, {
    assignedStaffId: staffId,
    updatedAt: serverTimestamp(),
  });
}

export async function getAllSleepoverRequests() {
  const sleepoverRef = collection(db, 'sleepover');
  const q = query(sleepoverRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    startDate: doc.data().startDate?.toDate() || new Date(),
    endDate: doc.data().endDate?.toDate() || new Date(),
  }));
}

export async function updateSleepoverStatus(
  id: string,
  status: 'pending' | 'approved' | 'rejected',
  adminResponse?: string
) {
  const sleepoverRef = doc(db, 'sleepover', id);
  await updateDoc(sleepoverRef, {
    status,
    adminResponse,
    updatedAt: serverTimestamp(),
  });
}

export async function getAllGuestRequests() {
  const guestRef = collection(db, 'guest');
  const q = query(guestRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  }));
}

export async function updateGuestStatus(
  id: string,
  status: 'pending' | 'approved' | 'rejected',
  adminResponse?: string
) {
  const guestRef = doc(db, 'guest', id);
  await updateDoc(guestRef, {
    status,
    adminResponse,
    updatedAt: serverTimestamp(),
  });
}

//student api calls
export async function getAnnouncements() {
  const announcementsRef = collection(db, 'announcements');
  const q = query(announcementsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    title: doc.data().title,
    content: doc.data().content,
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  }));
}

export async function getMyComplaints(userId:string){
  const complaintsRef = collection(db, 'complaints');
  const q = query(complaintsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  }));
  
}

export async function getMySleepoverRequests(userId:string){
  const sleepoverRef = collection(db, 'sleepover');
  const q = query(sleepoverRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    startDate: doc.data().startDate?.toDate() || new Date(),
    endDate: doc.data().endDate?.toDate() || new Date(),
  }));
}

export async function getMyGuestRequests(userId:string){
  const guestRef = collection(db, 'guest');
  const q = query(guestRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  }));
}

export async function getMyMaintenanceRequests(userId:string){
  const maintenanceRef = collection(db, 'maintenance');
  const q = query(maintenanceRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  }));
}

