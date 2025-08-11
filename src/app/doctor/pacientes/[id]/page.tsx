'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';
import { getPatientById } from '@/lib/api/patients';
import { getUserById } from '@/lib/api/users';
import { Patient, User } from '@/lib/types/interfaces';
import Link from 'next/link';
import { PatientPageSkeleton, InlineTextSkeleton } from '@/components/ui/loading-skeletons';

// Type guard para verificar si userId es un objeto User
const isUser = (userId: unknown): userId is User => {
  return userId !== null && typeof userId === 'object' && 'fullName' in (userId as Record<string, unknown>);
};

export default function PacienteDetalle() {
  const params = useParams();
  const id = params?.id as string;

  const [paciente, setPaciente] = useState<Patient | null>(null);
  const [user, setUser] = useState<User | null>(null); 
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [loadingUser, setLoadingUser] = useState(false);

useEffect(() => {
  const fetchPaciente = async () => {
    if (!id) return;
    
    setLoadingPatient(true);
    try {
      const data = await getPatientById(id);
      setPaciente(data);  
    } catch (error) {
      console.error('Error fetching patient:', error);
    } finally {
      setLoadingPatient(false);
    }
  };

  fetchPaciente();
}, [id]);

useEffect(() => {
  const fetchUser = async () => {
    if (paciente?.userId) { 
      setLoadingUser(true);
      try {
        // Si userId ya es un objeto User (populado), usarlo directamente
        if (isUser(paciente.userId)) {
          setUser(paciente.userId);
        } else {
          // Si es un ObjectId, hacer la petición API
          const userId = typeof paciente.userId === 'object' ? paciente.userId.toString() : paciente.userId;
          const userData = await getUserById(userId);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoadingUser(false);
      }
    }
  };

  fetchUser();
}, [paciente]);

if (loadingPatient) {
  return <PatientPageSkeleton />;
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-white px-6 py-12 font-[var(--font-dmsans)]">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-sky-700 tracking-tight">Paciente</h1>
          <p className="text-slate-500 mt-2 text-lg">Cédula: {paciente?.id}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="col-span-2 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <h2 className="text-xl font-semibold text-sky-600 flex items-center gap-2 mb-4">
              <Icons.User className="w-5 h-5" /> Información General
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li>
                <span className="font-medium">Nombre: </span> 
                {loadingUser ? (
                  <InlineTextSkeleton width="w-32" />
                ) : (
                  user?.fullName || 'No disponible'
                )}
              </li>
              <li><span className="font-medium">Edad: </span> {paciente?.age}</li>
              <li><span className="font-medium">Cédula:</span> {paciente?.id}</li>
              <li><span className="font-medium">Teléfono:</span> {paciente?.phone}</li>
              <li>
                <span className="font-medium">Correo:</span> 
                {loadingUser ? (
                  <InlineTextSkeleton width="w-40" />
                ) : (
                  ` ${user?.email || 'No disponible'}`
                )}
              </li>
              <li><span className="font-medium">Dirección:</span> {paciente?.address}</li>
            </ul>
          </div>

          <div className="bg-gradient-to-tr from-sky-600 to-sky-500 text-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-lg">
            <Icons.CalendarPlus className="w-10 h-10 mb-4" />
            <h3 className="text-lg font-semibold mb-2">¿Deseas agendar una cita?</h3>
            {loadingPatient ? (
              <div className="w-full h-10 bg-white/20 rounded-full animate-pulse"></div>
            ) : (
              <Button className="bg-white cursor-pointer text-sky-600 hover:bg-gray-100 w-full mt-2 rounded-full font-semibold">
                <Link href={`/appointments/create?patientId=${paciente?._id}`}>
                  Crear nueva cita
                </Link>
              </Button>
            )}
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-3 text-sky-600">
              <Icons.Stethoscope className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Historial Médico</h3>
            </div>
            <p className="text-slate-600 text-sm mb-4">Consulta todas las citas médicas registradas para este paciente.</p>
            <Link href={`/doctor/pacientes/${paciente?._id}/citas`}>
              <Button className="w-full cursor-pointer bg-sky-600 hover:bg-sky-700 text-white">
                Ver Historial de Citas
              </Button>
            </Link>
          </div>
          <CardItem icon={<Icons.ImageIcon className="w-5 h-5" />} title="Imágenes Médicas" description="No se han cargado imágenes." />
          <CardItem icon={<Icons.FileText className="w-5 h-5" />} title="Recetas" description="No hay recetas activas." />
          <CardItem icon={<Icons.FolderOpen className="w-5 h-5" />} title="Documentos Adjuntos" description="Sin archivos registrados." />
        </section>
      </div>
    </div>
  );
}

function CardItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3 mb-3 text-sky-600">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>
  );
}
