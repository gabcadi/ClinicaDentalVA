"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
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
  Edit3,
} from "lucide-react";
import { getPatientById } from "@/lib/api/patients";
import { getUserById } from "@/lib/api/users";
import { Patient, User as UserType } from "@/lib/types/interfaces";
import AddPrescriptionModal from "@/components/ui/add-prescription-modal";

interface Appointment {
  _id: string;
  description: string;
  date: string;
  time: string;
  confirmed?: boolean;
  patientId: string;
  createdAt: string;
  updatedAt: string;
  materials?: string[];
  doctorReport?: string;
  totalPrice?: number;
  prescriptionId?: string[] | null;
}
interface Prescription {
  _id: string;
  medication: string;
  dosage: string;
  duration: string;
  instructions: string;
}

// Type guard para verificar si userId es un objeto User
const isUser = (userId: any): userId is UserType => {
  return userId && typeof userId === "object" && "fullName" in userId;
};

export default function AppointmentDetail() {
  const params = useParams();
  const appointmentId = params?.id as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [user, setUser] = useState<UserType | null>(null);

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  const [report, setReport] = useState("");
  const [amount, setAmount] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  const handleSaveReport = async () => {
    if (!report.trim()) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doctorReport: report }),
      });

      if (!response.ok) {
        throw new Error("No se pudo guardar el reporte médico");
      }

      const updatedAppointment = await response.json();
      setAppointment(updatedAppointment); // Actualiza el estado local
    } catch (error) {
      console.error(error);
      alert("Error al guardar el reporte.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAmount = async () => {
    if (!amount.trim()) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ totalPrice: amount }),
      });

      if (!response.ok) {
        throw new Error("No se pudo guardar el precio total");
      }

      const updatedAppointment = await response.json();
      setAppointment(updatedAppointment); // Actualiza el estado local
    } catch (error) {
      console.error(error);
      alert("Error al guardar el precio total.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddPrescription = async (prescriptionData: {
    medication: string;
    dosage: string;
    duration: string;
    instructions: string;
  }) => {
    try {
      console.log("Saving prescription:", prescriptionData); // Debug log

      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...prescriptionData,
          appointmentId: appointmentId,
        }),
      });

      console.log("Response status:", res.status); // Debug log

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText); // Debug log
        throw new Error(`Failed to save prescription: ${errorText}`);
      }

      const newPrescription = await res.json();
      console.log("Saved prescription:", newPrescription); // Debug log

      setPrescriptions((prev) => [...prev, newPrescription]);
      setShowPrescriptionModal(false);
    } catch (error) {
      console.error("Error saving prescription:", error);
      alert(`Error al guardar la receta: ${error.message}`);
    }
  };
  const mockMaterials = [
    { id: 1, name: "Jeringa desechable 5ml", quantity: 2, type: "Consumible" },
    { id: 2, name: "Gasas estériles", quantity: 5, type: "Material médico" },
    { id: 3, name: "Alcohol isopropílico", quantity: 1, type: "Antiséptico" },
    { id: 4, name: "Guantes de látex", quantity: 2, type: "Protección" },
  ];

  const mockPrescriptions = [
    {
      id: 1,
      medication: "Amoxicilina 500mg",
      dosage: "1 cápsula cada 8 horas",
      duration: "7 días",
      instructions: "Tomar con alimentos para evitar molestias gástricas",
    },
    {
      id: 2,
      medication: "Ibuprofeno 400mg",
      dosage: "1 tableta cada 6 horas",
      duration: "3 días",
      instructions: "Solo si hay dolor o inflamación",
    },
  ];

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch basic appointment data
        const res = await fetch(`/api/appointments/${id}`);
        const data = await res.json();
        setAppointment(data);

        // Get patient data if exists
        if (data?.patientId) {
          const patientData = await getPatientById(data.patientId);
          setPatient(patientData);

          // Type guard for user data
          if (isUser(patientData?.userId)) {
            const userData = await getUserById(patientData.userId._id);
            setUser(userData);
          }
        }

        // Get prescriptions
        const prescriptionsRes = await fetch(
          `/api/prescriptions?appointmentId=${id}`
        );
        const prescriptionsData = await prescriptionsRes.json();
        setPrescriptions(prescriptionsData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!appointmentId) return;

      try {
        setLoading(true);
        console.log("Fetching appointment with ID:", appointmentId);

        // Obtener la cita
        const appointmentResponse = await fetch(
          `/api/appointments/${appointmentId}`
        );
        console.log("Appointment response status:", appointmentResponse.status);
        console.log("Appointment response URL:", appointmentResponse.url);

        if (!appointmentResponse.ok) {
          const errorText = await appointmentResponse.text();
          console.log("Appointment error response:", errorText);
          throw new Error(`Error ${appointmentResponse.status}: ${errorText}`);
        }

        const appointmentData = await appointmentResponse.json();
        console.log("Appointment data received:", appointmentData);
        setAppointment(appointmentData);

        //  Obtener el paciente
        if (appointmentData.patientId) {
          console.log("Fetching patient with ID:", appointmentData.patientId);
          try {
            const patientData = await getPatientById(appointmentData.patientId);
            console.log("Patient data received:", patientData);
            setPatient(patientData);

            // Obtener los datos del usuario si no están populados
            if (patientData.userId && !isUser(patientData.userId)) {
              console.log("Fetching user with ID:", patientData.userId);
              const userData = await getUserById(patientData.userId.toString());
              console.log("User data received:", userData);
              setUser(userData);
            } else if (isUser(patientData.userId)) {
              console.log("User data already populated:", patientData.userId);
              setUser(patientData.userId);
            }
          } catch (patientError) {
            console.error("Error fetching patient or user data:", patientError);
            //  Continuar mostrando la cita aunque no se pueda cargar el paciente
          }
        }
      } catch (error) {
        console.error("Error fetching appointment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  // [New comment] This is the safe way to merge both effects without conflicts:
  // 1. The first effect runs on 'id' changes for basic data loading
  // 2. The second effect runs on 'appointmentId' changes with more detailed logging
  // 3. Both will update the same state, but the second one has better error handling
  // 4. The loading state is only managed by the second effect (production version)

  // [New comment] To prevent race conditions, consider adding:
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  // And modify the effects to skip duplicate fetches

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString("es-CR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
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
          <p className="text-gray-300">
            La cita solicitada no existe o ha sido eliminada.
          </p>
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
            <Link href={`/doctor/pacientes/${appointment.patientId}/citas`}>
              Volver a citas
            </Link>
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
                  <h1 className="text-3xl font-bold text-white mb-1">
                    Detalle de Cita
                  </h1>
                  <p className="text-cyan-300 font-mono text-sm">
                    ID: {appointment._id}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                  appointment.confirmed
                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                }`}
              >
                {appointment.confirmed ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                {appointment.confirmed ? "Confirmada" : "Pendiente"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <span className="text-gray-300 font-medium">Fecha</span>
              </div>
              <p className="text-white text-lg font-semibold capitalize">
                {formatDate(appointment.date)}
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-purple-400" />
                <span className="text-gray-300 font-medium">Hora</span>
              </div>
              <p className="text-white text-lg font-semibold">
                {formatTime(appointment.time)}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-3">Descripción</h3>
            <p className="text-gray-300 leading-relaxed">
              {appointment.description}
            </p>
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
                <h2 className="text-2xl font-bold text-white mb-1">
                  Información del Paciente
                </h2>
                <p className="text-green-300">Datos del usuario registrado</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <span className="text-white font-semibold">
                  {user?.fullName || "Información no disponible"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300 text-sm">Email</span>
                  </div>
                  <span className="text-white font-mono text-sm">
                    {user?.email || "No disponible"}
                  </span>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300 text-sm">Teléfono</span>
                  </div>
                  <span className="text-white font-mono text-sm">
                    {patient?.phone || "No disponible"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                  <span className="text-gray-300 text-sm block mb-1">Edad</span>
                  <span className="text-white font-bold text-lg">
                    {patient?.age ? `${patient.age} años` : "No disponible"}
                  </span>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                  <span className="text-gray-300 text-sm block mb-1">
                    Cédula
                  </span>
                  <span className="text-blue-400 font-bold text-lg">
                    {patient?.id || "No disponible"}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-300 text-sm">Dirección</span>
                </div>
                <span className="text-white text-sm">
                  {patient?.address || "No disponible"}
                </span>
              </div>

              {/* Nota: Alergias y tipo de sangre son datos que no tenemos aún en el modelo */}
              <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-500/30">
                <h4 className="text-orange-300 font-semibold mb-2">
                  Información Médica
                </h4>
                <p className="text-orange-200 text-sm">
                  Los datos médicos detallados (alergias, tipo de sangre) se
                  añadirán en futuras actualizaciones del sistema.
                </p>
              </div>
            </div>
          </div>

          {/* Reporte del Doctor */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Reporte Médico
                </h2>
                <p className="text-orange-300">Diagnóstico y observaciones</p>
              </div>
            </div>

            {appointment?.doctorReport ? (
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-lg mb-2">
                      Reporte Completado
                    </h4>
                    <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/30">
                      <span className="text-green-300 text-sm font-medium block mb-1">
                        Observaciones médicas:
                      </span>
                      <p className="text-white text-sm whitespace-pre-wrap leading-relaxed">
                        {appointment.doctorReport}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-orange-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-lg mb-3">
                      Escribir Reporte
                    </h4>

                    <div className="mb-4">
                      <textarea
                        id="doctorReport"
                        placeholder="Ingrese aquí el reporte médico del paciente..."
                        className="w-full h-40 bg-white/5 text-white placeholder-white/40 text-sm p-4 rounded-xl border border-white/20 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                        value={report}
                        onChange={(e) => setReport(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">
                        {report?.length || 0} caracteres
                      </span>

                      <button
                        onClick={handleSaveReport}
                        disabled={isSaving || !report?.trim()}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isSaving ? (
                          <>
                            <svg
                              className="w-4 h-4 animate-spin"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Guardando...
                          </>
                        ) : (
                          "Guardar Reporte"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recetas */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 group">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Pill className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    Recetas Médicas
                  </h2>
                  <p className="text-blue-300">Medicamentos prescritos</p>
                </div>
              </div>

              {/* Add Prescription Button */}
              <button
                onClick={() => setShowPrescriptionModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl shadow-lg transition-colors"
              >
                <Pill className="w-4 h-4" />
                Agregar Receta
              </button>
            </div>

            {/* Prescriptions List */}
            <div className="space-y-4">
              {prescriptions.length > 0 ? (
                prescriptions.map((prescription) => (
                  <div
                    key={prescription._id}
                    className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Pill className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-lg mb-2">
                          {prescription.medication}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                          <div>
                            <span className="text-gray-400 text-sm block">
                              Dosis
                            </span>
                            <span className="text-cyan-300 font-medium">
                              {prescription.dosage}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm block">
                              Duración
                            </span>
                            <span className="text-green-300 font-medium">
                              {prescription.duration}
                            </span>
                          </div>
                        </div>
                        <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/30">
                          <span className="text-blue-300 text-sm font-medium block mb-1">
                            Instrucciones:
                          </span>
                          <p className="text-white text-sm">
                            {prescription.instructions}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-blue-500/10 rounded-xl p-5 border border-blue-500/30 text-center">
                  <Pill className="w-8 h-8 mx-auto text-blue-400 mb-3" />
                  <p className="text-blue-300">
                    No hay recetas médicas registradas
                  </p>
                </div>
              )}
            </div>

            {/* Add Prescription Modal */}
            <AddPrescriptionModal
              isOpen={showPrescriptionModal}
              onClose={() => setShowPrescriptionModal(false)}
              onSubmit={handleAddPrescription}
            />
          </div>

          {/* Materiales Utilizados */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Materiales Utilizados
                </h2>
                <p className="text-purple-300">Inventario de la consulta</p>
              </div>
            </div>

            <div className="space-y-3">
              {mockMaterials.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">
                        {material.name}
                      </h4>
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
                <span className="text-purple-300 font-medium">
                  Total de elementos
                </span>
                <span className="text-white font-bold text-lg">
                  {mockMaterials.reduce((sum, m) => sum + m.quantity, 0)}{" "}
                  unidades
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Montos */}

        {/* Monto total de la cita */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 group mt-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3m0-6v6m0 0c1.657 0 3-1.343 3-3s-1.343-3-3-3m0 6v2m0-8v-2"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Precio de la Cita
              </h2>
              <p className="text-yellow-300">Monto total en colones</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="₡0.00"
              className="w-full sm:w-64 px-4 py-2 rounded-xl border border-white/20 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={handleSaveAmount}
              disabled={isSaving || !amount.trim()}
              className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Guardando..." : "Guardar Monto"}
            </button>
          </div>

          {appointment?.totalPrice !== undefined && (
            <p className="mt-4 text-white text-sm">
              Monto registrado:{" "}
              <span className="font-bold text-yellow-300">
                ₡{Number(appointment.totalPrice).toLocaleString("es-CR")}
              </span>
            </p>
          )}
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
