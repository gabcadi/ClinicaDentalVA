"use client";

import "./about-animations.css";
import { 
  Users,
  History,
  Medal,
  Heart,
  Star,
  ArrowRight,
  Quote,
  Stethoscope,
  GraduationCap,
  Clock,
  CheckCircle,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

// Team member data
const teamMembers = [
  {
    name: "Dra. Verónica Bruno",
    role: "Dentista General y Cirujano",
    bio: "Especialista con más de 20 años de experiencia en odontología general y cirugía oral. Graduado de la Universidad Latina de Costa Rica con múltiples certificaciones internacionales.",
    image: "/doctor1.jpg",
    specialties: ["Cirugía Dental", "Implantes", "Odontología General"]
  },
  {
    name: "Dra. María Araya",
    role: "Ortodoncista",
    bio: "Especialista en ortodoncia con formación avanzada en técnicas modernas. Experta en tratamientos estéticos y correctivos para pacientes de todas las edades.",
    image: "/doctor2.jpg",
    specialties: ["Ortodoncia", "Estética Dental", "Odontopediatría"]
  },
  {
    name: "Dr. Alejandro Soto",
    role: "Endodoncista",
    bio: "Especializado en tratamientos de conducto y terapias para salvar piezas dentales. Formado en las técnicas más avanzadas y mínimamente invasivas.",
    image: "/doctor3.jpg",
    specialties: ["Endodoncia", "Tratamiento de Conductos", "Microscopía Dental"]
  },
  {
    name: "Dra. Laura Jiménez",
    role: "Odontopediatra",
    bio: "Especialista en atención dental infantil con un enfoque centrado en crear experiencias positivas y cómodas para los pacientes más jóvenes.",
    image: "/doctor4.jpg",
    specialties: ["Odontopediatría", "Prevención", "Ortodoncia Interceptiva"]
  }
];

// Testimonials data
const testimonials = [
  {
    name: "Roberto Méndez",
    text: "Excelente atención y profesionalismo. Mi experiencia con los tratamientos de ortodoncia ha sido fantástica, y los resultados superaron mis expectativas.",
    rating: 5
  },
  {
    name: "Carolina Herrera",
    text: "Después de años de miedo al dentista, encontré en Clínica Vargas Araya un equipo que me hizo sentir cómoda y segura. Ahora disfruto de una sonrisa completamente renovada.",
    rating: 5
  },
  {
    name: "Daniel Mora",
    text: "El trato personalizado y la atención a los detalles es lo que distingue a esta clínica. Mi familia y yo somos pacientes desde hace años y siempre quedamos satisfechos.",
    rating: 5
  }
];

export default function AboutPage() {
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
              Sobre 
              <span className="text-4xl md:text-6xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {" "}Nosotros
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto animate-fade-in-delay">
              Más de 15 años de experiencia brindando servicios odontológicos de excelencia 
              en Costa Rica, con un equipo comprometido con su bienestar y salud dental.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
             
              <Button 
                variant="outline" 
                className="h-14 px-8 border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400/50 rounded-full transition-all duration-300"
              >
                Agendar Cita
              </Button>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-24">
            <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm rounded-xl p-6 text-center animate-fade-in-up" style={{animationDelay: '100ms'}}>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">15+</div>
              <div className="text-slate-300 text-sm">Años de experiencia</div>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm rounded-xl p-6 text-center animate-fade-in-up" style={{animationDelay: '200ms'}}>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">1,200+</div>
              <div className="text-slate-300 text-sm">Pacientes atendidos</div>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm rounded-xl p-6 text-center animate-fade-in-up" style={{animationDelay: '300ms'}}>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">8</div>
              <div className="text-slate-300 text-sm">Especialistas</div>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm rounded-xl p-6 text-center animate-fade-in-up" style={{animationDelay: '400ms'}}>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">12</div>
              <div className="text-slate-300 text-sm">Servicios dentales</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-left">
              <div className="inline-block mb-4 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-sm font-medium">
                Nuestra Historia
              </div>
              <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-blue-200">
                Una tradición de excelencia dental
              </h2>
              
              <div className="space-y-6 text-slate-300/80">
                <p>
                  Fundada en 2010 por la Dra. Verónica Bruno, nuestra clínica 
                  nació con la visión de transformar la experiencia dental en Costa Rica, combinando 
                  tecnología de punta con un trato humano y personalizado.
                </p>
                <p>
                  Lo que comenzó como una pequeña clínica en Vargas Araya, San Pedro, ha evolucionado 
                  hasta convertirse en un referente de la odontología moderna en el país, manteniendo 
                  siempre nuestro compromiso con la excelencia y el cuidado integral del paciente.
                </p>
                <p>
                  Hoy, con un equipo multidisciplinario de especialistas y tecnología de última generación, 
                  continuamos nuestra misión de crear sonrisas saludables y radiantes que transformen vidas.
                </p>
              </div>
              
              <div className="mt-8 flex gap-4">
                <div className="flex items-center">
                  <Medal className="w-5 h-5 text-cyan-400 mr-2" />
                  <span className="text-white">Certificación ISO</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mr-2" />
                  <span className="text-white">Acreditación CCSS</span>
                </div>
              </div>
            </div>
            
            <div className="relative animate-fade-in-right">
              <div className="relative h-[500px] w-full rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/30 backdrop-blur-sm z-10" />
                <div className="absolute inset-0 flex items-center justify-center p-8 z-20">
                  <div className="bg-slate-800/60 backdrop-blur-md p-8 rounded-xl border border-slate-700/50 shadow-xl shadow-cyan-900/20 text-center">
                    <History className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-4">Nuestra Misión</h3>
                    <p className="text-slate-300/80 mb-6">
                      Proporcionar atención dental de la más alta calidad en un ambiente cómodo 
                      y acogedor, utilizando las técnicas más avanzadas y un enfoque centrado en el paciente.
                    </p>
                    <div className="pt-6 border-t border-slate-700/50">
                      <h4 className="text-lg font-semibold text-white mb-2">Nuestra Visión</h4>
                      <p className="text-slate-300/80">
                        Ser la clínica dental de referencia en Costa Rica, reconocida por la excelencia 
                        en el servicio, la innovación y el cuidado integral de la salud bucal.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-block mb-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-sm font-medium">
              Nuestros Valores
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400">
              Lo que nos distingue
            </h2>
            <p className="text-slate-300/80 max-w-2xl mx-auto">
              En Clínica Dental Vargas Araya, nos guiamos por valores fundamentales que definen 
              nuestra práctica y el trato que brindamos a cada uno de nuestros pacientes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-800/40 border border-slate-700/50 hover:border-cyan-500/30 backdrop-blur-sm rounded-xl hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-100">
                  <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full p-2 mr-3">
                    <Heart className="h-5 w-5 text-slate-900" />
                  </div>
                  Empatía
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300/80">
                  Nos ponemos en el lugar de nuestros pacientes, entendiendo sus preocupaciones y 
                  necesidades para brindar una atención verdaderamente personalizada.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/40 border border-slate-700/50 hover:border-cyan-500/30 backdrop-blur-sm rounded-xl hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-100">
                  <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full p-2 mr-3">
                    <Medal className="h-5 w-5 text-slate-900" />
                  </div>
                  Excelencia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300/80">
                  Buscamos la excelencia en cada tratamiento, utilizando los mejores materiales y 
                  las técnicas más avanzadas para garantizar resultados óptimos.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/40 border border-slate-700/50 hover:border-cyan-500/30 backdrop-blur-sm rounded-xl hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-100">
                  <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full p-2 mr-3">
                    <GraduationCap className="h-5 w-5 text-slate-900" />
                  </div>
                  Educación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300/80">
                  Creemos en la importancia de educar a nuestros pacientes sobre su salud dental, 
                  empoderándolos para tomar decisiones informadas sobre sus tratamientos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-block mb-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-sm font-medium">
              Equipo Profesional
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400">
              Nuestros especialistas
            </h2>
            <p className="text-slate-300/80 max-w-2xl mx-auto">
              Contamos con un equipo multidisciplinario de profesionales altamente capacitados y 
              comprometidos con brindar la mejor atención dental.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="group">
                <div className="bg-slate-800/40 border border-slate-700/50 group-hover:border-cyan-500/30 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 h-full flex flex-col">
                  <div className="h-64 relative bg-gradient-to-br from-cyan-500/20 to-blue-600/30">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Users className="w-16 h-16 text-cyan-300/50" />
                    </div>
                  </div>
                  <div className="p-6 flex-grow">
                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-cyan-400 mb-3 text-sm">{member.role}</p>
                    <p className="text-slate-300/80 text-sm mb-4">{member.bio}</p>
                    <div>
                      <p className="text-xs font-medium text-slate-400 mb-2">Especialidades:</p>
                      <div className="flex flex-wrap gap-2">
                        {member.specialties.map((specialty, i) => (
                          <span 
                            key={i} 
                            className="text-xs bg-slate-700/50 text-cyan-300 rounded-full px-2 py-1"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-block mb-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-sm font-medium">
              Testimonios
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400">
              Lo que dicen nuestros pacientes
            </h2>
            <p className="text-slate-300/80 max-w-2xl mx-auto">
              La satisfacción de nuestros pacientes es nuestro mayor orgullo. 
              Estas son algunas de sus experiencias en nuestra clínica.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="bg-slate-800/40 border border-slate-700/50 hover:border-cyan-500/30 backdrop-blur-sm rounded-xl hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300"
              >
                <CardHeader>
                  <Quote className="w-10 h-10 text-cyan-400/30" />
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-slate-300/80 italic mb-6">&ldquo;{testimonial.text}&rdquo;</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <h4 className="text-white font-medium">{testimonial.name}</h4>
                      <div className="flex mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < testimonial.rating ? 'text-amber-400' : 'text-gray-500'}`} 
                            fill={i < testimonial.rating ? 'currentColor' : 'none'} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Location Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-left">
              <div className="inline-block mb-4 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-sm font-medium">
                Ubicación
              </div>
              <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-blue-200">
                Visítanos en San Pedro
              </h2>
              
              <div className="space-y-4 text-slate-300/80">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-cyan-400 mt-1" />
                  <div>
                    <h4 className="text-white font-medium">Dirección</h4>
                    <p className="text-slate-300/80">100m Este y 25m Norte del Banco Nacional, Vargas Araya, San Pedro, Montes de Oca, San José, Costa Rica</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-cyan-400 mt-1" />
                  <div>
                    <h4 className="text-white font-medium">Horario de Atención</h4>
                    <p className="text-slate-300/80">
                      Lunes a Viernes: 8:00 AM - 6:00 PM <br />
                      Sábados: 9:00 AM - 1:00 PM <br />
                      Domingos: Cerrado
                    </p>
                  </div>
                </div>
              </div>
              
              <Button className="mt-8 h-12 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 group">
                <span>Cómo llegar</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm rounded-xl overflow-hidden h-[400px]">
              <div className="w-full h-full relative">
                {/* Aquí se puede integrar un mapa real con Google Maps, por ahora un placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/90 to-blue-900/90 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-cyan-400 mx-auto mb-4 opacity-50" />
                    <p className="text-white text-lg font-medium">Mapa de ubicación</p>
                    <p className="text-slate-300/80 max-w-xs mx-auto mt-2">
                      Aquí se mostrará el mapa de Google Maps con la ubicación exacta de la clínica.
                    </p>
                  </div>
                </div>
              </div>
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
                  ¿Listo para cuidar tu sonrisa?
                </h2>
                <p className="text-slate-300/80 mb-8 text-lg">
                  Agenda tu consulta hoy mismo y experimenta una atención dental de primera calidad 
                  con nuestro equipo de especialistas.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 group">
                    <span>Agendar Cita Ahora</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
