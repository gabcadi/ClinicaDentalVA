'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, ArrowRight, Search, Trash2 } from 'lucide-react';
import { getPatients, deletePatient } from '@/lib/api/patients';
import { getUsers } from '@/lib/api/users';
import { Patient, User } from '@/lib/types/interfaces';
import { toast } from 'sonner';
import { TableSkeleton } from '@/components/ui/loading-skeletons';

// Type guard para verificar si userId es un objeto User
const isUser = (userId: any): userId is User => {
  return userId && typeof userId === 'object' && 'fullName' in userId;
};

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Patient[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [busqueda, setBusqueda] = useState<string>('');
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [patientsData, usersData] = await Promise.all([
        getPatients(),
        getUsers()
      ]);
      setPacientes(patientsData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = async (id: string) => {
    setDeleteLoading(true);
    try {
      await deletePatient(id);
      
      // Actualizar la lista de pacientes sin recargar
      setPacientes(pacientes.filter(paciente => paciente._id?.toString() !== id));
      toast.success('Paciente eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast.error('Error al eliminar el paciente');
    } finally {
      setShowConfirmDelete(null);
      setDeleteLoading(false);
    }
  };

  // Filtrado en frontend (opcional)
  const filteredPacientes = pacientes.filter(paciente => {
    const nombreUsuario = users.find(user => user._id.toString() === paciente.userId?.toString())?.fullName?.toLowerCase() || '';
    return nombreUsuario.includes(busqueda.toLowerCase()) || 
           paciente.id.toLowerCase().includes(busqueda.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
          <h1 className="text-4xl font-bold text-sky-700">Gestión de Pacientes</h1>
          <Link href="/doctor/pacientes/nuevo">
            <Button className="mt-4 sm:mt-0 bg-gradient-to-r from-sky-500 to-sky-600 hover:to-sky-700 text-white shadow-md cursor-pointer">
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
        {loading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : (
          <div className="overflow-x-auto bg-white shadow-lg border border-gray-200 rounded-xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-sky-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">Nombre</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">Cédula</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">Edad</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">Teléfono</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">Dirección</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-sky-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPacientes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-slate-500">
                      No se encontraron pacientes.
                    </td>
                  </tr>
                ) : (
                filteredPacientes.map((paciente) => (
                  <tr key={paciente._id?.toString()} className="hover:bg-sky-50">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                      {isUser(paciente.userId) 
                        ? paciente.userId.fullName 
                        : users.find(user => user._id?.toString() === paciente.userId?.toString())?.fullName || 'No disponible'
                      }
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{paciente.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{paciente.age}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{paciente.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{paciente.address}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {showConfirmDelete === paciente._id?.toString() ? (
                          <div className="flex gap-1 items-center bg-red-50 px-2 py-1 rounded-md border border-red-200">
                            <span className="text-xs text-red-700">¿Confirmar?</span>
                            <Button 
                              variant="destructive" 
                              className="h-7 px-2 text-xs bg-red-600 hover:bg-red-700"
                              onClick={() => handleDeletePatient(paciente._id?.toString() || '')}
                              disabled={deleteLoading}
                            >
                              {deleteLoading ? 
                                <div className="animate-spin h-3 w-3 border-2 border-white rounded-full border-r-transparent"></div> 
                                : 'Sí'
                              }
                            </Button>
                            <Button 
                              variant="outline" 
                              className="h-7 px-2 text-xs border-red-300"
                              onClick={() => setShowConfirmDelete(null)}
                              disabled={deleteLoading}
                            >
                              No
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            className="text-red-600 border-red-300 hover:bg-red-50 cursor-pointer"
                            onClick={() => setShowConfirmDelete(paciente._id?.toString() || '')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                        <Link href={`/doctor/pacientes/${paciente._id}`}>
                          <Button variant="outline" className="text-sky-600 border-sky-300 hover:bg-sky-50 cursor-pointer">
                            Ver más <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
}
