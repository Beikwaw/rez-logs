'use client';

import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { createUser } from '../lib/firestore';
import type { UserData } from '../lib/firestore';
import Cookies from 'js-cookie';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, role: 'student' | 'admin', requestDetails?: {
    accommodationType: string;
    location: string;
  }) => Promise<void>;
  login: (email: string, password: string, userType: 'student' | 'admin', rememberMe?: boolean) => Promise<void>;
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
              phone: data.phone || '',
              roomNumber: data.roomNumber || '',
              department: data.department || '',
              level: data.level || '',
              matricNumber: data.matricNumber || '',
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
    role: 'student' | 'admin',
    requestDetails?: {
      accommodationType: string;
      location: string;
    }
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;
      
      await createUser({
        id: user.uid,
        email: user.email || '',
        name,
        role,
        requestDetails: requestDetails ? {
          ...requestDetails,
          dateSubmitted: new Date()
        } : undefined
      });
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string, userType: 'student' | 'admin', rememberMe = false) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }
      
      const data = userDoc.data();
      if (data.role !== userType) {
        throw new Error('Invalid user type');
      }

      // Set user data in state
      const serializedData = {
        id: user.uid,
        email: user.email || '',
        name: data.name || '',
        phone: data.phone || '',
        roomNumber: data.roomNumber || '',
        department: data.department || '',
        level: data.level || '',
        matricNumber: data.matricNumber || '',
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

      // Set cookies with appropriate expiration
      const options = rememberMe ? { expires: 30 } : undefined; // 30 days if remember me is checked
      Cookies.set('userType', userType, options);
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