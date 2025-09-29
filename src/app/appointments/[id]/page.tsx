"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppointmentGuard } from "@/components/AppointmentGuard";
import {
  Calendar,
  Clock,
  User,
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
  X,
} from "lucide-react";
import { getPatientById } from "@/lib/api/patients";
import { getUserById } from "@/lib/api/users";
import { Patient, User as UserType } from "@/lib/types/interfaces";
import AddPrescriptionModal from "@/components/ui/add-prescription-modal";
import AddMaterialModal from "@/components/ui/add-material-modal";
import ConfirmDeleteModal from "@/components/ui/confirm-delete-modal";
import { IMaterial, IPrescription } from "@/app/models/appointments";
import { toast } from "sonner";

interface Appointment {
  _id: string;
  description: string;
  date: string;
  time: string;
  confirmed?: boolean;
  patientId: string;
  createdAt: string;
  updatedAt: string;
  materials?: IMaterial[];
  prescriptions?: IPrescription[];
  doctorReport?: string;
  totalPrice?: number;
}
interface Prescription {
  _id: string;
  medication: string;
  dosage: string;
  duration: string;
  instructions: string;
}

// Type guard para verificar si userId es un objeto User
const isUser = (userId: unknown): userId is UserType => {
  return (
    typeof userId === 'object' &&
    userId !== null &&
    'fullName' in userId
  );
};


