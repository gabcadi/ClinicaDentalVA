'use client';

import { useAppointmentAuth } from '@/lib/hooks/useAppointmentAuth';
import { Button } from '@/components/ui/button';
import { AlertCircle, Calendar, Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AppointmentGuardProps {
  children: React.ReactNode;
  appointmentId: string;
  loadingMessage?: string;
}

/**
 * Component that guards appointment-specific content
 * Allows access to appointment owners and doctors only
 */
export function AppointmentGuard({ 
  children, 
  appointmentId,
  loadingMessage = "Verificando permisos de acceso..."
}: AppointmentGuardProps) {
  const { isLoading, isAuthorized, isOwner, isDoctor, error } = useAppointmentAuth({ appointmentId });
  const router = useRouter();

  // Show loading state while checking authorization
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="relative mb-6">
            <div className="w-20 h-20 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-purple-400/20 border-b-purple-400 rounded-full animate-spin animate-reverse"></div>
          </div>
          <p className="text-gray-300">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  // Show error state if there was an error checking authorization
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-6">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Error de Acceso
          </h1>
          <p className="text-gray-300 mb-6">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => router.push('/home')}
              className="bg-slate-700 hover:bg-slate-600 text-white"
            >
              Volver al Inicio
            </Button>
            <Button 
              onClick={() => router.back()}
              variant="outline"
              className="border-slate-500 text-slate-300 hover:bg-slate-800"
            >
              Regresar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show unauthorized state if user doesn't have access
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500/20 rounded-full mb-6">
            <Lock className="w-10 h-10 text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Acceso Restringido
          </h1>
          <p className="text-gray-300 mb-6 leading-relaxed">
            No tienes permisos para acceder a esta cita. Solo el paciente propietario y los doctores pueden ver estos detalles.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <User className="w-5 h-5" />
              ¿Quién puede acceder?
            </h3>
            <ul className="text-sm text-gray-300 space-y-2 text-left">
              <li className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                El paciente propietario de la cita
              </li>
              <li className="flex items-center gap-2">
                <User className="w-4 h-4 text-green-400" />
                Doctores del sistema
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => router.push('/home')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Ir al Inicio
            </Button>
            <Button 
              onClick={() => router.back()}
              variant="outline"
              className="border-slate-500 text-slate-300 hover:bg-slate-800"
            >
              Regresar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render protected content with access indicator
  return (
    <div>
      {/* Access indicator - subtle badge showing access level */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-xs">
          <span className="text-white/80">
            {isDoctor ? '👨‍⚕️ Doctor' : isOwner ? '👤 Propietario' : '🔓 Autorizado'}
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}