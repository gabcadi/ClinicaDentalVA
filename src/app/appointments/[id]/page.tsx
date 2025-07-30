'use client';

import { useEffect, useState } from 'react';
import { 
  Calendar, 
  Clock, 
  FileText, 
  User, 
  Stethoscope,
  Pill,
  Package,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Download,
  Share2,
  Edit3
} from 'lucide-react';

interface Appointment {
  _id: string;
  description: string;
  date: string;
  time: string;
  confirmed?: boolean;
}

export default function AppointmentDetail({ appointmentId = "683f59803cc1403b3a23af26" }) {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  // Datos mock para las funcionalidades futuras
  const mockPatientData = {
    name: "Ana García Rodríguez",
    email: "ana.garcia@email.com",
    phone: "+506 8888-8888",
    age: 32,
    bloodType: "O+",
    allergies: ["Penicilina", "Acido hialuronico"],
    emergencyContact: "Carlos García - +506 7777-7777"
  };

  const mockDoctorData = {
    name: "Dr. Roberto Méndez",
    specialty: "Medicina General",
    experience: "15 años",
    rating: 4.9,
    bio: "Especialista en medicina preventiva con más de 15 años de experiencia. Graduado de la Universidad de Costa Rica con especialización en medicina familiar.",
    photo: "/api/placeholder/80/80"
  };

  const mockMaterials = [
    { id: 1, name: "Jeringa desechable 5ml", quantity: 2, type: "Consumible" },
    { id: 2, name: "Gasas estériles", quantity: 5, type: "Material médico" },
    { id: 3, name: "Alcohol isopropílico", quantity: 1, type: "Antiséptico" },
    { id: 4, name: "Guantes de látex", quantity: 2, type: "Protección" }
  ];

  const mockPrescriptions = [
    {
      id: 1,
      medication: "Amoxicilina 500mg",
      dosage: "1 cápsula cada 8 horas",
      duration: "7 días",
      instructions: "Tomar con alimentos para evitar molestias gástricas"
    },
    {
      id: 2,
      medication: "Ibuprofeno 400mg",
      dosage: "1 tableta cada 6 horas",
      duration: "3 días",
      instructions: "Solo si hay dolor o inflamación"
    }
  ];

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        // Simular llamada a API usando el ID proporcionado
        setTimeout(() => {
          setAppointment({
            _id: appointmentId,
            description: "Consulta médica general - Revisión periódica",
            date: "2025-06-05",
            time: "18:22",
            confirmed: true,
            __v: 0
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching appointment:', error);
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString('es-CR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-purple-400/20 border-b-purple-400 rounded-full animate-spin animate-reverse"></div>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold mb-2">Cita no encontrada</h2>
          <p className="text-gray-300">La cita solicitada no existe o ha sido eliminada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <button className="flex items-center gap-3 text-cyan-400 hover:text-cyan-300 transition-colors group">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-medium">Volver a citas</span>
          </button>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-all">
              <Share2 className="w-4 h-4" />
              Compartir
            </button>
            <button className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-all">
              <Download className="w-4 h-4" />
              Descargar
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all">
              <Edit3 className="w-4 h-4" />
              Editar
            </button>
          </div>
        </div>

        {/* Título principal con información de la cita */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">Detalle de Cita</h1>
                  <p className="text-cyan-300 font-mono text-sm">ID: {appointment._id}</p>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                appointment.confirmed 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
              }`}>
                {appointment.confirmed ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {appointment.confirmed ? 'Confirmada' : 'Pendiente'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <span className="text-gray-300 font-medium">Fecha</span>
              </div>
              <p className="text-white text-lg font-semibold capitalize">{formatDate(appointment.date)}</p>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-purple-400" />
                <span className="text-gray-300 font-medium">Hora</span>
              </div>
              <p className="text-white text-lg font-semibold">{formatTime(appointment.time)}</p>
            </div>

            
          </div>

          <div className="mt-6 bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-3">Descripción</h3>
            <p className="text-gray-300 leading-relaxed">{appointment.description}</p>
          </div>
        </div>

        {/* Grid principal con las 4 secciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Referencia al Usuario */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Información del Paciente</h2>
                <p className="text-green-300">Datos del usuario registrado</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <span className="text-gray-300">Nombre completo</span>
                <span className="text-white font-semibold">{mockPatientData.name}</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300 text-sm">Email</span>
                  </div>
                  <span className="text-white font-mono text-sm">{mockPatientData.email}</span>
                </div>
                
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300 text-sm">Teléfono</span>
                  </div>
                  <span className="text-white font-mono text-sm">{mockPatientData.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                  <span className="text-gray-300 text-sm block mb-1">Edad</span>
                  <span className="text-white font-bold text-lg">{mockPatientData.age} años</span>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                  <span className="text-gray-300 text-sm block mb-1">Tipo de sangre</span>
                  <span className="text-red-400 font-bold text-lg">{mockPatientData.bloodType}</span>
                </div>
              </div>

              <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-500/30">
                <h4 className="text-orange-300 font-semibold mb-2">Alergias conocidas</h4>
                <div className="flex flex-wrap gap-2">
                  {mockPatientData.allergies.map((allergy, index) => (
                    <span key={index} className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm">
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Materiales Utilizados */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Materiales Utilizados</h2>
                <p className="text-purple-300">Inventario de la consulta</p>
              </div>
            </div>

            <div className="space-y-3">
              {mockMaterials.map((material) => (
                <div key={material.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{material.name}</h4>
                      <p className="text-gray-400 text-sm">{material.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-semibold">
                      x{material.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/30">
              <div className="flex items-center justify-between">
                <span className="text-purple-300 font-medium">Total de elementos</span>
                <span className="text-white font-bold text-lg">{mockMaterials.reduce((sum, m) => sum + m.quantity, 0)} unidades</span>
              </div>
            </div>
          </div>

          {/* Recetas */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Pill className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Recetas Médicas</h2>
                <p className="text-blue-300">Medicamentos prescritos</p>
              </div>
            </div>

            <div className="space-y-4">
              {mockPrescriptions.map((prescription) => (
                <div key={prescription.id} className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Pill className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-lg mb-2">{prescription.medication}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <div>
                          <span className="text-gray-400 text-sm block">Dosis</span>
                          <span className="text-cyan-300 font-medium">{prescription.dosage}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm block">Duración</span>
                          <span className="text-green-300 font-medium">{prescription.duration}</span>
                        </div>
                      </div>
                      <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/30">
                        <span className="text-blue-300 text-sm font-medium block mb-1">Instrucciones:</span>
                        <p className="text-white text-sm">{prescription.instructions}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Descripción del Doctor */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Médico Tratante</h2>
                <p className="text-orange-300">Información profesional</p>
              </div>
            </div>

            <div className="flex items-start gap-6 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                DR
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-xl mb-1">{mockDoctorData.name}</h3>
                <p className="text-orange-300 font-medium mb-2">{mockDoctorData.specialty}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-300">Lic. {mockDoctorData.license}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-300">{mockDoctorData.experience}</span>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white font-semibold">{mockDoctorData.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <h4 className="text-white font-semibold mb-3">Biografía Profesional</h4>
              <p className="text-gray-300 leading-relaxed text-sm">{mockDoctorData.bio}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl font-bold text-orange-400 mb-1">15+</div>
                <div className="text-gray-300 text-xs">Años exp.</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl font-bold text-green-400 mb-1">2.4K</div>
                <div className="text-gray-300 text-xs">Pacientes</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl font-bold text-blue-400 mb-1">98%</div>
                <div className="text-gray-300 text-xs">Satisfacción</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partículas decorativas */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-cyan-400/40 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-20 w-1 h-1 bg-purple-400/50 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-blue-400/40 rounded-full animate-ping delay-500"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-pink-400/50 rounded-full animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}