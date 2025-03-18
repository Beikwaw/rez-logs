'use client';

import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { createUser, getUserById } from '../lib/firestore';
import type { UserData } from '../lib/firestore';
import Cookies from 'js-cookie';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, role: 'student' | 'admin' | 'newbie', requestDetails?: {
    accommodationType: string;
    location: string;
  }) => Promise<void>;
  login: (email: string, password: string, userType: 'student' | 'admin' | 'newbie', rememberMe?: boolean) => Promise<UserData>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            const serializedData = {
              id: user.uid,
              email: user.email || '',
              name: data.name || '',
              surname: data.surname || '',
              phone: data.phone || '',
              place_of_study: data.place_of_study || '',
              room_number: data.room_number || '',
              tenant_code: data.tenant_code || '',
              role: data.role || 'student',
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
              applicationStatus: data.applicationStatus,
              requestDetails: data.requestDetails ? {
                ...data.requestDetails,
                dateSubmitted: data.requestDetails.dateSubmitted?.toDate() || new Date()
              } : undefined,
              communicationLog: data.communicationLog?.map((log: any) => ({
                ...log,
                timestamp: log.timestamp?.toDate() || new Date()
              })) || []
            } as UserData;
            
            setUserData(serializedData);
            
            // Set cookies if they don't exist (for persistent login)
            if (!Cookies.get('userType')) {
              Cookies.set('userType', data.role);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserData(null);
        }
      } else {
        setUserData(null);
        // Clear cookies on logout/session end
        Cookies.remove('userType');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: 'student' | 'admin' | 'newbie',
    requestDetails?: {
      accommodationType: string;
      location: string;
    }
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData: Omit<UserData, 'createdAt' | 'updatedAt' | 'communicationLog'> = {
        id: user.uid,
        email: user.email || '',
        name: name,
        surname: '',
        phone: '',
        role: role,
        place_of_study: '',
        room_number: '',
        tenant_code: '',
        requestDetails: requestDetails ? {
          ...requestDetails,
          dateSubmitted: new Date()
        } : undefined
      };

      await createUser(userData);
      setUser(user);
      setUserData(userData as UserData);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string, userType: 'student' | 'admin' | 'newbie', rememberMe?: boolean) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user data from Firestore
      const userData = await getUserById(user.uid);
      
      if (!userData) {
        throw new Error('User data not found');
      }

      // Check if user type matches
      if (userData.role !== userType) {
        throw new Error('Invalid user type');
      }

      // Set persistence based on rememberMe
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

      // Set cookies if they don't exist (for persistent login)
      if (!Cookies.get('userType')) {
        Cookies.set('userType', userData.role);
      }

      setUser(user);
      setUserData(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      Cookies.remove('userType');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, signUp, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}