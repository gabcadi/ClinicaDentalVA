"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { getAllMaterialsFromAppointments, IFlattenedMaterial } from '@/lib/api/appointments';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';

// Nota: si los componentes de tabla no existen aún, se puede reemplazar por HTML estándar.

interface GroupedByDate {
	date: string;
	materials: IFlattenedMaterial[];
}

const InventarioPage: React.FC = () => {
	const [materials, setMaterials] = useState<IFlattenedMaterial[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState("");

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const data = await getAllMaterialsFromAppointments();
				setMaterials(data);
			} catch (e: any) {
				setError(e.message || 'Error cargando materiales');
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const filtered = useMemo(() => {
		return materials.filter(m => {
			const matchesSearch = search
				? (m.name + m.type + m.description).toLowerCase().includes(search.toLowerCase())
				: true;
			const matchesType = typeFilter ? m.type === typeFilter : true;
			return matchesSearch && matchesType;
		});
	}, [materials, search, typeFilter]);

	const groupedByDate: GroupedByDate[] = useMemo(() => {
		const map = new Map<string, IFlattenedMaterial[]>();
		filtered.forEach(m => {
			if (!map.has(m.appointmentDate)) map.set(m.appointmentDate, []);
			map.get(m.appointmentDate)!.push(m);
		});
		return Array.from(map.entries()).map(([date, mats]) => ({ date, materials: mats }));
	}, [filtered]);

	const uniqueTypes = useMemo(
		() => Array.from(new Set(materials.map(m => m.type))).sort(),
		[materials]
	);

	return (
		<div className="p-6 space-y-6">
			<div className="flex flex-col md:flex-row md:items-end gap-4">
				<div className="flex-1 space-y-2">
					<h1 className="text-2xl font-semibold">Inventario de Materiales por Cita</h1>
					<p className="text-sm text-muted-foreground">Listado consolidado de todos los materiales registrados dentro de cada cita.</p>
				</div>
				<div className="flex gap-2 w-full md:w-auto">
								<Input
									placeholder="Buscar por nombre / tipo / descripción cita"
									value={search}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
									className="w-full md:w-80"
								/>
					<select
						className="border rounded px-2 py-2 text-sm"
						value={typeFilter}
						onChange={e => setTypeFilter(e.target.value)}
					>
						<option value="">Tipo</option>
						{uniqueTypes.map(t => (
							<option key={t} value={t}>{t}</option>
						))}
					</select>
				</div>
			</div>
			<Separator />

			{loading && (
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Loader2 className="h-4 w-4 animate-spin" /> Cargando materiales...
				</div>
			)}
			{error && (
				<div className="text-red-500 text-sm">{error}</div>
			)}

			{!loading && !error && filtered.length === 0 && (
				<div className="text-sm text-muted-foreground">No se encontraron materiales.</div>
			)}

			<div className="space-y-8">
				{groupedByDate.map(group => (
					<Card key={group.date} className="p-4 space-y-4">
						<div className="flex items-center justify-between">
							<h2 className="font-medium text-lg">Fecha de Cita: {group.date}</h2>
							<span className="text-xs text-muted-foreground">{group.materials.length} materiales</span>
						</div>
						<div className="overflow-x-auto rounded border">
							<table className="w-full text-sm">
								<thead className="bg-muted/40 text-left">
									<tr>
										<th className="py-2 px-3">Material</th>
										<th className="py-2 px-3">Tipo</th>
										<th className="py-2 px-3">Cantidad</th>
										<th className="py-2 px-3">Cita (Hora)</th>
										<th className="py-2 px-3">Descripción Cita</th>
										<th className="py-2 px-3">Creado</th>
									</tr>
								</thead>
								<tbody>
									{group.materials.map(m => (
										<tr key={m._id || m.name + m.createdAt} className="border-t hover:bg-muted/30">
											<td className="py-2 px-3 font-medium">{m.name}</td>
											<td className="py-2 px-3">{m.type}</td>
											<td className="py-2 px-3">{m.quantity}</td>
											<td className="py-2 px-3 whitespace-nowrap">{m.appointmentTime}</td>
											<td className="py-2 px-3 max-w-xs truncate" title={m.description}>{m.description}</td>
											<td className="py-2 px-3 text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleString()}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
};

export default InventarioPage;

