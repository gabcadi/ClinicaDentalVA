'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Search, Shield } from 'lucide-react';
import Link from 'next/link';

// Configuración de módulos del panel
const modules = [
  {
    key: 'users',
    icon: Users,
    title: 'Gestión de Usuarios',
    description: 'Administración de cuentas, roles y permisos del sistema.',
    href: '/admin/users'
  },
  {
    key: 'historial',
    icon: Search,
    title: 'Historial de Citas',
    description: 'Consulta y administración del historial completo de citas.',
    href: '/admin/historial'
  }
];

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50">
      <div className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <header className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-4 py-2 mb-6">
              <Shield className="w-4 h-4 text-slate-600" />
              <span className="text-slate-700 font-medium text-sm">
                Administración
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Panel de Administración
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Clínica Dental Vargas Araya
            </p>
          </header>

          {/* Modules Grid */}
          <section aria-label="Módulos administrativos" className="grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Link 
                  key={module.key} 
                  href={module.href} 
                  className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-4 rounded-2xl"
                >
                  <Card className="border-slate-200 bg-white hover:border-slate-300 transition-all duration-300 hover:shadow-lg rounded-2xl h-full">
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center group-hover:bg-slate-800 transition-colors">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-slate-800 transition-colors">
                            {module.title}
                          </CardTitle>
                          <p className="text-slate-600 text-sm leading-relaxed">
                            {module.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 pb-6">
                      <Button 
                        className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-all duration-200 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                      >
                        Acceder
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </section>

        
        </div>
      </div>
    </main>
  );
}