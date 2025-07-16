'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, ArrowRight, Search } from 'lucide-react';
import { getUsers } from '@/lib/api/users';
import { User } from '@/lib/types/interfaces';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [busqueda, setBusqueda] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Opcional: filtrado en frontend
  const filteredUsers = users.filter((user) =>
    user.fullName?.toLowerCase().includes(busqueda.toLowerCase()) ||
    user.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
    user._id?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
          <h1 className="text-4xl font-bold text-sky-700">Gestión de Usuarios</h1>
          <Link href="/admin/users/nuevo">
            <Button className="mt-4 sm:mt-0 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-md">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Usuario
            </Button>
          </Link>
        </div>

        {/* Buscador */}
        <div className="mb-8">
          <div className="relative w-full max-w-md mx-auto">
            <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o ID..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-sky-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Tabla de usuarios */}
        <div className="overflow-x-auto bg-white shadow-lg border border-gray-200 rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-sky-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">Rol</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">ID</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-slate-500">
                    No se encontraron usuarios.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-sky-50">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{user.fullName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.role}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.id}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/users/${user.id}`}>
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
