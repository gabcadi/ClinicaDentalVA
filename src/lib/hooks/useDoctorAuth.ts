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
    console.log('useDoctorAuth - Status:', status);
    console.log('useDoctorAuth - Session:', session);
    console.log('useDoctorAuth - User Role:', (session?.user as any)?.role);
    
    if (status === 'loading') return;

    if (!session) {
      console.log('useDoctorAuth - No session, redirecting to sign-in');
      router.push('/sign-in');
      return;
    }

    const userRole = (session.user as any)?.role;
    if (userRole !== 'doctor') {
      console.log('useDoctorAuth - User is not doctor, role:', userRole, 'redirecting to home');
      router.push('/home');
      return;
    }
    
    console.log('useDoctorAuth - User is doctor, access granted');
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