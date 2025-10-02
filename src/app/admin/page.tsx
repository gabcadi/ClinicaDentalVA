'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Search, Shield, AlertCircle, Activity, CalendarDays } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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
  const [stats, setStats] = useState<{ users: number | null; appointments: number | null; upcoming: number | null }>({ users: null, appointments: null, upcoming: null });
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch dashboard stats
  useEffect(() => {
    if (status !== 'authenticated') return;
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const [usersRes, apptRes] = await Promise.all([
          fetch('/api/users', { cache: 'no-store' }),
          fetch('/api/appointments', { cache: 'no-store' })
        ]);
        const usersData = usersRes.ok ? await usersRes.json() : [];
        const apptData = apptRes.ok ? await apptRes.json() : [];
        const upcoming = Array.isArray(apptData)
          ? apptData.filter((a: any) => {
              const dt = new Date(a.date + 'T' + (a.time || '00:00'));
              const now = new Date();
              const in7 = new Date();
              in7.setDate(now.getDate() + 7);
              return dt >= now && dt <= in7;
            }).length
          : null;
        setStats({ users: usersData.length ?? null, appointments: apptData.length ?? null, upcoming });
      } catch (e) {
        // Silently fail; could add toast if desired
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, [status]);

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
    <main className="min-h-screen">
      <div className="px-6 py-14">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <header className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-4 py-2 mb-6">
              <Shield className="w-4 h-4 text-slate-600" />
              <span className="text-slate-700 font-medium text-sm">
                Administración
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
              Panel de Administración
            </h1>
            <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Clínica Dental Vargas Araya – visión general y accesos rápidos.
            </p>
          </header>

          {/* Stats */}
          <section aria-label="Estadísticas" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-14">
            {[
              {
                key: 'users',
                label: 'Usuarios Totales',
                value: stats.users,
                icon: Users,
                accent: 'from-slate-900 to-slate-700'
              },
              {
                key: 'appointments',
                label: 'Citas Registradas',
                value: stats.appointments,
                icon: CalendarDays,
                accent: 'from-sky-600 to-sky-500'
              },
              {
                key: 'upcoming',
                label: 'Próx. 7 días',
                value: stats.upcoming,
                icon: Activity,
                accent: 'from-emerald-600 to-emerald-500'
              }
            ].map(card => {
              const Icon = card.icon;
              return (
                <div key={card.key} className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-slate-800 to-slate-400" />
                  <div className="p-5 flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${card.accent} flex items-center justify-center shadow-inner`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">{card.label}</p>
                      <p className="text-2xl font-semibold text-slate-900 mt-1">
                        {statsLoading ? <span className="inline-block h-6 w-16 bg-slate-200 rounded animate-pulse" /> : (card.value ?? '—')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Modules Grid */}
          <section aria-label="Módulos administrativos" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mx-auto">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Link 
                  key={module.key} 
                  href={module.href} 
                  className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-4 rounded-2xl"
                >
                  <Card className="border-slate-200 bg-white hover:border-slate-300 transition-all duration-300 hover:shadow-md rounded-2xl h-full relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="pb-2 relative z-10">
                      <div className="flex items-start gap-4 mb-3">
                        <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center group-hover:bg-slate-800 transition-colors shadow-inner">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-slate-800 transition-colors line-clamp-1">
                            {module.title}
                          </CardTitle>
                          <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                            {module.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 pb-5 px-6 relative z-10">
                      <Button 
                        className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-all duration-200 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 text-sm"
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