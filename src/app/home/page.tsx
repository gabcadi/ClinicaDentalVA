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
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const HomePageContent = () => {
  const [mounted, setMounted] = useState(false);
  const [currentService, setCurrentService] = useState(0);
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId");


  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentService((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-750/40 to-slate-300 relative overflow-hidden">
      {/* Partículas animadas */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 100 }).map((_, i) => (
          <DentalParticle key={i} delay={i * 0.3} />
        ))}
      </div>

      {/* Geometric background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CjxnIGZpbGw9InJnYmEoNTksIDEzMCwgMjQ2LCAwLjAzKSIgZmlsbC1ydWxlPSJub256ZXJvIj4KPHBhdGggZD0iTTUwIDUwbDEwLTEwdjIweiIvPgo8L2c+CjwvZz4KPC9zdmc+')] opacity-30"></div>

      <div className="relative z-10 min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-full px-6 py-3 mb-8">
                <Shield className="w-5 h-5 text-cyan-400" />

                <span className="text-cyan-300 font-medium">
                  Clínica Dental Vargas Araya
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent mb-8 leading-tight">
                Tu sonrisa
                <br />
                <span className="text-4xl md:text-6xl lg:text-7xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  perfecta
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto">
                Tecnología de vanguardia, atención personalizada y resultados
                extraordinarios en el corazón de Costa Rica
              </p>



              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {patientId && (
                  <Link href={`/appointments/create/${patientId}`}>
                    <Button className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 group">
                      <span>Agenda tu cita</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}

                <Button
                  variant="outline"
                  className="h-14 px-8 border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400/50 rounded-full transition-all duration-300"
                >
                  Ver servicios
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Showcase */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Servicios de
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {" "}
                  Excelencia
                </span>
              </h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
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
                    className={`relative group p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl hover:border-cyan-400/30 transition-all duration-500 hover:scale-105 ${
                      isActive ? "border-cyan-400/50 bg-white/10" : ""
                    }`}
                  >
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {service.title}
                    </h3>
                    <p className="text-slate-300 leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats  */}
        <section className="py-20 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                  +1,200
                </div>
                <div className="text-slate-300 text-lg">
                  Pacientes satisfechos
                </div>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                  15+
                </div>
                <div className="text-slate-300 text-lg">
                  Años de experiencia
                </div>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                  98%
                </div>
                <div className="text-slate-300 text-lg">
                  Satisfacción garantizada
                </div>
              </div>
            </div>
          </div>
        </section>
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
};

// Loading component for Suspense fallback
function LoadingHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
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
