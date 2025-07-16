'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';
import { getPatientById } from '@/lib/api/patients';
import { getUserById } from '@/lib/api/users';
import { Patient, User } from '@/lib/types/interfaces';

export default function PacienteDetalle() {
  const params = useParams();
  const id = params?.id;

  const [paciente, setPaciente] = useState<Patient | null>(null);
  const [user, setUser] = useState<User | null>(null); 

useEffect(() => {
  const fetchPaciente = async () => {
    try {
      const data = await getPatientById(id);
      setPaciente(data);  
    } catch (error) {
      console.error('Error fetching patient:', error);
    }
  };

  fetchPaciente();
}, [id]);

useEffect(() => {
  const fetchUser = async () => {
    if (paciente?.userId) { 
      try {
        const userData = await getUserById(paciente.userId);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
  };

  fetchUser();
}, [paciente]); 

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
              <li><span className="font-medium">Nombre: </span> {user?.fullName}</li>
              <li><span className="font-medium">Edad: </span> {paciente?.age}</li>
              <li><span className="font-medium">Cédula:</span> {paciente?.id}</li>
              <li><span className="font-medium">Teléfono:</span> {paciente?.phone}</li>
              <li><span className="font-medium">Correo:</span> {user?.email}</li>
              <li><span className="font-medium">Dirección:</span> {paciente?.address}</li>
            </ul>
          </div>

          <div className="bg-gradient-to-tr from-sky-600 to-sky-500 text-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-lg">
            <Icons.CalendarPlus className="w-10 h-10 mb-4" />
            <h3 className="text-lg font-semibold mb-2">¿Deseas agendar una cita?</h3>
            <Button className="bg-white text-sky-600 hover:bg-gray-100 w-full mt-2 rounded-full font-semibold">
              Crear nueva cita
            </Button>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardItem icon={<Icons.Stethoscope className="w-5 h-5" />} title="Historial Médico" description="Aún no hay registros disponibles." />
          <CardItem icon={<Icons.ImageIcon className="w-5 h-5" />} title="Imágenes Médicas" description="No se han cargado imágenes." />
          <CardItem icon={<Icons.FileText className="w-5 h-5" />} title="Recetas" description="No hay recetas activas." />
          <CardItem icon={<Icons.FolderOpen className="w-5 h-5" />} title="Documentos Adjuntos" description="Sin archivos registrados." />
        </section>
      </div>
    </div>
  );
}

function CardItem({ icon, title, description }: { icon: JSX.Element; title: string; description: string }) {
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
