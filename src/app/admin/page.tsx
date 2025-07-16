'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, ClipboardList, Search, ImageIcon, FilePlus2, Users } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: <FileText className="w-6 h-6 text-sky-600" />,
    title: 'Codigos CABYS',
    description: 'Visualiza, consulta y actualiza los códigos CABYS.',
    href: '/CABYS',
  },
  {
    icon: <ClipboardList className="w-6 h-6 text-sky-600" />,
    title: 'Detalles de consultas',
    description: 'Registra y consulta la evolución del paciente.',
    href: '/consultas',
  },
  {
    icon: <Search className="w-6 h-6 text-sky-600" />,
    title: 'Historial de pacientes',
    description: 'Historial de pacientes.',
    href: '/historial',
  },
  
  
];

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-sky-700">Clínica Vargas Araya - Panel Administrador</h1>
          <p className="text-slate-600 mt-2 text-lg">Hola Admin!</p>
          <p className="text-slate-600 mt-2 text-lg">Gestión clínica centralizada</p>
        </header>

        {/* Card Principal usuarios  */}
        <div className="mb-16">
          <Card className="bg-white border border-sky-200 shadow-lg">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-sky-100 flex items-center justify-center">
                  <Users className="w-7 h-7 text-sky-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-sky-700">Gestión de Usuarios</CardTitle>
                  <p className="text-slate-600 mt-1 max-w-xl">
                    Administracion de usuarios, roles y permisos para un control total del sistema.
                  </p>
                </div>
              </div>
              <Link href="/admin/users">
                <Button className="bg-sky-600 hover:bg-sky-700 text-white rounded-md px-6 h-12">
                  Modulo Usuarios
                </Button>
              </Link>
            </CardHeader>
          </Card>
        </div>
        

        {/* Otros módulos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                  {feature.icon}
                </div>
                <CardTitle className="text-sky-700 text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm mb-4">{feature.description}</p>
                <Link href={feature.href}>
                  <Button variant="outline" className="text-sky-600 border-sky-400 hover:bg-sky-50">
                    Ir al módulo
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

