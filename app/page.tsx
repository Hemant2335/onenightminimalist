'use client';

import RiseLandingPage from '@/components/RiseLandingPage';
import { AuthPopup } from '@/components/AuthPopup';
import { LoadingSpinner } from '@/components/LoadingSpinner';
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

  return (
    <>
      {loading && <LoadingSpinner size="lg" text="Loading..." overlay={true} />}
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