"use client";

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, Clock, FileText, User, ClipboardCheck } from 'lucide-react';
import { toast } from 'sonner';
import { getPatientById } from '@/lib/api/patients';
import { Patient, User as UserType } from '@/lib/types/interfaces';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
 

// Type guard para verificar si userId es un objeto User
const isUser = (userId: unknown): userId is UserType => {
  return (
    typeof userId === 'object' &&
    userId !== null &&
    'fullName' in userId
  );
};



function CreateAppointmentsInner() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { data: session } = useSession();
	const patientId = searchParams.get('patientId');

	const [patient, setPatient] = useState<Patient | null>(null);
	const [formData, setFormData] = useState({
		description: '',
		date: '',
		time: '',
		confirmed: false,
		patientId: patientId || '',
	});

	useEffect(() => {
		const fetchPatient = async () => {
			if (!patientId) {
				toast.error('No se proporcionó un ID de paciente válido');
				return;
			}
			try {
				const data = await getPatientById(patientId);
				setPatient(data);
				setFormData(prev => ({ ...prev, patientId }));
			} catch (error) {
				console.error('Error fetching patient:', error);
				toast.error('Error al cargar la información del paciente');
			}
		};
		fetchPatient();
	}, [patientId]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.description || !formData.date || !formData.time) {
			toast.error('Todos los campos son obligatorios');
			return;
		}
		if (!patientId) {
			toast.error('No se ha seleccionado un paciente válido');
			return;
		}
		
		try {
			// Verificar si ya existe una cita en esa fecha y hora
			const checkResponse = await fetch('/api/appointments');
			if (checkResponse.ok) {
				const allAppointments = await checkResponse.json();
				
				// Convertir la hora seleccionada a minutos para comparación
				const [selectedHour, selectedMinute] = formData.time.split(':').map(Number);
				const selectedTimeInMinutes = selectedHour * 60 + selectedMinute;
				
				// Buscar conflictos de horario
				const conflict = allAppointments.find((apt: any) => {
					if (apt.date !== formData.date) return false;
					
					const [aptHour, aptMinute] = apt.time.split(':').map(Number);
					const aptTimeInMinutes = aptHour * 60 + aptMinute;
					
					// Verificar si hay solapamiento (mismo horario o dentro de 20 minutos)
					const timeDifference = Math.abs(selectedTimeInMinutes - aptTimeInMinutes);
					return timeDifference < 20;
				});
				
				if (conflict) {
					// Calcular hora sugerida (20 minutos después de la cita existente)
					const [conflictHour, conflictMinute] = conflict.time.split(':').map(Number);
					const suggestedTimeInMinutes = conflictHour * 60 + conflictMinute + 20;
					const suggestedHour = Math.floor(suggestedTimeInMinutes / 60);
					const suggestedMinute = suggestedTimeInMinutes % 60;
					const suggestedTime = `${suggestedHour.toString().padStart(2, '0')}:${suggestedMinute.toString().padStart(2, '0')}`;
					
					toast.error('Horario no disponible', {
						description: `Ya existe una cita el ${formData.date} a las ${conflict.time}. Por favor intenta con ${suggestedTime} o elige otra fecha.`,
						duration: 6000,
					});
					return;
				}
			}
			
			// Si no hay conflictos, crear la cita
			const response = await fetch('/api/appointments', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Error creating appointment');
			}
			setFormData({
				description: '',
				date: '',
				time: '',
				confirmed: false,
				patientId: patientId || '',
			});
			toast.success('Cita creada exitosamente');
			
			// Redirigir según el rol del usuario
			const userRole = (session?.user as any)?.role;
			if (userRole === 'patient') {
				router.push('/patient/appointments');
			} else {
				router.push(`/doctor/pacientes/${patientId}/citas`);
			}
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : 'Error al crear la cita');
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
			<div className="relative overflow-hidden">
				<div className="relative max-w-6xl mx-auto px-6 py-8">
					<div className="text-center mb-12">
						<div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-xl">
							<Calendar className="w-10 h-10 text-white" />
						</div>
						<h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
							Nueva Cita
						</h1>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
							Programa tu cita de manera rápida y sencilla. Completa los datos y nosotros nos encargamos del resto.
						</p>
					</div>
				</div>
				<div className="max-w-4xl mx-auto px-6 pb-16 -mt-8">
					<div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
						<div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
						<div className="p-8 md:p-12">
							<div className="text-center">
								<h2 className="text-2xl font-bold text-gray-800">Información de la Cita</h2>
								<p className="text-gray-600">Proporciona los detalles necesarios para tu nueva cita</p>
							</div>
							<div className="space-y-6">
								<div className="relative">
									<label className="block text-sm font-semibold text-gray-700 mb-2">
										<User className="inline w-4 h-4 mr-2 text-blue-600" />
										Paciente Seleccionado
									</label>
									{patient ? (
										<div className="w-full px-4 py-3 border-2 border-green-200 bg-green-50 rounded-xl flex items-center gap-3">
											<div className="bg-green-100 p-2 rounded-full">
												<User className="w-4 h-4 text-green-600" />
											</div>
											<div>
												<p className="font-medium text-green-800">Nombre: {isUser(patient.userId) ? patient.userId.fullName : 'No disponible'}</p>
												<p className="text-sm text-green-600">{patient.age} años - Teléfono: {patient.phone} - Cédula: {patient.id}</p>
											</div>
										</div>
									) : (
										<div className="w-full px-4 py-3 border-2 border-gray-200 bg-gray-50 rounded-xl">
											<p className="text-gray-500">Cargando información del paciente...</p>
										</div>
									)}
								</div>
								<div className="relative">
									<label className="block text-sm font-semibold text-gray-700 mb-2">
										<FileText className="inline w-4 h-4 mr-2 text-blue-600" />
										Descripción de la cita
									</label>
									<textarea
										value={formData.description}
										onChange={e => setFormData({ ...formData, description: e.target.value })}
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
											onChange={e => setFormData({ ...formData, date: e.target.value })}
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
											onChange={e => setFormData({ ...formData, time: e.target.value })}
											className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
											required
										/>
									</div>
								</div>
								<form onSubmit={handleSubmit}>
									<button
										type="submit"
										className="w-full bg-gradient-to-r cursor-pointer from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2"
									>
										<span>Crear Nueva Cita</span>
										<ClipboardCheck className="w-5 h-5" />
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function CreateAppointments() {
	return (
		<Suspense fallback={<div className="p-8 text-center">Cargando formulario...</div>}>
			<CreateAppointmentsInner />
		</Suspense>
	);
}
