"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  Plus,
  Sparkles,
} from "lucide-react";

// Placeholder para tu componente de creación de citas
const CreateAppointmentForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    description: "",
    date: "",
    time: "",
    confirmed: false,
  });

  const handleSubmit = () => {
    // Aquí irá tu lógica de creación
    console.log("Creando cita:", formData);
    onSuccess();
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <FileText className="inline w-4 h-4 mr-2 text-blue-600" />
          Descripción de la cita
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
          rows={3}
          placeholder="Describe el motivo de tu cita..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-2 text-blue-600" />
            Fecha
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            required
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Clock className="inline w-4 h-4 mr-2 text-blue-600" />
            Hora
          </label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            required
          />
        </div>
      </div>

      

      <button
        onClick={handleSubmit}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2"
      >
        <Plus className="w-5 h-5" />
        <span>Crear Nueva Cita</span>
        <Sparkles className="w-5 h-5" />
      </button>
    </div>
  );
};
export default function CreateAppointments() {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header con efecto glassmorphism */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-300/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>

        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-xl">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Nueva Cita
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Programa tu cita de manera rápida y sencilla. Completa los datos y
              nosotros nos encargamos del resto.
            </p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-6 pb-16 -mt-8">
        {/* Tarjeta principal con glassmorphism */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Barra decorativa superior */}
          <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

          <div className="p-8 md:p-12">
            {/* Indicadores de progreso */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full text-sm font-bold">
                  1
                </div>
                <div className="w-16 h-1 bg-blue-600 rounded-full"></div>
                <div className="flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-500 rounded-full text-sm font-bold">
                  2
                </div>
                <div className="w-16 h-1 bg-gray-200 rounded-full"></div>
                <div className="flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-500 rounded-full text-sm font-bold">
                  3
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Información de la Cita
              </h2>
              <p className="text-gray-600">
                Proporciona los detalles necesarios para tu nueva cita
              </p>
            </div>

            {/* Aquí va tu componente de creación */}
            <CreateAppointmentForm onSuccess={handleSuccess} />
          </div>
        </div>

        {/* Sección de características vanguardista */}
        <div className="mt-20 relative">
          {/* Elementos decorativos de fondo */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
          </div>

          {/* Título de sección con efecto neón */}
          <div className="text-center mb-16 relative">
            <div className="inline-block relative">
              <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4 tracking-tight">
                Tecnología Avanzada
              </h2>
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/50 via-blue-500/50 to-purple-600/50 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experimenta el futuro de la gestión de citas con nuestra
              plataforma de última generación
            </p>
          </div>

          {/* Grid de características con diseño futurista */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            {/* Tarjeta 1 */}
            <div className="h-full">
              <div className="group relative h-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-600 rounded-3xl blur-sm opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-gradient-to-br from-white via-green-50/80 to-emerald-50/60 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-2xl hover:shadow-green-500/25 transition-all duration-500 group-hover:scale-105 min-h-[420px] h-full flex flex-col justify-between">
                  <div>
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-green-500/50 transition-all duration-300">
                        <CheckCircle className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="absolute top-0 left-0 w-16 h-16 bg-green-400/30 rounded-2xl animate-ping"></div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors duration-300">
                      IA Confirmación Instantánea
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Algoritmos inteligentes procesan y confirman tu cita en
                      tiempo real con validación automática
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-green-600 font-semibold">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    Sistema Activo 24/7
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta 2 */}
            <div className="h-full">
              <div className="group relative h-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-3xl blur-sm opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-gradient-to-br from-white via-cyan-50/80 to-blue-50/60 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 group-hover:scale-105 min-h-[420px] h-full flex flex-col justify-between">
                  <div>
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-cyan-500/50 transition-all duration-300">
                        <Calendar className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full animate-bounce"></div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      Flexibilidad Cuántica
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Modifica, reagenda o cancela instantáneamente con
                      sincronización en tiempo real multicanal
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-blue-600 font-semibold">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                      Sync Instantáneo
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-1 h-6 bg-gradient-to-t from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
                      <div className="w-1 h-4 bg-gradient-to-t from-cyan-400 to-blue-500 rounded-full animate-pulse delay-100"></div>
                      <div className="w-1 h-8 bg-gradient-to-t from-cyan-400 to-blue-500 rounded-full animate-pulse delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta 3 */}
            <div className="h-full">
              <div className="group relative h-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-500 to-violet-600 rounded-3xl blur-sm opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-gradient-to-br from-white via-purple-50/80 to-pink-50/60 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 group-hover:scale-105 min-h-[420px] h-full flex flex-col justify-between">
                  <div>
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 via-pink-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-purple-500/50 transition-all duration-300 overflow-hidden">
                        <Sparkles className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                      </div>
                      <div className="absolute top-2 right-2 w-3 h-3 bg-pink-400 rounded-full animate-ping"></div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                      Experiencia Inmersiva
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Lorem ipsum dolor sit amet, consectetur adipisci elit, sed
                      eiusmod
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-purple-600 font-semibold">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
                      PLACEHOLDER
                    </div>
                    <div className="text-xs text-gray-500 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full border border-purple-200">
                      VA
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas flotantes con efecto de cristal */}
          <div className="mt-16 relative">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/30 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/40 transition-all duration-300 group">
                <div className="text-center">
                  <div className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                    99.9%
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Uptime
                  </div>
                </div>
              </div>

              <div className="bg-white/30 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/40 transition-all duration-300 group">
                <div className="text-center">
                  <div className="text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                    &lt;1s
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Respuesta
                  </div>
                </div>
              </div>

              <div className="bg-white/30 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/40 transition-all duration-300 group">
                <div className="text-center">
                  <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                    24/7
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Soporte
                  </div>
                </div>
              </div>

              <div className="bg-white/30 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/40 transition-all duration-300 group">
                <div className="text-center">
                  <div className="text-3xl font-black bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                    256
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Bit SSL
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to action futurista */}
          <div className="mt-16 text-center relative">
            <div className="inline-block relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition duration-1000 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white px-12 py-6 rounded-2xl border border-white/20 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500">
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-lg font-semibold">
                    Sistema en línea y operativo
                  </span>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse delay-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notificación de éxito */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg transform transition-all duration-300 animate-bounce">
          ¡Cita creada exitosamente!
        </div>
      )}

      {/* Partículas decorativas mejoradas */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Partículas principales */}
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-cyan-400/40 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-20 w-1 h-1 bg-blue-400/50 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-purple-400/40 rounded-full animate-ping delay-500"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-pink-400/50 rounded-full animate-pulse delay-1000"></div>

        {/* Nuevas partículas vanguardistas */}
        <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce opacity-30"></div>
        <div className="absolute top-3/4 right-1/3 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-pulse delay-700 opacity-40"></div>
        <div className="absolute bottom-1/2 left-20 w-1.5 h-1.5 bg-green-400/40 rounded-full animate-ping delay-300"></div>

        {/* Líneas de conexión animadas */}
        <div className="absolute top-1/3 left-1/2 w-16 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/2 w-12 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}
