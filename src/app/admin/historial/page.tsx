"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, User2, Search, Clock3, AlertCircle, FileText } from "lucide-react";
import Link from "next/link";

interface Appointment {
	_id: string;
	description: string;
	date: string;
	time: string;
	confirmed?: boolean;
	patientId?: string;
}

interface PatientResponse {
	_id: string;
	id: string;
	userId?: { fullName?: string; email?: string } | string;
	age?: number;
}

export default function HistorialPage() {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [patientsMap, setPatientsMap] = useState<Record<string, PatientResponse>>({});
	const [query, setQuery] = useState("");
	const [onlyFuture, setOnlyFuture] = useState(false);

	// Fetch all appointments
	useEffect(() => {
		const fetchAppointments = async () => {
			try {
				setLoading(true);
				const res = await fetch("/api/appointments", { cache: "no-store" });
				if (!res.ok) throw new Error("Error obteniendo citas");
				const data: Appointment[] = await res.json();
				setAppointments(data);

				// Unique patient IDs
				const ids = Array.from(new Set(data.map(a => a.patientId).filter(Boolean))) as string[];
				if (ids.length) {
					const results = await Promise.all(
						ids.map(async (id) => {
							try {
								const r = await fetch(`/api/patients/${id}`);
								if (!r.ok) return null;
								const p = await r.json();
								return { id, patient: p as PatientResponse };
							} catch {
								return null;
							}
						})
					);
					const map: Record<string, PatientResponse> = {};
						results.forEach(r => { if (r?.patient) map[r.id] = r.patient; });
					setPatientsMap(map);
				}
			} catch (e: any) {
				setError(e.message || "Error desconocido");
			} finally {
				setLoading(false);
			}
		};
		fetchAppointments();
	}, []);

	const filtered = useMemo(() => {
		return appointments
			.filter(a => {
				if (onlyFuture) {
					const d = new Date(a.date + "T" + (a.time || "00:00"));
					if (d.getTime() < Date.now()) return false;
				}
				if (!query.trim()) return true;
				const patient = a.patientId ? patientsMap[a.patientId] : undefined;
				const name = typeof patient?.userId === "object" ? patient?.userId?.fullName : "";
				return (
					a.description?.toLowerCase().includes(query.toLowerCase()) ||
					name?.toLowerCase().includes(query.toLowerCase()) ||
					patient?.id?.toLowerCase().includes(query.toLowerCase())
				);
			})
			.sort((a, b) => {
				// Most recent first
				const da = new Date(a.date + "T" + a.time).getTime();
				const db = new Date(b.date + "T" + b.time).getTime();
				return db - da;
			});
	}, [appointments, patientsMap, query, onlyFuture]);

	return (
		<main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50">
			<div className="px-6 py-16">
				<div className="max-w-7xl mx-auto">
					{/* Header */}
					<header className="mb-12 text-center">
						<div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-4 py-2 mb-6">
							<FileText className="w-4 h-4 text-slate-600" />
							<span className="text-slate-700 font-medium text-sm">
								Historial
							</span>
						</div>
						<h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
							Historial de Citas
						</h1>
						<p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
							Consulta el registro completo de todas las citas programadas
						</p>
					</header>

					{/* Filtros */}
					<div className="mb-8 grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
							<Input
								placeholder="Buscar por paciente o descripción..."
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								className="pl-10 h-11 border-slate-200 focus-visible:ring-2 focus-visible:ring-slate-900"
							/>
						</div>
						<label className="flex items-center gap-3 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg px-4 h-11 cursor-pointer">
							<input
								type="checkbox"
								className="accent-slate-900 w-4 h-4"
								checked={onlyFuture}
								onChange={(e) => setOnlyFuture(e.target.checked)}
							/>
							Solo citas futuras
						</label>
						<div className="flex items-center justify-center text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-4 h-11">
							<span className="font-medium">{filtered.length}</span> de {appointments.length} citas
						</div>
					</div>

					<Separator className="mb-8 bg-slate-200" />

					{/* Estados de carga */}
					{loading && (
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className="h-40 rounded-xl bg-slate-100 animate-pulse border border-slate-200" />
							))}
						</div>
					)}

					{!loading && error && (
						<div className="flex items-center gap-3 text-red-700 bg-red-50 border border-red-200 rounded-xl p-4 text-sm max-w-2xl mx-auto">
							<AlertCircle className="h-5 w-5 flex-shrink-0" />
							<span>{error}</span>
						</div>
					)}

					{!loading && !error && filtered.length === 0 && (
						<div className="text-center py-20 text-slate-500 text-sm">
							No se encontraron citas con los criterios de búsqueda.
						</div>
					)}

					{/* Grid de citas */}
					{!loading && !error && filtered.length > 0 && (
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{filtered.map((appointment) => {
								const patient = appointment.patientId ? patientsMap[appointment.patientId] : undefined;
								const fullName = typeof patient?.userId === 'object' ? patient?.userId?.fullName : undefined;
								const cedula = patient?.id;
								const datetime = new Date(appointment.date + 'T' + (appointment.time || '00:00'));
								const dateFmt = isNaN(datetime.getTime()) ? appointment.date : datetime.toLocaleDateString('es-CR', { 
									day: '2-digit', 
									month: 'short', 
									year: 'numeric' 
								});
								const timeFmt = appointment.time || datetime.toLocaleTimeString('es-CR', { 
									hour: '2-digit', 
									minute: '2-digit' 
								});

								return (
									<Card
										key={appointment._id}
										className="border-slate-200 bg-white hover:border-slate-300 transition-all duration-200 hover:shadow-md rounded-xl"
									>
										<CardHeader className="pb-3">
											<div className="flex items-start justify-between gap-3">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center">
														<CalendarDays className="w-5 h-5 text-white" />
													</div>
													<div>
														<CardTitle className="text-base font-semibold text-slate-900">
															{dateFmt}
														</CardTitle>
														<p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
															<Clock3 className="h-3 w-3" /> {timeFmt}
														</p>
													</div>
												</div>
												{appointment.confirmed && (
													<span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
														Confirmada
													</span>
												)}
											</div>
										</CardHeader>
										<CardContent className="pt-0">
											{appointment.description && (
												<p className="text-sm text-slate-600 mb-3 line-clamp-2">
													{appointment.description}
												</p>
											)}
											<div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
												<User2 className="h-4 w-4" />
												<span className="flex-1 truncate">
													{fullName || 'Paciente no encontrado'}
												</span>
												{cedula && (
													<span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600">
														{cedula}
													</span>
												)}
											</div>
											{appointment.patientId && (
												<Link
													href={`/doctor/pacientes/${appointment.patientId}`}
													className="inline-flex items-center text-xs font-medium text-slate-900 hover:text-slate-700 border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-2 transition-colors"
												>
													Ver detalles del paciente
												</Link>
											)}
										</CardContent>
									</Card>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</main>
	);
}

