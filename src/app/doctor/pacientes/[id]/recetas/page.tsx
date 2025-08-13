'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  Pill,
  Clock,
  Calendar,
  FileText,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPatientById } from '@/lib/api/patients';
import { getUserById } from '@/lib/api/users';
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

interface Prescription {
  _id: string;
  medication: string;
  dosage: string;
  duration: string;
  instructions: string;
  createdAt: string;
  appointmentId?: string;
  appointmentInfo?: AppointmentInfo;
}

interface AppointmentInfo {
  _id: string;
  description: string;
  date: string;
  time: string;
}

export default function PatientPrescriptions() {
  const params = useParams();
  const patientId = params?.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [appointmentDetails, setAppointmentDetails] = useState<{[key: string]: AppointmentInfo}>({});
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId) return;

      try {
        setLoadingPatient(true);
        const patientData = await getPatientById(patientId);
        setPatient(patientData);

        // Obtener información del usuario
        if (patientData.userId && !isUser(patientData.userId)) {
          const userData = await getUserById(patientData.userId.toString());
          setUser(userData);
        } else if (isUser(patientData.userId)) {
          setUser(patientData.userId);
        }
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
    const fetchPrescriptions = async () => {
      if (!patientId) return;

      try {
        setLoadingPrescriptions(true);
        
        // Obtener todas las citas del paciente
        const appointmentsResponse = await fetch(`/api/appointments?patientId=${patientId}`);
        const appointments = await appointmentsResponse.json();

        if (appointments.length === 0) {
          setPrescriptions([]);
          return;
        }

        // Obtener todas las recetas de cada cita (desde prescriptions embebidas)
        const allPrescriptions: Prescription[] = [];
        const appointmentDetailsMap: {[key: string]: AppointmentInfo} = {};

        for (const appointment of appointments) {
          // Guardar detalles de la cita
          appointmentDetailsMap[appointment._id] = {
            _id: appointment._id,
            description: appointment.description,
            date: appointment.date,
            time: appointment.time
          };

          // Si la cita tiene recetas embebidas, procesarlas
          if (appointment.prescriptions && Array.isArray(appointment.prescriptions)) {
            const appointmentPrescriptions = appointment.prescriptions.map((prescription: any) => ({
              ...prescription,
              appointmentId: appointment._id
            }));
            allPrescriptions.push(...appointmentPrescriptions);
          }
        }

        setPrescriptions(allPrescriptions);
        setAppointmentDetails(appointmentDetailsMap);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
        toast.error('Error al cargar las recetas');
      } finally {
        setLoadingPrescriptions(false);
      }
    };

    fetchPrescriptions();
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

  const formatCreatedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Ordenar recetas por fecha de creación (más recientes primero)
  const sortedPrescriptions = prescriptions.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href={`/doctor/pacientes/${patientId}`}>
              <Button variant="outline" size="sm" className="cursor-pointer">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al perfil
              </Button>
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <nav className="text-sm text-gray-600">
              <Link href="/doctor/pacientes" className="hover:text-sky-600 transition-colors">
                Pacientes
              </Link>
              <span className="mx-2">•</span>
              <Link href={`/doctor/pacientes/${patientId}`} className="hover:text-sky-600 transition-colors">
                {loadingPatient ? (
                  <InlineTextSkeleton width="w-24" />
                ) : (
                  user?.fullName || 'Paciente'
                )}
              </Link>
              <span className="mx-2">•</span>
              <span className="text-sky-600 font-medium">Recetas médicas</span>
            </nav>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center">
                  <Pill className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-1">
                    Recetas Médicas
                  </h1>
                  <p className="text-gray-600">
                    {loadingPatient ? (
                      <InlineTextSkeleton width="w-48" />
                    ) : (
                      user?.fullName || 'Información no disponible'
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
                <div className="text-2xl font-bold text-emerald-600">
                  {prescriptions.length}
                </div>
                <div className="text-sm text-gray-500">
                  {prescriptions.length === 1 ? 'Receta registrada' : 'Recetas registradas'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Lista de recetas */}
        {loadingPrescriptions ? (
          <TableSkeleton rows={3} cols={1} />
        ) : prescriptions.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
            <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No hay recetas registradas
            </h3>
            <p className="text-gray-500 mb-6">
              Este paciente aún no tiene recetas médicas en el sistema.
            </p>
            <Link href={`/doctor/pacientes/${patientId}/citas`}>
              <Button className="bg-gradient-to-r cursor-pointer from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white">
                <Calendar className="w-4 h-4 mr-2" />
                Ver citas médicas
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedPrescriptions.map((prescription) => {
              const appointmentInfo = prescription.appointmentId ? appointmentDetails[prescription.appointmentId] : undefined;
              
              return (
                <div 
                  key={prescription._id} 
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                        <Pill className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {prescription.medication}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span><strong>Dosis:</strong> {prescription.dosage}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span><strong>Duración:</strong> {prescription.duration}</span>
                          </div>
                        </div>
                        {prescription.instructions && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <div className="flex items-center gap-1 mb-1">
                              <FileText className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">Instrucciones:</span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {prescription.instructions}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                        {formatCreatedDate(prescription.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Información de la cita relacionada */}
                  {appointmentInfo && (
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4 text-gray-400" />
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Cita relacionada:</span> {appointmentInfo.description}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="capitalize">{formatDate(appointmentInfo.date)}</span>
                          <span>{formatTime(appointmentInfo.time)}</span>
                          <Link href={`/appointments/${appointmentInfo._id}`}>
                            <Button variant="outline" size="sm" className="cursor-pointer">
                              Ver cita
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
