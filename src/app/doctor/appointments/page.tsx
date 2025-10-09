'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { DoctorGuard } from '@/components/DoctorGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  User, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  CheckCircle, 
  AlertCircle,
  Mail,
  Phone,
  FileText,
  CalendarDays
} from 'lucide-react';

interface Patient {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

interface Appointment {
  _id: string;
  description: string;
  date: string;
  time: string;
  confirmed?: boolean;
  patientId?: string;
  patient?: Patient;
  totalPrice?: number;
  doctorReport?: string;
}

// Función para calcular el estado real de la cita
const getAppointmentStatus = (appointment: Appointment) => {
	if (appointment.confirmed) {
		return {
			status: 'Confirmado',
			variant: 'success' as const,
			icon: CheckCircle
		};
	}

	// Combinar fecha y hora para hacer la comparación completa
	const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
	const now = new Date();

	if (appointmentDateTime < now) {
		return {
			status: 'Finalizada',
			variant: 'secondary' as const,
			icon: CheckCircle
		};
	} else {
		return {
			status: 'Pendiente',
			variant: 'warning' as const,
			icon: AlertCircle
		};
	}
};

// Función para formatear fecha
const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString('es-ES', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
};

// Función para formatear hora
const formatTime = (timeString: string) => {
	const [hours, minutes] = timeString.split(':');
	const hour = parseInt(hours);
	const ampm = hour >= 12 ? 'PM' : 'AM';
	const displayHour = hour % 12 || 12;
	return `${displayHour}:${minutes} ${ampm}`;
};

export default function ManageAppointments() {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editForm, setEditForm] = useState({ 
		description: '', 
		date: '', 
		time: '', 
		confirmed: false,
		totalPrice: 0,
		doctorReport: ''
	});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchAppointments();
	}, []);

	const fetchAppointments = async () => {
		setLoading(true);
		try {
			const res = await fetch('/api/appointments?populate=patient');
			const data = await res.json();
			setAppointments(data);
		} catch (error) {
			toast.error('Error al cargar las citas');
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		try {
			const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
			if (res.ok) {
				toast.success('Cita eliminada exitosamente');
				fetchAppointments();
			} else {
				toast.error('Error al eliminar la cita');
			}
		} catch (error) {
			toast.error('Error al eliminar la cita');
		}
	};

	const handleEdit = (appt: Appointment) => {
		setEditingId(appt._id);
		setEditForm({
			description: appt.description,
			date: appt.date,
			time: appt.time,
			confirmed: appt.confirmed ?? false,
			totalPrice: appt.totalPrice ?? 0,
			doctorReport: appt.doctorReport ?? ''
		});
	};

	const handleSave = async (id: string, appointment: Appointment) => {
		if (!editForm.description || !editForm.date || !editForm.time) {
			toast.error('Todos los campos son obligatorios');
			return;
		}

		// Verificar si la fecha/hora cambió
		const originalDateTime = `${appointment.date}T${appointment.time}`;
		const newDateTime = `${editForm.date}T${editForm.time}`;
		const dateTimeChanged = originalDateTime !== newDateTime;

		try {
			const res = await fetch(`/api/appointments/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...editForm,
					dateTimeChanged,
					patientEmail: appointment.patient?.email
				}),
			});

			if (res.ok) {
				toast.success('Cita modificada exitosamente');
				if (dateTimeChanged && appointment.patient?.email) {
					toast.success('Se envió notificación al paciente sobre el cambio');
				}
			} else {
				toast.error('Error al actualizar la cita');
			}
		} catch (error) {
			console.error('Error al actualizar la cita:', error);
			toast.error('Error al actualizar la cita');
		}

		setEditingId(null);
		fetchAppointments();
	};

	const handleCancel = () => {
		setEditingId(null);
		setEditForm({ 
			description: '', 
			date: '', 
			time: '', 
			confirmed: false,
			totalPrice: 0,
			doctorReport: ''
		});
	};

	if (loading) {
		return (
			<DoctorGuard>
				<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
					<div className="max-w-7xl mx-auto">
						<div className="flex items-center justify-center h-64">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
						</div>
					</div>
				</div>
			</DoctorGuard>
		);
	}

	return (
		<DoctorGuard>
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
				<div className="max-w-7xl mx-auto">
					{/* Header */}
					<div className="mb-8">
						<div className="flex items-center gap-3 mb-2">
							<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
								<CalendarDays className="w-6 h-6 text-white" />
							</div>
							<div>
								<h1 className="text-3xl font-bold text-slate-800">Gestión de Citas</h1>
								<p className="text-slate-600">Administra y modifica las citas de tus pacientes</p>
							</div>
						</div>
					</div>

					{/* Statistics */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						<Card className="bg-white/80 backdrop-blur-sm border-slate-200">
							<CardContent className="p-6">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
										<Calendar className="w-6 h-6 text-blue-600" />
									</div>
									<div>
										<p className="text-2xl font-bold text-slate-800">{appointments.length}</p>
										<p className="text-slate-600">Total de Citas</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-white/80 backdrop-blur-sm border-slate-200">
							<CardContent className="p-6">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
										<CheckCircle className="w-6 h-6 text-green-600" />
									</div>
									<div>
										<p className="text-2xl font-bold text-slate-800">
											{appointments.filter(a => a.confirmed).length}
										</p>
										<p className="text-slate-600">Confirmadas</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-white/80 backdrop-blur-sm border-slate-200">
							<CardContent className="p-6">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
										<AlertCircle className="w-6 h-6 text-orange-600" />
									</div>
									<div>
										<p className="text-2xl font-bold text-slate-800">
											{appointments.filter(a => !a.confirmed).length}
										</p>
										<p className="text-slate-600">Pendientes</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Appointments Grid */}
					<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
						{appointments.map((appt, index) => {
							const status = getAppointmentStatus(appt);
							const StatusIcon = status.icon;
							
							return (
								<Card key={appt._id} className="appointment-card bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
									<CardHeader className="pb-3">
										<div className="flex items-start justify-between">
											<div className="flex items-center gap-2">
												<StatusIcon className="w-5 h-5 text-slate-600" />
												<Badge variant={status.variant}>
													{status.status}
												</Badge>
											</div>
											<div className="flex gap-1">
												{editingId === appt._id ? (
													<>
														<Button 
															size="sm" 
															onClick={() => handleSave(appt._id, appt)}
															className="bg-green-600 hover:bg-green-700"
														>
															<Save className="w-4 h-4" />
														</Button>
														<Button 
															size="sm" 
															variant="outline"
															onClick={handleCancel}
														>
															<X className="w-4 h-4" />
														</Button>
													</>
												) : (
													<>
														<Button 
															size="sm" 
															variant="outline"
															onClick={() => handleEdit(appt)}
														>
															<Edit className="w-4 h-4" />
														</Button>
														<Button 
															size="sm" 
															variant="outline"
															onClick={() => handleDelete(appt._id)}
															className="text-red-600 hover:text-red-700 hover:bg-red-50"
														>
															<Trash2 className="w-4 h-4" />
														</Button>
													</>
												)}
											</div>
										</div>
									</CardHeader>

									<CardContent className="space-y-4">
										{/* Patient Info */}
										{appt.patient && (
											<div className="bg-slate-50 rounded-lg p-3">
												<div className="flex items-center gap-2 mb-2">
													<User className="w-4 h-4 text-slate-600" />
													<span className="font-medium text-slate-800">Paciente</span>
												</div>
												<p className="text-slate-700 font-medium">{appt.patient.name}</p>
												{appt.patient.email && (
													<div className="flex items-center gap-2 mt-1">
														<Mail className="w-3 h-3 text-slate-500" />
														<span className="text-sm text-slate-600">{appt.patient.email}</span>
													</div>
												)}
												{appt.patient.phone && (
													<div className="flex items-center gap-2 mt-1">
														<Phone className="w-3 h-3 text-slate-500" />
														<span className="text-sm text-slate-600">{appt.patient.phone}</span>
													</div>
												)}
											</div>
										)}

										{/* Description */}
										<div>
											<div className="flex items-center gap-2 mb-2">
												<FileText className="w-4 h-4 text-slate-600" />
												<span className="font-medium text-slate-800">Descripción</span>
											</div>
											{editingId === appt._id ? (
												<Input
													value={editForm.description}
													onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
													placeholder="Descripción de la cita"
												/>
											) : (
												<p className="text-slate-700">{appt.description}</p>
											)}
										</div>

										{/* Date & Time */}
										<div className="grid grid-cols-2 gap-3">
											<div>
												<div className="flex items-center gap-2 mb-2">
													<Calendar className="w-4 h-4 text-slate-600" />
													<span className="font-medium text-slate-800">Fecha</span>
												</div>
												{editingId === appt._id ? (
													<Input
														type="date"
														value={editForm.date}
														onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
													/>
												) : (
													<p className="text-slate-700 text-sm">{formatDate(appt.date)}</p>
												)}
											</div>
											<div>
												<div className="flex items-center gap-2 mb-2">
													<Clock className="w-4 h-4 text-slate-600" />
													<span className="font-medium text-slate-800">Hora</span>
												</div>
												{editingId === appt._id ? (
													<Input
														type="time"
														value={editForm.time}
														onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
													/>
												) : (
													<p className="text-slate-700 text-sm">{formatTime(appt.time)}</p>
												)}
											</div>
										</div>

										{/* Confirmed Status */}
										{editingId === appt._id && (
											<div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
												<input
													type="checkbox"
													id={`confirmed-${appt._id}`}
													checked={editForm.confirmed}
													onChange={(e) => setEditForm({ ...editForm, confirmed: e.target.checked })}
													className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
												/>
												<label htmlFor={`confirmed-${appt._id}`} className="text-sm font-medium text-slate-700">
													Cita confirmada
												</label>
											</div>
										)}

										{/* Additional Fields when editing */}
										{editingId === appt._id && (
											<>
												<div>
													<label className="block text-sm font-medium text-slate-700 mb-2">
														Precio Total (₡)
													</label>
													<Input
														type="number"
														value={editForm.totalPrice}
														onChange={(e) => setEditForm({ ...editForm, totalPrice: parseFloat(e.target.value) || 0 })}
														placeholder="0"
														min="0"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-slate-700 mb-2">
														Reporte del Doctor
													</label>
													<textarea
														value={editForm.doctorReport}
														onChange={(e) => setEditForm({ ...editForm, doctorReport: e.target.value })}
														placeholder="Agregar notas o observaciones..."
														className="w-full min-h-[80px] px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
													/>
												</div>
											</>
										)}

										{/* Display additional info when not editing */}
										{editingId !== appt._id && (
											<>
												{appt.totalPrice && appt.totalPrice > 0 && (
													<div className="bg-green-50 p-3 rounded-lg">
														<p className="text-sm font-medium text-green-800">
															Precio: ₡{appt.totalPrice.toLocaleString()}
														</p>
													</div>
												)}
												{appt.doctorReport && (
													<div className="bg-blue-50 p-3 rounded-lg">
														<p className="text-sm text-blue-800">
															<strong>Reporte:</strong> {appt.doctorReport}
														</p>
													</div>
												)}
											</>
										)}
									</CardContent>
								</Card>
							);
						})}
					</div>

					{appointments.length === 0 && (
						<Card className="bg-white/80 backdrop-blur-sm border-slate-200">
							<CardContent className="p-12 text-center">
								<CalendarDays className="w-16 h-16 text-slate-400 mx-auto mb-4" />
								<h3 className="text-xl font-medium text-slate-600 mb-2">No hay citas registradas</h3>
								<p className="text-slate-500">Las citas aparecerán aquí cuando se creen.</p>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</DoctorGuard>
	);
}
