'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface PatientGuardProps {
  children: ReactNode;
}

export function PatientGuard({ children }: PatientGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/sign-in');
      return;
    }

    if ((session.user as any)?.role !== 'patient') {
      router.push('/home');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-8 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-lg font-medium text-slate-700">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== 'patient') {
    return null;
  }

  return <>{children}</>;
}