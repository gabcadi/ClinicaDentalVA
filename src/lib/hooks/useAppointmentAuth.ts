'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface UseAppointmentAuthProps {
  appointmentId: string;
}

interface AppointmentAuthState {
  isLoading: boolean;
  isAuthorized: boolean;
  isOwner: boolean;
  isDoctor: boolean;
  session: any;
  error: string | null;
}

/**
 * Custom hook for appointment-specific authentication
 * Allows access to:
 * - The user who owns the appointment (through patient->user relationship)
 * - Doctors (role: "doctor")
 * - Admins (role: "admin")
 */
export function useAppointmentAuth({ appointmentId }: UseAppointmentAuthProps): AppointmentAuthState {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [authState, setAuthState] = useState<AppointmentAuthState>({
    isLoading: true,
    isAuthorized: false,
    isOwner: false,
    isDoctor: false,
    session: null,
    error: null
  });

  useEffect(() => {
    const checkAuthorization = async () => {
      // Still loading session
      if (status === 'loading') {
        return;
      }

      // No session - redirect to login
      if (!session) {
        router.push('/sign-in');
        return;
      }

      const userRole = (session.user as any)?.role;
      const currentUserId = (session.user as any)?.id;

      // Doctors and admins have full access
      if (userRole === 'doctor' || userRole === 'admin') {
        setAuthState({
          isLoading: false,
          isAuthorized: true,
          isOwner: false,
          isDoctor: userRole === 'doctor',
          session,
          error: null
        });
        return;
      }

      // For regular users, check if they own the appointment
      try {
        // Get appointment details
        const appointmentResponse = await fetch(`/api/appointments/${appointmentId}`);
        if (!appointmentResponse.ok) {
          throw new Error('Cita no encontrada');
        }
        
        const appointment = await appointmentResponse.json();
        
        if (!appointment.patientId) {
          throw new Error('Cita no tiene paciente asignado');
        }

        // Get patient details to find the user ID
        const patientResponse = await fetch(`/api/patients/${appointment.patientId}`);
        if (!patientResponse.ok) {
          throw new Error('Paciente no encontrado');
        }

        const patient = await patientResponse.json();
        
        // Check if current user is the owner of this appointment
        let isOwner = false;
        
        // Handle both populated and non-populated userId
        if (typeof patient.userId === 'object' && patient.userId?._id) {
          // If populated, compare with _id
          isOwner = patient.userId._id === currentUserId;
        } else if (typeof patient.userId === 'string') {
          // If not populated, compare string IDs
          isOwner = patient.userId === currentUserId;
        }

        // Also check by email if available
        if (!isOwner && patient.userId?.email && session.user?.email) {
          isOwner = patient.userId.email === session.user.email;
        }

        // Additional fallback: check by email on patient object if available
        if (!isOwner && session.user?.email) {
          // Get user by email to compare IDs
          try {
            const userResponse = await fetch(`/api/users?email=${encodeURIComponent(session.user.email)}`);
            if (userResponse.ok) {
              const users = await userResponse.json();
              const currentUser = users.find((u: any) => u.email === session.user?.email);
              if (currentUser) {
                isOwner = currentUser._id === (typeof patient.userId === 'string' ? patient.userId : patient.userId?._id);
              }
            }
          } catch (emailError) {
            console.warn('Could not fetch user by email for fallback check:', emailError);
          }
        }

        if (isOwner) {
          setAuthState({
            isLoading: false,
            isAuthorized: true,
            isOwner: true,
            isDoctor: false,
            session,
            error: null
          });
        } else {
          // User is not authorized - redirect to home
          router.push('/home');
        }

      } catch (error) {
        console.error('Error checking appointment authorization:', error);
        setAuthState({
          isLoading: false,
          isAuthorized: false,
          isOwner: false,
          isDoctor: false,
          session,
          error: error instanceof Error ? error.message : 'Error de autorización'
        });
      }
    };

    if (appointmentId) {
      checkAuthorization();
    }
  }, [appointmentId, session, status, router]);

  return authState;
}