export default function AppointmentDetail() {
  const params = useParams();
  const appointmentId = params?.id as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [user, setUser] = useState<UserType | null>(null);

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [materials, setMaterials] = useState<IMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  const [report, setReport] = useState("");
  const [amount, setAmount] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  
  // Estados para el modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeletingMaterial, setIsDeletingMaterial] = useState(false);

  // Funciones para manejar modales de forma exclusiva
  const openPrescriptionModal = () => {
    setShowMaterialModal(false);
    setShowPrescriptionModal(true);
  };

  const openMaterialModal = () => {
    setShowPrescriptionModal(false);
    setShowMaterialModal(true);
  };

  const closePrescriptionModal = () => {
    setShowPrescriptionModal(false);
  };

  const closeMaterialModal = () => {
    setShowMaterialModal(false);
  };

  // Función para refrescar solo las recetas
  const refreshPrescriptions = async () => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/prescriptions`);
      
      if (response.ok) {
        const data = await response.json();
        setPrescriptions(data.prescriptions || []);
        return data.prescriptions || [];
      } else {
        console.error("Error refreshing prescriptions:", response.status);
        return [];
      }
    } catch (error) {
      console.error("Error in refreshPrescriptions:", error);
      return [];
    }
  };

  const handleSaveReport = async () => {
    if (!report.trim()) {
      toast.error('Reporte vacío', {
        description: 'Por favor escribí el reporte médico antes de guardar',
        duration: 3000,
      });
      return;
    }

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
      setAppointment(updatedAppointment);
      
      toast.success('Reporte guardado correctamente', {
        description: 'El reporte médico se ha registrado exitosamente',
        duration: 3000,
      });
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar el reporte', {
        description: 'No se pudo guardar el reporte médico',
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAmount = async () => {
    if (!amount.trim() || isNaN(Number(amount))) {
      toast.error('Monto inválido', {
        description: 'Por favor ingresá un monto válido',
        duration: 3000,
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ totalPrice: Number(amount) }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status} - ${errorText}`);
      }

      const updatedAppointment = await response.json();
      setAppointment(updatedAppointment);
      setAmount('');
      
      toast.success('Monto guardado correctamente', {
        description: `Se registró ₡${Number(amount).toLocaleString('es-CR')}`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error al guardar el precio total:", error);
      toast.error('Error al guardar el monto', {
        description: 'No se pudo registrar el monto de la cita',
        duration: 3000,
      });
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
      // Mostrar toast de carga
      toast.loading('Guardando receta...', {
        id: 'save-prescription',
        duration: 0,
      });

      const response = await fetch(`/api/appointments/${appointmentId}/prescriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prescriptionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al agregar receta');
      }

      const result = await response.json();
      
      // Obtener la nueva receta del resultado
      let newPrescription = result.prescription;
      
      // Si no viene en result.prescription, tomarla del appointment actualizado
      if (!newPrescription && result.appointment && result.appointment.prescriptions) {
        const prescriptions = result.appointment.prescriptions;
        newPrescription = prescriptions[prescriptions.length - 1];
      }
      
      if (newPrescription) {
        setPrescriptions(prev => [...prev, newPrescription]);
      } else {
        console.error('No prescription found in server response');
        throw new Error('No se pudo obtener la receta creada');
      }
      closePrescriptionModal();
      
      // Mostrar toast de éxito
      toast.dismiss('save-prescription');
      toast.success('Receta guardada correctamente', {
        description: `Se agregó ${prescriptionData.medication} a la cita`,
        duration: 3000,
      });

    } catch (error) {
      console.error("Error saving prescription:", error);
      
      // Mostrar toast de error
      toast.dismiss('save-prescription');
      toast.error('Error al guardar la receta', {
        description: error instanceof Error ? error.message : 'No se pudo guardar la receta médica',
        duration: 4000,
      });
    }
  };

  const handleAddMaterial = async (materialData: { name: string; type: string; quantity: number }) => {
    try {
      setIsAddingMaterial(true);
      const response = await fetch(`/api/appointments/${appointmentId}/materials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(materialData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al agregar material');
      }

      const result = await response.json();
      setMaterials(prev => [...prev, result.material]);
      closeMaterialModal();
    } catch (error) {
      console.error('Error adding material:', error);
      alert(`Error al agregar material: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsAddingMaterial(false);
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    setIsDeletingMaterial(true);
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/materials?materialId=${materialId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar material');
      }

      setMaterials(prev => prev.filter(material => material._id !== materialId));
      setShowDeleteModal(false);
      setMaterialToDelete(null);
    } catch (error) {
      console.error('Error deleting material:', error);
      alert('Error al eliminar material');
    } finally {
      setIsDeletingMaterial(false);
    }
  };

  // Función para abrir el modal de confirmación
  const openDeleteModal = (materialId: string, materialName: string) => {
    setMaterialToDelete({ id: materialId, name: materialName });
    setShowDeleteModal(true);
  };

  // Función para cerrar el modal de confirmación
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setMaterialToDelete(null);
  };

  // Función para compartir (copiar URL)
  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      
      // Mostrar toast de éxito
      toast.success('¡Link copiado al portapapeles!', {
        description: 'El enlace de la cita se ha copiado correctamente',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      
      // Fallback para navegadores que no soportan clipboard API
      try {
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        toast.success('¡Link copiado al portapapeles!', {
          description: 'El enlace de la cita se ha copiado correctamente',
          duration: 3000,
        });
      } catch (fallbackError) {
        toast.error('Error al copiar el enlace', {
          description: 'No se pudo copiar el enlace al portapapeles',
          duration: 3000,
        });
      }
    }
  };

  // Función para descargar PDF de la cita
  const handleDownload = async () => {
    if (!appointment || !patient || !user) {
      toast.error('Error al generar documento', {
        description: 'No se pudo obtener la información necesaria',
        duration: 3000,
      });
      return;
    }

    try {
      toast.loading('Preparando documento...', {
        id: 'download-pdf',
        duration: 0,
      });

      // Crear contenido HTML para el PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Cita Médica - ${user.fullName}</title>
          <style>
            @media print {
              body { 
                font-family: 'Arial', sans-serif; 
                margin: 0; 
                padding: 20px;
                color: #333; 
                font-size: 12px;
                line-height: 1.4;
              }
              .no-print { display: none !important; }
              .page-break { page-break-after: always; }
            }
            body { 
              font-family: 'Arial', sans-serif; 
              margin: 20px; 
              color: #333; 
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 3px solid #0ea5e9; 
              padding-bottom: 20px; 
            }
            .header h1 { 
              color: #0ea5e9; 
              margin: 0; 
              font-size: 24px;
              font-weight: bold;
            }
            .header p {
              margin: 5px 0 0 0;
              color: #64748b;
              font-size: 14px;
            }
            .section { 
              margin-bottom: 25px; 
              break-inside: avoid;
            }
            .section h2 { 
              color: #1e293b; 
              border-bottom: 2px solid #e2e8f0; 
              padding-bottom: 8px;
              margin-bottom: 15px;
              font-size: 16px;
              font-weight: bold;
            }
            .info-grid { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
              gap: 15px; 
              margin: 15px 0; 
            }
            .info-item { 
              background: #f8fafc; 
              padding: 15px; 
              border-radius: 8px; 
              border-left: 4px solid #0ea5e9;
            }
            .info-label { 
              font-weight: bold; 
              color: #64748b; 
              font-size: 11px; 
              text-transform: uppercase; 
              margin-bottom: 5px;
            }
            .info-value { 
              font-size: 14px; 
              color: #1e293b;
              font-weight: 500;
            }
            .list-item { 
              background: #f1f5f9; 
              margin: 8px 0; 
              padding: 15px; 
              border-radius: 6px; 
              border-left: 4px solid #0ea5e9;
              break-inside: avoid;
            }
            .list-item strong {
              color: #1e293b;
            }
            .footer { 
              margin-top: 40px; 
              text-align: center; 
              font-size: 11px; 
              color: #64748b; 
              border-top: 1px solid #e2e8f0; 
              padding-top: 20px; 
            }
            .status-confirmed {
              color: #059669;
              font-weight: bold;
            }
            .status-pending {
              color: #d97706;
              font-weight: bold;
            }
            .status-finished {
              color: #0284c7;
              font-weight: bold;
            }
            .print-button {
              background: #0ea5e9;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              font-size: 14px;
              cursor: pointer;
              margin: 20px auto;
              display: block;
            }
            .print-button:hover {
              background: #0284c7;
            }
            @media screen {
              .print-instructions {
                background: #eff6ff;
                border: 1px solid #bfdbfe;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 20px;
                color: #1e40af;
                text-align: center;
              }
            }
            @media print {
              .print-instructions { display: none; }
              .print-button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="print-instructions no-print">
            <p><strong>Para descargar este documento como PDF:</strong></p>
            <p>1. Haga clic en "Imprimir Documento" o presione Ctrl+P</p>
            <p>2. En el destino, seleccione "Guardar como PDF"</p>
            <p>3. Haga clic en "Guardar"</p>
          </div>
          
          <button class="print-button no-print" onclick="window.print()">
            🖨️ Imprimir Documento
          </button>

          <div class="header">
            <h1>Reporte de Cita Médica</h1>
            <p>Clínica Dental VA</p>
            <p>Documento generado el ${new Date().toLocaleDateString('es-CR')} a las ${new Date().toLocaleTimeString('es-CR')}</p>
          </div>

          <div class="section">
            <h2>Información del Paciente</h2>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Nombre Completo</div>
                <div class="info-value">${user.fullName}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Teléfono</div>
                <div class="info-value">${patient.phone || 'No registrado'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Email</div>
                <div class="info-value">${user.email || 'No registrado'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Edad</div>
                <div class="info-value">${patient.age} años</div>
              </div>
              <div class="info-item">
                <div class="info-label">Dirección</div>
                <div class="info-value">${patient.address || 'No registrado'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Detalles de la Cita</h2>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Fecha</div>
                <div class="info-value">${new Date(appointment.date).toLocaleDateString('es-CR')}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Hora</div>
                <div class="info-value">${appointment.time}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Estado</div>
                <div class="info-value ${getAppointmentStatus(appointment).pdfClass}">
                  ${getAppointmentStatus(appointment).status}
                </div>
              </div>
              <div class="info-item">
                <div class="info-label">ID de Cita</div>
                <div class="info-value">${appointment._id}</div>
              </div>
            </div>
            <div class="info-item" style="margin-top: 15px;">
              <div class="info-label">Descripción</div>
              <div class="info-value">${appointment.description}</div>
            </div>
          </div>

          ${appointment.doctorReport ? `
          <div class="section">
            <h2>Reporte Médico</h2>
            <div class="info-item">
              <div class="info-value">${appointment.doctorReport.replace(/\n/g, '<br>')}</div>
            </div>
          </div>` : ''}

          ${prescriptions.length > 0 ? `
          <div class="section">
            <h2>Recetas Médicas</h2>
            ${prescriptions.map(prescription => `
              <div class="list-item">
                <strong>Medicamento:</strong> ${prescription.medication}<br>
                <strong>Dosis:</strong> ${prescription.dosage}<br>
                <strong>Duración:</strong> ${prescription.duration}<br>
                <strong>Instrucciones:</strong> ${prescription.instructions}
              </div>
            `).join('')}
          </div>` : ''}

          ${materials.length > 0 ? `
          <div class="section">
            <h2>Materiales Utilizados</h2>
            ${materials.map(material => `
              <div class="list-item">
                <strong>Material:</strong> ${material.name}<br>
                <strong>Tipo:</strong> ${material.type}<br>
                <strong>Cantidad:</strong> ${material.quantity} unidades
              </div>
            `).join('')}
          </div>` : ''}

          ${appointment.totalPrice ? `
          <div class="section">
            <h2>Información de Pago</h2>
            <div class="info-item">
              <div class="info-label">Total de la Cita</div>
              <div class="info-value">₡${Number(appointment.totalPrice).toLocaleString('es-CR')}</div>
            </div>
          </div>` : ''}

          <div class="footer">
            <p>Clínica Dental VA - Sistema de Gestión de Citas</p>
            <p>Este documento contiene información médica confidencial</p>
          </div>
        </body>
        </html>
      `;

      // Abrir nueva ventana con el documento
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Forzar el foco en la nueva ventana
        printWindow.focus();
        
        toast.dismiss('download-pdf');
        toast.success('Documento abierto', {
          description: 'El documento se ha abierto en una nueva pestaña.',
          duration: 5000,
        });
      } else {
        throw new Error('El navegador bloqueó la ventana emergente. Por favor permite las ventanas emergentes y vuelve a intentar.');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.dismiss('download-pdf');
      toast.error('Error al generar documento', {
        description: error instanceof Error ? error.message : 'No se pudo generar el documento de la cita',
        duration: 4000,
      });
    }
  };

  

  const { id } = useParams();

  useEffect(() => {
    const fetchAllData = async () => {
      if (!appointmentId) return;

      try {
        setLoading(true);

        // 1. Obtener los datos de la cita
        const appointmentResponse = await fetch(`/api/appointments/${appointmentId}`);

        if (!appointmentResponse.ok) {
          const errorText = await appointmentResponse.text();
          throw new Error(`Error ${appointmentResponse.status}: ${errorText}`);
        }

        const appointmentData = await appointmentResponse.json();
        setAppointment(appointmentData);

        // 2. Cargar materiales desde los datos de la cita
        if (appointmentData.materials) {
          setMaterials(appointmentData.materials);
        }

        // 3. Cargar las recetas directamente desde los datos de la cita
        if (appointmentData.prescriptions) {
          setPrescriptions(appointmentData.prescriptions);
        } else {
          setPrescriptions([]);
        }

        // 4. Obtener los datos del paciente
        if (appointmentData.patientId) {
          try {
            const patientData = await getPatientById(appointmentData.patientId);
            setPatient(patientData);

            // 5. Obtener los datos del usuario
            if (patientData.userId && !isUser(patientData.userId)) {
              const userData = await getUserById(patientData.userId.toString());
              setUser(userData);
            } else if (isUser(patientData.userId)) {
              setUser(patientData.userId);
            }
          } catch (patientError) {
            console.error("Error fetching patient or user data:", patientError);
          }
        }
      } catch (error) {
        console.error("Error fetching appointment data:", error);
        toast.error('Error al cargar los datos de la cita', {
          description: 'No se pudo obtener la información de la cita',
          duration: 4000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [appointmentId]);

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

  // Función para calcular el estado real de la cita
  const getAppointmentStatus = (appointment: Appointment) => {
    if (appointment.confirmed) {
      return {
        status: 'Confirmada',
        className: 'bg-green-500/20 text-green-300 border border-green-500/30',
        icon: <CheckCircle className="w-4 h-4" />,
        pdfClass: 'status-confirmed'
      };
    }

    // Combinar fecha y hora para hacer la comparación completa
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
    const now = new Date();

    if (appointmentDateTime < now) {
      return {
        status: 'Finalizada',
        className: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
        icon: <CheckCircle className="w-4 h-4" />,
        pdfClass: 'status-finished'
      };
    } else {
      return {
        status: 'Pendiente',
        className: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
        icon: <AlertCircle className="w-4 h-4" />,
        pdfClass: 'status-pending'
      };
    }
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
    <AppointmentGuard appointmentId={appointmentId}>
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
          <button className="flex items-center gap-3 text-cyan-400 hover:text-cyan-300 transition-colors group cursor-pointer">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <Link href={`/doctor/pacientes/${appointment.patientId}/citas`}>
              Volver a citas
            </Link>
          </button>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              Compartir
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Descargar
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all cursor-pointer">
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
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getAppointmentStatus(appointment).className}`}>
                {getAppointmentStatus(appointment).icon}
                {getAppointmentStatus(appointment).status}
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
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
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
                  <p className="text-blue-300">
                    Medicamentos prescritos ({prescriptions.length} recetas)
                  </p>
                </div>
              </div>

              {/* Add Prescription Button */}
              <button
                onClick={openPrescriptionModal}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl shadow-lg transition-colors cursor-pointer"
              >
                <Pill className="w-4 h-4" />
                Agregar Receta
              </button>
            </div>

            {/* Prescriptions List */}
            <div className="space-y-4">
              {prescriptions.length > 0 ? (
                prescriptions
                  .filter((prescription) => {
                    return prescription && prescription.medication;
                  }) // Filtrar elementos válidos
                  .map((prescription) => (
                  <div
                    key={prescription._id || Math.random()} // Fallback si no hay _id
                    className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Pill className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-lg mb-2">
                          {prescription.medication || 'Medicamento no especificado'}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                          <div>
                            <span className="text-gray-400 text-sm block">
                              Dosis
                            </span>
                            <span className="text-cyan-300 font-medium">
                              {prescription.dosage || 'No especificado'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm block">
                              Duración
                            </span>
                            <span className="text-green-300 font-medium">
                              {prescription.duration || 'No especificado'}
                            </span>
                          </div>
                        </div>
                        <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/30">
                          <span className="text-blue-300 text-sm font-medium block mb-1">
                            Instrucciones:
                          </span>
                          <p className="text-white text-sm">
                            {prescription.instructions || 'No especificado'}
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
              onClose={closePrescriptionModal}
              onSubmit={handleAddPrescription}
            />
          </div>

          {/* Materiales Utilizados */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 group">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
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

              {/* Add Material Button */}
              <button
                onClick={openMaterialModal}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-xl shadow-lg transition-colors cursor-pointer"
              >
                <Package className="w-4 h-4" />
                Agregar Material
              </button>
            </div>

            <div className="space-y-3">
              {materials.length > 0 ? (
                materials.map((material) => (
                  <div
                    key={material._id}
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
                    <div className="flex items-center gap-2">
                      <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-semibold">
                        x{material.quantity}
                      </span>
                      <button
                        onClick={() => material._id && material.name && openDeleteModal(material._id, material.name)}
                        className="w-8 h-8 bg-red-500/20 hover:bg-red-500/40 rounded-lg flex items-center justify-center text-red-400 transition-colors cursor-pointer"
                        title="Eliminar material"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-purple-500/10 rounded-xl p-5 border border-purple-500/30 text-center">
                  <Package className="w-8 h-8 mx-auto text-purple-400 mb-3" />
                  <p className="text-purple-300">
                    No hay materiales registrados
                  </p>
                </div>
              )}
            </div>

            {materials.length > 0 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-purple-300 font-medium">
                    Total de elementos
                  </span>
                  <span className="text-white font-bold text-lg">
                    {materials.reduce((sum, m) => sum + m.quantity, 0)}{" "}
                    unidades
                  </span>
                </div>
              </div>
            )}

            {/* Add Material Modal */}
            <AddMaterialModal
              isOpen={showMaterialModal}
              onClose={closeMaterialModal}
              onSubmit={handleAddMaterial}
              isLoading={isAddingMaterial}
            />
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
              className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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

      {/* Modal de confirmación de eliminación */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={() => materialToDelete && handleDeleteMaterial(materialToDelete.id)}
        materialName={materialToDelete?.name || ''}
        isDeleting={isDeletingMaterial}
      />
      </div>
    </AppointmentGuard>
  );
}
