"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/types/interfaces";
import Link from "next/link";
import { CalendarDays, Mail, User as UserIcon, Phone, MapPin, Clock, Shield, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [patient, setPatient] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
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
  
  // Set mounted state for client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    async function fetchUserData() {
      if (status === "loading") return;
      
      if (!session?.user) {
        toast.error("Por favor inicia sesión para ver tu perfil");
        return;
      }

      try {
        setLoading(true);
        
        // Create a basic user object from session data
        const userObj: User = {
          _id: {} as any, // Using 'any' assertion for ObjectId
          fullName: session.user.name || "",
          email: session.user.email || "",
          role: (session.user.role as "admin" | "doctor" | "user") || "user",
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        setUser(userObj);

        // If user is a patient, try to fetch their patient record
        if (session.user.role === 'user') {
          try {
            const response = await fetch(`/api/patients/by-user?email=${encodeURIComponent(session.user.email || '')}`);
            if (response.ok) {
              const data = await response.json();
              setPatient(data);
            }
          } catch (error) {
            console.error("Error fetching patient data:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Error al cargar los datos del perfil");
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [session, status]);

  if (!mounted || status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-750/40 to-slate-300 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <DentalParticle key={i} delay={i * 0.3} />
          ))}
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CjxnIGZpbGw9InJnYmEoNTksIDEzMCwgMjQ2LCAwLjAzKSIgZmlsbC1ydWxlPSJub256ZXJvIj4KPHBhdGggZD0iTTUwIDUwbDEwLTEwdjIweiIvPgo8L2c+CjwvZz4KPC9zdmc+')] opacity-30"></div>
        <div className="relative z-10 flex justify-center items-center min-h-screen">
          <div className="flex flex-col items-center gap-4 p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
            <p className="text-lg font-medium text-cyan-300">Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-750/40 to-slate-300 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <DentalParticle key={i} delay={i * 0.3} />
          ))}
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CjxnIGZpbGw9InJnYmEoNTksIDEzMCwgMjQ2LCAwLjAzKSIgZmlsbC1ydWxlPSJub256ZXJvIj4KPHBhdGggZD0iTTUwIDUwbDEwLTEwdjIweiIvPgo8L2c+CjwvZz4KPC9zdmc+')] opacity-30"></div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
          <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-8 max-w-md w-full">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-full px-4 py-2 mb-6 mx-auto w-fit">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-300 font-medium">Acceso Restringido</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent mb-4 text-center">
              Perfil Privado
            </h2>
            <p className="text-slate-300 mb-6 text-center">
              Necesitas iniciar sesión para ver tu perfil
            </p>
            <div className="flex justify-center">
              <Link href="/sign-in">
                <Button className="h-12 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 group">
                  <span>Iniciar sesión</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "doctor":
        return "Doctor";
      case "user":
        return "Paciente";
      default:
        return "Usuario";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-500";
      case "doctor":
        return "bg-cyan-500";
      case "user":
        return "bg-emerald-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-750/40 to-slate-300 relative overflow-hidden">
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 100 }).map((_, i) => (
          <DentalParticle key={i} delay={i * 0.3} />
        ))}
      </div>

      {/* Geometric background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CjxnIGZpbGw9InJnYmEoNTksIDEzMCwgMjQ2LCAwLjAzKSIgZmlsbC1ydWxlPSJub256ZXJvIj4KPHBhdGggZD0iTTUwIDUwbDEwLTEwdjIweiIvPgo8L2c+CjwvZz4KPC9zdmc+')] opacity-30"></div>

      <div className="relative z-10 min-h-screen container mx-auto py-10 px-4">
        {/* Page header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-full px-6 py-3 mb-8">
            <UserIcon className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-300 font-medium">Perfil Personal</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent mb-6 leading-tight">
            Bienvenido, 
            <span className="text-3xl md:text-4xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent ml-2">
              {user?.fullName.split(' ')[0]}
            </span>
          </h1>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* User profile card */}
          <div className="md:col-span-1">
            <div className="p-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl backdrop-blur-sm">
              <Card className="bg-white/5 backdrop-blur-sm border-0 rounded-3xl overflow-hidden">
                <CardHeader className="pb-2 text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-cyan-500/30">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName}`} alt={user?.fullName} />
                    <AvatarFallback className="text-xl bg-gradient-to-r from-cyan-500 to-blue-600">
                      {user ? getInitials(user.fullName) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-2xl bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                    {user?.fullName}
                  </CardTitle>
                  <div className="flex justify-center mt-2">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getRoleColor(user?.role || "user")} text-white`}>
                      {getRoleName(user?.role || "user")}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-slate-300">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-cyan-400" />
                    <span>{user?.email}</span>
                  </div>
                  {patient && (
                    <>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-cyan-400" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-cyan-400" />
                        <span>{patient.address}</span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-cyan-400" />
                    <span>Miembro desde {user ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center pt-4">
                  
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Right side content */}
          <div className="md:col-span-2 space-y-8">
            {/* Information cards */}
            <div className="p-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl backdrop-blur-sm">
              <Card className="bg-white/5 backdrop-blur-sm border-0 rounded-3xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-cyan-400" />
                    <span className="bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                      Información Personal
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {patient ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-all duration-300 group">
                        <div className="text-sm font-medium text-cyan-400 mb-1">Edad</div>
                        <div className="text-white text-lg">{patient.age} años</div>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-all duration-300 group">
                        <div className="text-sm font-medium text-cyan-400 mb-1">Teléfono</div>
                        <div className="text-white text-lg">{patient.phone}</div>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-all duration-300 group md:col-span-2">
                        <div className="text-sm font-medium text-cyan-400 mb-1">Dirección</div>
                        <div className="text-white text-lg">{patient.address}</div>
                      </div>
                    </div>
                  ) : user?.role === "user" ? (
                    <div className="text-center py-6">
                      <p className="text-slate-300 mb-4">Todavía no has completado tu perfil de paciente</p>
                      <Link href="/sign-up">
                        <Button className="h-12 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 group">
                          <span>Completar perfil</span>
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="text-slate-300 text-center py-6">
                      La información personal no está disponible para este tipo de cuenta.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Appointments */}
            {user?.role === "user" && patient && (
              <div className="p-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl backdrop-blur-sm">
                <Card className="bg-white/5 backdrop-blur-sm border-0 rounded-3xl overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-cyan-400" />
                      <span className="bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                        Próximas Citas
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* We would fetch appointments here */}
                    <div className="text-center py-6">
                      <p className="text-slate-300 mb-4">No tienes citas programadas</p>
                      <Link href={`/appointments/create?patientId=${patient._id}`}>
                        <Button className="h-12 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 group">
                          <span>Agendar una cita</span>
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Doctor panel */}
            {user?.role === "doctor" && (
              <div className="p-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl backdrop-blur-sm">
                <Card className="bg-white/5 backdrop-blur-sm border-0 rounded-3xl overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <UserIcon className="h-5 w-5 text-cyan-400" />
                      <span className="bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                        Panel del Doctor
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Link href="/doctor/appointments" className="block">
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-all duration-300 group">
                          <h3 className="font-medium bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent mb-2">Citas</h3>
                          <p className="text-sm text-slate-300">Administra tus citas con pacientes</p>
                        </div>
                      </Link>
                      <Link href="/doctor/pacientes" className="block">
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-all duration-300 group">
                          <h3 className="font-medium bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent mb-2">Pacientes</h3>
                          <p className="text-sm text-slate-300">Ver historiales y información de pacientes</p>
                        </div>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Admin panel */}
            {user?.role === "admin" && (
              <div className="p-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl backdrop-blur-sm">
                <Card className="bg-white/5 backdrop-blur-sm border-0 rounded-3xl overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="h-5 w-5 text-cyan-400" />
                      <span className="bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                        Panel de Administrador
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Link href="/admin/users" className="block">
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-all duration-300 group">
                          <h3 className="font-medium bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent mb-2">Usuarios</h3>
                          <p className="text-sm text-slate-300">Administrar usuarios del sistema</p>
                        </div>
                      </Link>
                      <Link href="/admin" className="block">
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-all duration-300 group">
                          <h3 className="font-medium bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent mb-2">Dashboard</h3>
                          <p className="text-sm text-slate-300">Ver estadísticas y reportes</p>
                        </div>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
      
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
