'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, ArrowRight, Search } from 'lucide-react';
import { getPatients } from '@/lib/api/patients';
import { ObjectId } from 'mongodb';

interface Paciente {
	age: number;
	id: string;
	phone: string;
	address: string;
  userId: ObjectId; 
}

export default function PacientesPage() {
  
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients();
        setPacientes(data);
        console.log('Pacientes fetched successfully:', data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    fetchPatients();
  }, []);

  const [pacientes, setPacientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
          <h1 className="text-4xl font-bold text-sky-700">Gestión de Pacientes</h1>
          <Link href="/doctor/pacientes/nuevo">
            <Button className="mt-4 sm:mt-0 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-md">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Paciente
            </Button>
          </Link>
        </div>

        {/* Buscador */}
        <div className="mb-8">
          <div className="relative w-full max-w-md mx-auto">
            <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre o cédula..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-sky-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Tabla de pacientes */}
        <div className="overflow-x-auto bg-white shadow-lg border border-gray-200 rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-sky-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">Cédula</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">Edad</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">Teléfono</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">Dirección</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pacientes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-slate-500">
                    No se encontraron pacientes.
                  </td>
                </tr>
              ) : (
                pacientes.map((paciente) => (
                  <tr key={paciente.id} className="hover:bg-sky-50">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{paciente.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{paciente.age}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{paciente.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{paciente.address}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/doctor/pacientes/${paciente.id}`}>
                        <Button variant="outline" className="text-sky-600 border-sky-300 hover:bg-sky-50">
                          Ver más <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
