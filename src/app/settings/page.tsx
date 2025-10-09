"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Shield, Key, User, Mail, Bell, Palette } from "lucide-react";
import { toast } from "sonner";
import ChangePasswordModal from "@/components/ui/change-password-modal";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Define the animated particles component
  const DentalParticle = ({ delay = 0 }) => (
    <div
      className="absolute w-3 h-3 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full animate-float-dental"
      style={{
        animationDelay: `${delay}s`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
    />
  );

  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-750/40 to-slate-300 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <DentalParticle key={i} delay={i * 0.3} />
          ))}
        </div>
        <div className="relative z-10 flex justify-center items-center min-h-screen">
          <div className="flex flex-col items-center gap-4 p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
            <p className="text-lg font-medium text-cyan-300">Cargando configuración...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-750/40 to-slate-300 relative overflow-hidden flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/5 backdrop-blur-sm border border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Acceso Requerido</CardTitle>
            <CardDescription className="text-slate-300">
              Necesitas iniciar sesión para acceder a la configuración
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const settingsOptions = [
    {
      id: 'security',
      title: 'Seguridad',
      description: 'Gestiona tu contraseña y configuración de seguridad',
      icon: Shield,
      color: 'from-red-500 to-pink-600',
      actions: [
        {
          label: 'Cambiar Contraseña',
          icon: Key,
          onClick: () => setShowChangePasswordModal(true),
          description: 'Actualiza tu contraseña actual'
        }
      ]
    },
    {
      id: 'profile',
      title: 'Perfil',
      description: 'Información personal y preferencias',
      icon: User,
      color: 'from-cyan-500 to-blue-600',
      actions: [
        {
          label: 'Ver Perfil',
          icon: User,
          onClick: () => window.location.href = '/profile',
          description: 'Ver y editar información del perfil'
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Notificaciones',
      description: 'Configuración de alertas y notificaciones',
      icon: Bell,
      color: 'from-emerald-500 to-teal-600',
      actions: [
        {
          label: 'Próximamente',
          icon: Bell,
          onClick: () => toast.info('Funcionalidad en desarrollo'),
          description: 'Configurar preferencias de notificación'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-750/40 to-slate-300 relative overflow-hidden">
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 80 }).map((_, i) => (
          <DentalParticle key={i} delay={i * 0.3} />
        ))}
      </div>

      {/* Geometric background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CjxnIGZpbGw9InJnYmEoNTksIDEzMCwgMjQ2LCAwLjAzKSIgZmlsbC1ydWxlPSJub256ZXJvIj4KPHBhdGggZD0iTTUwIDUwbDEwLTEwdjIweiIvPgo8L2c+CjwvZz4KPC9zdmc+')] opacity-30"></div>

      <div className="relative z-10 min-h-screen container mx-auto py-10 px-4">
        {/* Page header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-full px-6 py-3 mb-8">
            <Settings className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-300 font-medium">Configuración</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent mb-6 leading-tight">
            Configuración
          </h1>
          
          <p className="text-xl text-slate-300 leading-relaxed">
            Gestiona tu cuenta y preferencias personales
          </p>
        </div>

        {/* Settings Cards */}
        <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-1">
          {settingsOptions.map((setting) => {
            const IconComponent = setting.icon;
            return (
              <div key={setting.id} className="p-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl backdrop-blur-sm">
                <Card className="bg-white/5 backdrop-blur-sm border-0 rounded-3xl overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${setting.color} flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                          {setting.title}
                        </CardTitle>
                        <CardDescription className="text-slate-300">
                          {setting.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      {setting.actions.map((action, index) => {
                        const ActionIcon = action.icon;
                        return (
                          <div
                            key={index}
                            onClick={action.onClick}
                            className="flex items-center justify-between p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-all duration-300 cursor-pointer group"
                          >
                            <div className="flex items-center gap-3">
                              <ActionIcon className="w-5 h-5 text-cyan-400" />
                              <div>
                                <p className="font-medium text-white group-hover:text-cyan-300 transition-colors">
                                  {action.label}
                                </p>
                                <p className="text-sm text-slate-400">
                                  {action.description}
                                </p>
                              </div>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors">
                              <svg className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de cambio de contraseña */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />

      <style jsx>{`
        @keyframes float-dental {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
            opacity: 0.6;
          }
        }

        .animate-float-dental {
          animation: float-dental 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}