"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect, Suspense } from "react";
import {
  Star,
  Sparkles,
  ArrowRight,
  Shield,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import { getPatientById } from "@/lib/api/patients";
import { Patient, User as UserType } from "@/lib/types/interfaces";
import { useSession } from "next-auth/react";

const isUser = (userId: any): userId is UserType => {
  return userId && typeof userId === "object" && "fullName" in userId;
};

const HomePageContent = () => {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  
  const [mounted, setMounted] = useState(false);
  const [currentService, setCurrentService] = useState(0);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);

  // Get patientId from URL params
  useEffect(() => {
    const patientIdFromURL = searchParams.get("patientId");
    if (patientIdFromURL) {
      setPatientId(patientIdFromURL);
    }
  }, [searchParams]);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentService((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Check if user is authenticated and has role 'user', then fetch their patient profile
  useEffect(() => {
    const checkUserPatient = async () => {
      if (status === 'authenticated' && session?.user && (session.user as any)?.role === 'user' && !patientId) {
        try {
          setLoading(true);
          const response = await fetch(`/api/patients/by-user?email=${encodeURIComponent(session.user.email || '')}`);
          if (response.ok) {
            const data = await response.json();
            if (data._id) {
              setPatientId(data._id);
            }
          }
        } catch (error) {
          console.error("Error finding patient for user:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    checkUserPatient();
  }, [session, status, patientId]);

  // Fetch patient data when patientId is available
  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId) return;

      try {
        setLoading(true);
        const data = await getPatientById(patientId);
        setPatient(data);
      } catch (error) {
        console.error("Error fetching patient:", error);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatient();
    }
  }, [patientId]);

  const services = [
    {
      icon: Star,
      title: "Ortodoncia",
      desc: "Sonrisas perfectas con tecnología avanzada",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Sparkles,
      title: "Blanqueamiento",
      desc: "Dientes más blancos en una sola sesión",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Shield,
      title: "Implantes",
      desc: "Soluciones permanentes de última generación",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Award,
      title: "Estética Dental",
      desc: "Diseño de sonrisa personalizado",
      color: "from-amber-500 to-orange-500",
    },
  ];

  const DentalParticle = ({ delay = 0 }) => {
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;
    const randomSize = 2 + Math.random() * 4;
    const randomDuration = 6 + Math.random() * 8;
    
    return (
      <div
        className="absolute rounded-full animate-float-dental opacity-20"
        style={{
          width: `${randomSize}px`,
          height: `${randomSize}px`,
          background: `linear-gradient(45deg, rgb(59, 130, 246, 0.6), rgb(34, 197, 94, 0.4))`,
          animationDelay: `${delay}s`,
          animationDuration: `${randomDuration}s`,
          left: `${randomX}%`,
          top: `${randomY}%`,
        }}
      />
    );
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 relative overflow-hidden">
      {/* Partículas animadas */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 80 }).map((_, i) => (
          <DentalParticle key={i} delay={i * 0.2} />
        ))}
      </div>

      {/* Geometric background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CjxnIGZpbGw9InJnYmEoNTksIDEzMCwgMjQ2LCAwLjAzKSIgZmlsbC1ydWxlPSJub256ZXJvIj4KPHBhdGggZD0iTTUwIDUwbDEwLTEwdjIweiIvPgo8L2c+CjwvZz4KPC9zdmc+')] opacity-30"></div>

      <div className="relative z-10 min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 backdrop-blur-sm border border-blue-200 rounded-full px-6 py-3 mb-8 shadow-sm">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-blue-700 font-medium">
                  Clínica Dental Vargas Araya
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-gray-800 via-blue-900 to-gray-900 bg-clip-text text-transparent mb-8 leading-tight">
                Tu sonrisa
                <br />
                <span className="text-4xl md:text-6xl lg:text-7xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  perfecta
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
                Tecnología de vanguardia, atención personalizada y resultados
                extraordinarios en el corazón de Costa Rica
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {loading ? (
                  <Button disabled className="h-14 px-8 bg-gradient-to-r from-cyan-500/50 to-blue-600/50 text-white font-semibold rounded-full">
                    <span>Cargando...</span>
                  </Button>
                ) : patientId ? (
                  <Link href={`/appointments/create?patientId=${patientId}`}>
                    <Button className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 group">
                      <span>Agenda tu cita</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : status === 'authenticated' ? (
                  <Link href="/sign-up">
                    <Button className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 group">
                      <span>Completa tu perfil</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/sign-in">
                    <Button className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 group">
                      <span>Inicia sesión</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}
              </div>

              
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 relative bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Servicios de
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {" "}
                  Excelencia
                </span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Cada tratamiento está diseñado para brindarte la mejor
                experiencia y resultados excepcionales
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => {
                const Icon = service.icon;
                const isActive = index === currentService;

                return (
                  <div
                    key={index}
                    className={`relative group p-8 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl hover:border-blue-300 transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-xl ${
                      isActive ? "border-blue-400 bg-blue-50/50" : ""
                    }`}
                  >
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-blue-50 to-cyan-50 backdrop-blur-sm border-t border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  +1,200
                </div>
                <div className="text-gray-600 text-lg">
                  Pacientes satisfechos
                </div>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  15+
                </div>
                <div className="text-gray-600 text-lg">
                  Años de experiencia
                </div>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  98%
                </div>
                <div className="text-gray-600 text-lg">
                  Satisfacción garantizada
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes float-dental {
          0% {
            transform: translateY(0px) translateX(0px) rotate(0deg) scale(1);
            opacity: 0.1;
          }
          25% {
            transform: translateY(-40px) translateX(20px) rotate(90deg) scale(1.2);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-20px) translateX(-15px) rotate(180deg) scale(0.8);
            opacity: 0.6;
          }
          75% {
            transform: translateY(-60px) translateX(10px) rotate(270deg) scale(1.1);
            opacity: 0.3;
          }
          100% {
            transform: translateY(0px) translateX(0px) rotate(360deg) scale(1);
            opacity: 0.1;
          }
        }

        .animate-float-dental {
          animation: float-dental linear infinite;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
};

// Loading component for Suspense fallback
function LoadingHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando...</p>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
const HomePage = () => {
  return (
    <Suspense fallback={<LoadingHomePage />}>
      <HomePageContent />
    </Suspense>
  );
};

export default HomePage;