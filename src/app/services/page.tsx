"use client";

import { useState } from "react";
import "./services-animations.css";
import { 
  Smile, 
  Sparkles, 
  Syringe, 
  Stethoscope, 
  Microscope, 
  Baby, 
  Lightbulb, 
  Clock, 
  Check,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Animated dental particles background (same as homepage)
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

const services = [
  {
    id: "ortodoncia",
    title: "Ortodoncia",
    description: "Alineamos tus dientes para lograr una sonrisa perfecta, mejorando tanto la estética como la funcionalidad.",
    icon: <Smile className="h-6 w-6" />,
    details: "Ofrecemos múltiples opciones de tratamientos ortodónticos, desde brackets tradicionales hasta alineadores transparentes. Nuestro equipo de especialistas diseña un plan personalizado para cada paciente, considerando sus necesidades específicas y objetivos estéticos.",
    benefits: [
      "Corrección de la mordida",
      "Mejora la alineación dental",
      "Facilita la limpieza bucal",
      "Previene problemas de ATM"
    ],
    image: "/ortodoncia.jpg",
  },
  {
    id: "blanqueamiento",
    title: "Blanqueamiento Dental",
    description: "Devuelve el brillo natural a tu sonrisa con nuestros tratamientos de blanqueamiento dental profesional.",
    icon: <Sparkles className="h-6 w-6" />,
    details: "Utilizamos técnicas avanzadas de blanqueamiento que no dañan el esmalte dental. Con resultados visibles desde la primera sesión, nuestros tratamientos son seguros y efectivos para eliminar manchas y decoloraciones.",
    benefits: [
      "Resultados rápidos y duraderos",
      "Procedimiento no invasivo",
      "Sin sensibilidad dental posterior",
      "Elimina manchas difíciles"
    ],
    image: "/blanqueamiento.jpg",
  },
  {
    id: "implantes",
    title: "Implantes Dentales",
    description: "Recupera la funcionalidad y estética de tus dientes perdidos con implantes de alta calidad.",
    icon: <Syringe className="h-6 w-6" />,
    details: "Los implantes dentales son la solución más avanzada para reemplazar dientes faltantes. Ofrecen una alternativa permanente y estéticamente superior a las prótesis removibles tradicionales, mejorando tanto la función como la apariencia.",
    benefits: [
      "Función similar a dientes naturales",
      "Previene pérdida ósea",
      "Solución permanente y duradera",
      "No afecta a los dientes adyacentes"
    ],
    image: "/implantes.jpg",
  },
  {
    id: "estetica",
    title: "Estética Dental",
    description: "Diseñamos sonrisas perfectas con tratamientos personalizados que realzan tu belleza natural.",
    icon: <Sparkles className="h-6 w-6" />,
    details: "Nuestros tratamientos de estética dental incluyen carillas, coronas, reconstrucciones y diseño digital de sonrisa. Combinamos arte y ciencia para lograr resultados naturales que transforman su imagen.",
    benefits: [
      "Mejora la proporción dental",
      "Corrige imperfecciones y asimetrías",
      "Resultados naturales y duraderos",
      "Diseño personalizado para cada rostro"
    ],
    image: "/estetica.jpg",
  },
  {
    id: "general",
    title: "Odontología General",
    description: "Cuidamos la salud de tu boca con tratamientos preventivos y curativos de alta calidad.",
    icon: <Microscope className="h-6 w-6" />,
    details: "Nuestra odontología general abarca desde limpiezas profesionales hasta tratamientos de caries, endodoncias y extracciones. Trabajamos con los mejores materiales y tecnologías para garantizar su bienestar bucal.",
    benefits: [
      "Prevención de enfermedades bucales",
      "Diagnóstico temprano de problemas",
      "Tratamientos mínimamente invasivos",
      "Conservación de la dentición natural"
    ],
    image: "/general.jpg",
  },
  {
    id: "pediatrica",
    title: "Odontología Pediátrica",
    description: "Especialistas en el cuidado dental de los más pequeños, en un ambiente amigable y seguro.",
    icon: <Baby className="h-6 w-6" />,
    details: "Nuestra odontopediatría se enfoca en crear experiencias positivas para los niños mientras cuidamos su salud bucal. Ofrecemos tratamientos preventivos, selladores, y educación en higiene oral adaptada a cada edad.",
    benefits: [
      "Ambiente diseñado para niños",
      "Prevención de problemas futuros",
      "Desarrollo de hábitos saludables",
      "Experiencias dentales positivas"
    ],
    image: "/pediatrica.jpg",
  },
];

export default function ServicesPage() {
  const [activeService, setActiveService] = useState(services[0].id);

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
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-full px-6 py-3 mb-8">
              <Stethoscope className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-300 font-medium">
                Clínica Dental Vargas Araya
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent mb-8 leading-tight animate-fade-in">
              Nuestros 
              <span className="text-4xl md:text-6xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {" "}Servicios
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto animate-fade-in-delay">
              Tecnología de vanguardia, atención personalizada y resultados extraordinarios en cada uno de nuestros tratamientos dentales.
            </p>       
          </div>
          
          {/* Service Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {services.slice(0, 3).map((service, index) => (
              <div
                key={service.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="group h-full bg-slate-800/40 border border-slate-700/50 hover:border-cyan-500/30 backdrop-blur-sm rounded-xl hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mb-4 shadow-md shadow-cyan-500/20 group-hover:shadow-lg group-hover:shadow-cyan-500/30 transition-all transform group-hover:scale-110">
                      <div className="text-slate-900">{service.icon}</div>
                    </div>
                    <CardTitle className="text-xl font-semibold text-white">{service.title}</CardTitle>
                    <CardDescription className="text-slate-300/80">{service.description}</CardDescription>
                  </CardHeader>
                  
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Detailed Services Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <div className="inline-block mb-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-sm font-medium">
              Nuestros Tratamientos
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400">
              Servicios Especializados
            </h2>
            <p className="text-slate-300/80 max-w-2xl mx-auto">
              Conozca más sobre nuestros tratamientos especializados y cómo pueden beneficiar su salud dental y calidad de vida.
            </p>
          </div>
          
          {/* Service navigation */}
          <div className="flex flex-wrap justify-center gap-3 mb-14">
            {services.map((service) => (
              <button
                key={service.id}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeService === service.id
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                    : "bg-slate-800/70 text-slate-300 border border-slate-700/50 hover:bg-cyan-500/10 hover:border-cyan-500/30"
                }`}
                onClick={() => setActiveService(service.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="scale-90">{service.icon}</span>
                  <span>{service.title}</span>
                </div>
              </button>
            ))}
          </div>
          
          {/* Active service details */}
          {services.map((service) => (
            <div
              key={service.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-10 ${
                activeService === service.id ? "block animate-fade-in" : "hidden"
              }`}
            >
              <div className="relative h-80 lg:h-auto rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-slate-700/50">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/20 to-blue-500/20 backdrop-blur-sm z-10" />
                {/* Service image or placeholder */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="text-white text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                      <div className="text-3xl text-slate-900">
                        {service.icon}
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-100">
                      {service.title}
                    </h3>
                    <p className="text-slate-300/90 max-w-md mx-auto">
                      Tratamientos de alta calidad con tecnología de vanguardia
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400">
                  {service.title}
                </h3>
                <p className="text-slate-300/80 mb-8 text-lg">
                  {service.details}
                </p>
                
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 mb-8">
                  <h4 className="font-semibold text-lg mb-5 text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    Beneficios
                  </h4>
                  <ul className="space-y-3">
                    {service.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full p-1 mr-3 mt-0.5">
                          <Check className="h-3 w-3 text-slate-900" />
                        </div>
                        <span className="text-slate-300/80">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-block mb-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-sm font-medium">
              Por qué elegirnos
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400">
              La mejor atención dental
            </h2>
            <p className="text-slate-300/80 max-w-2xl mx-auto">
              Nuestra clínica se distingue por ofrecer una experiencia única, combinando atención personalizada con tecnología de vanguardia para el cuidado integral de su salud bucal.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <Card className="h-full bg-slate-800/40 border border-slate-700/50 hover:border-cyan-500/30 backdrop-blur-sm rounded-xl hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-100">
                    <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full p-2 mr-3">
                      <Stethoscope className="h-5 w-5 text-slate-900" />
                    </div>
                    Profesionales Expertos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300/80">
                    Contamos con un equipo de especialistas certificados con amplia experiencia en todas las áreas de la odontología moderna.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <Card className="h-full bg-slate-800/40 border border-slate-700/50 hover:border-cyan-500/30 backdrop-blur-sm rounded-xl hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-100">
                    <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full p-2 mr-3">
                      <Lightbulb className="h-5 w-5 text-slate-900" />
                    </div>
                    Tecnología Avanzada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300/80">
                    Invertimos en las últimas tecnologías para diagnóstico y tratamiento, ofreciendo procedimientos más precisos, rápidos y cómodos para nuestros pacientes.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
              <Card className="h-full bg-slate-800/40 border border-slate-700/50 hover:border-cyan-500/30 backdrop-blur-sm rounded-xl hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-100">
                    <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full p-2 mr-3">
                      <Clock className="h-5 w-5 text-slate-900" />
                    </div>
                    Atención Personalizada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300/80">
                    Cada paciente recibe un plan de tratamiento adaptado a sus necesidades específicas, con seguimiento constante y atención detallada a cada aspecto de su salud bucal.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-600/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 md:p-12 shadow-xl shadow-blue-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-blue-600/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="text-center relative">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-blue-200">
                  ¿Listo para mejorar tu sonrisa?
                </h2>
                <p className="text-slate-300/80 mb-8 text-lg">
                  Agenda tu cita hoy mismo y da el primer paso hacia una sonrisa más saludable y radiante. Nuestro equipo está esperando para atenderte.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
