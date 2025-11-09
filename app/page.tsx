'use client';

import RiseLandingPage from '@/components/RiseLandingPage';
import { AuthPopup } from '@/components/AuthPopup';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [authPopupOpen, setAuthPopupOpen] = useState(false);
  const [authType, setAuthType] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-[#C9D6DF] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <RiseLandingPage 
        onSignIn={() => {
          setAuthType('signin');
          setAuthPopupOpen(true);
        }}
        onSignUp={() => {
          setAuthType('signup');
          setAuthPopupOpen(true);
        }}
      />
      <AuthPopup 
        isOpen={authPopupOpen} 
        onClose={() => setAuthPopupOpen(false)} 
        type={authType}
      />
    </>
  );
}