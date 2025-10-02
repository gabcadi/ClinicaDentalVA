'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Search, Shield, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
  },
  {
    key: 'inventario de materiales',
    icon: Shield,
    title: 'Inventario de Materiales',  
    description: 'Consulta y administración del inventario de materiales médicos.',
    href: '/admin/inventario'
  }
];

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (!session) {
      // No session, redirect to sign-in
      router.push('/sign-in');
      return;
    }

    const userRole = (session.user as any)?.role;
    if (userRole !== 'admin') {
      // User doesn't have admin role, redirect to home
      router.push('/home');
      return;
    }
  }, [session, status, router]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
            <p className="text-slate-600">Verificando permisos...</p>
          </div>
        </div>
      </main>
    );
  }

  // Show unauthorized state if not authenticated or not admin
  if (!session || (session.user as any)?.role !== 'admin') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">
              Acceso Denegado
            </h1>
            <p className="text-slate-600 mb-6">
              No tienes permisos para acceder a esta página. Solo los administradores pueden acceder al panel de administración.
            </p>
            <Button 
              onClick={() => router.push('/home')}
              className="bg-slate-900 hover:bg-slate-800 text-white"
            >
              Volver al Inicio
            </Button>
          </div>
        </div>
      </main>
    );
  }

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