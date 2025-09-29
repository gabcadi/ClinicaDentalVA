'use client';

import { useDoctorAuth } from '@/lib/hooks/useDoctorAuth';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DoctorGuardProps {
  children: React.ReactNode;
  loadingMessage?: string;
  unauthorizedTitle?: string;
  unauthorizedMessage?: string;
}

/**
 * Component that guards doctor-only content
 * Shows loading state during auth check and unauthorized message for non-doctors
 */
export function DoctorGuard({ 
  children, 
  loadingMessage = "Verificando permisos médicos...",
  unauthorizedTitle = "Acceso Restringido",
  unauthorizedMessage = "Esta sección está reservada únicamente para médicos autorizados. Por favor, contacta al administrador si crees que esto es un error."
}: DoctorGuardProps) {
  const { isLoading, isAuthorized } = useDoctorAuth();
  const router = useRouter();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-slate-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
            <p className="text-slate-600">{loadingMessage}</p>
          </div>
        </div>
      </main>
    );
  }

  // Show unauthorized state if not doctor
  if (!isAuthorized) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-slate-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">
              {unauthorizedTitle}
            </h1>
            <p className="text-slate-600 mb-6">
              {unauthorizedMessage}
            </p>
            <Button 
              onClick={() => router.push('/home')}
              className="bg-sky-600 hover:bg-sky-700 text-white"
            >
              Volver al Inicio
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // Render protected content
  return <>{children}</>;
}