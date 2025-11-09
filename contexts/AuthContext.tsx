'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { authAPI } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  userProfile: any | null;
  isAdmin: boolean;
  loading: boolean;
  setUserProfile: (profile: any) => void;
  refreshProfile: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    try {
      const profile = await authAPI.profile();
      setUserProfile(profile.user);
      
      // Check admin status
      try {
        const adminCheck = await authAPI.checkAdmin();
        setIsAdmin(adminCheck.is_admin || false);
      } catch (error) {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setUserProfile(null);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // Check for test token first
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token && token.startsWith('test-token-')) {
        // This is a test token, handle it separately
        // Create a mock user object for test tokens
        const mockUser = {
          uid: token.replace('test-token-', ''),
          phoneNumber: null,
          displayName: null,
        } as User;
        setUser(mockUser);
        refreshProfile().then(() => {
          setLoading(false);
        });
        return;
      }
    }

    // Handle Firebase authentication
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Get Firebase ID token and store it
        const token = await firebaseUser.getIdToken();
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', token);
        }
        
        // Fetch user profile
        await refreshProfile();
      } else {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
        }
        setUserProfile(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    // Check if it's a test token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token && token.startsWith('test-token-')) {
        // Just clear test token
        localStorage.removeItem('authToken');
        setUser(null);
        setUserProfile(null);
        setIsAdmin(false);
        return;
      }
    }
    
    // Firebase logout
    await auth.signOut();
    setUser(null);
    setUserProfile(null);
    setIsAdmin(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isAdmin,
        loading,
        setUserProfile,
        refreshProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

