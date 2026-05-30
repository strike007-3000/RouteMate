'use client';

import React, { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useAuthStore } from '@/stores/useAuthStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const setSession = useAuthStore((state) => state.setSession);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      setSession({
        name: user.fullName || user.username || user.primaryEmailAddress?.emailAddress?.split('@')[0] || 'Nomad Traveler',
        email: user.primaryEmailAddress?.emailAddress || '',
        image: user.imageUrl || '',
        status: 'Elite Traveler',
      });
    } else {
      logout();
    }
  }, [isLoaded, isSignedIn, user, setSession, logout]);

  return <>{children}</>;
}
