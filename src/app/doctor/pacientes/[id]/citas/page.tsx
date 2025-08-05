'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft,
  Eye,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPatientById } from '@/lib/api/patients';
import { Patient, User as UserType } from '@/lib/types/interfaces';
import { TableSkeleton, InlineTextSkeleton } from '@/components/ui/loading-skeletons';
import { toast } from 'sonner';

// Type guard para verificar si userId es un objeto User
const isUser = (userId: unknown): userId is UserType => {
  return (
    typeof userId === 'object' &&
    userId !== null &&
    'fullName' in userId
  );
};


interface Appointment {
  _id: string;
  description: string;
  date: string;
  time: string;
  confirmed: boolean;
  patientId: string;
  createdAt: string;
  updatedAt: string;
}

export default function PatientAppointments() {
  const params = useParams();
  const patientId = params?.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId) return;
      
      setLoadingPatient(true);
      try {
        const data = await getPatientById(patientId);
        setPatient(data);
      } catch (error) {
        console.error('Error fetching patient:', error);
        toast.error('Error al cargar la información del paciente');
      } finally {
        setLoadingPatient(false);
      }
    };

    fetchPatient();
  }, [patientId]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!patientId) return;

      setLoadingAppointments(true);
      try {
        // Obtener citas del paciente
        const response = await fetch(`/api/appointments?patientId=${patientId}`);
        if (!response.ok) {
          throw new Error('Error fetching appointments');
        }
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Error al cargar las citas');
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAppointments();
  }, [patientId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString('es-CR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const sortedAppointments = appointments.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateB.getTime() - dateA.getTime(); // Más recientes primero
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-white px-6 py-12 font-[var(--font-dmsans)]">
      <div className="max-w-6xl mx-auto">
        {/* Header con información del paciente */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href={`/doctor/pacientes/${patientId}`}
            className="flex items-center gap-2 text-sky-600 hover:text-sky-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al paciente
          </Link>
        </div>

        <header className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-sky-700 tracking-tight">
                    Historial de Citas
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Paciente: {loadingPatient ? (
                      <InlineTextSkeleton width="w-48" />
                    ) : (
                      isUser(patient?.userId) 
                        ? patient?.userId.fullName 
                        : 'Información no disponible'
                    )}
                  </p>
                  {patient && (
                    <p className="text-sm text-gray-500">
                      Cédula: {patient.id} • Edad: {patient.age} años
                    </p>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-sky-600">
                  {appointments.length}
                </div>
                <div className="text-sm text-gray-500">
                  {appointments.length === 1 ? 'Cita registrada' : 'Citas registradas'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Botón para crear nueva cita */}
        <div className="mb-8">
          <Link href={`/appointments/create?patientId=${patientId}`}>
            <Button className="bg-gradient-to-r cursor-pointer from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Cita
            </Button>
          </Link>
        </div>

        {/* Lista de citas */}
        {loadingAppointments ? (
          <TableSkeleton rows={3} cols={1} />
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No hay citas registradas
            </h3>
            <p className="text-gray-500 mb-6">
              Este paciente aún no tiene citas programadas en el sistema.
            </p>
            <Link href={`/appointments/create?patientId=${patientId}`}>
              <Button className="bg-gradient-to-r cursor-pointer from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Programar Primera Cita
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAppointments.map((appointment) => (
              <div 
                key={appointment._id} 
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {appointment.description}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span className="capitalize">{formatDate(appointment.date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(appointment.time)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                      appointment.confirmed 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-orange-100 text-orange-700 border border-orange-200'
                    }`}>
                      {appointment.confirmed ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                      {appointment.confirmed ? 'Confirmada' : 'Pendiente'}
                    </div>

                    <Link href={`/appointments/${appointment._id}`}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-sky-200 cursor-pointer text-sky-600 hover:bg-sky-50 hover:border-sky-300"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalle
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
