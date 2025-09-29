'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/**
 * Custom hook for doctor authentication
 * Redirects non-doctor users to appropriate pages
 * @returns Authentication state and user session
 */
export function useDoctorAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      // No session, redirect to sign-in
      router.push('/sign-in');
      return;
    }

    const userRole = (session.user as any)?.role;
    if (userRole !== 'doctor') {
      // User doesn't have doctor role, redirect to home
      router.push('/home');
      return;
    }
  }, [session, status, router]);

  return {
    session,
    status,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    isDoctor: (session?.user as any)?.role === 'doctor',
    isAuthorized: !!session && (session.user as any)?.role === 'doctor'
  };
}