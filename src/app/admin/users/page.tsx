'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, ArrowRight, Search, Check, ChevronsUpDown } from 'lucide-react';
import { getUsers, updateUserRole as apiUpdateUserRole } from '@/lib/api/users';
import { User } from '@/lib/types/interfaces';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [busqueda, setBusqueda] = useState<string>('');
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error al cargar los usuarios');
    }
  };

  // Opcional: filtrado en frontend
  const filteredUsers = users.filter((user) =>
    user.fullName?.toLowerCase().includes(busqueda.toLowerCase()) ||
    user.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
    user._id?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const updateUserRole = async (userId: string, newRole: 'admin' | 'doctor' | 'user') => {
    setLoading(prev => ({ ...prev, [userId]: true }));
    try {
      await apiUpdateUserRole(userId, newRole);
      
      setUsers(users.map(user => 
        user._id.toString() === userId ? { ...user, role: newRole } : user
      ));
      
      toast.success(`Rol actualizado a ${newRole}`);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Error al actualizar el rol');
    } finally {
      setLoading(prev => ({ ...prev, [userId]: false }));
    }
  };
  
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
                  <tr key={user._id.toString()} className="hover:bg-sky-50">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{user.fullName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            className={`w-32 justify-between ${
                              user.role === 'admin' 
                                ? 'bg-yellow-100 text-yellow-700 border-yellow-300' 
                                : user.role === 'doctor' 
                                ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                                : 'bg-blue-100 text-blue-700 border-blue-300'
                            }`}
                            disabled={loading[user._id.toString()]}
                          >
                            {loading[user._id.toString()] ? (
                              <span className="flex items-center gap-1">
                                <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-r-transparent"></div>
                                Actualizando
                              </span>
                            ) : (
                              <>
                                {user.role}
                                <ChevronsUpDown className="h-4 w-4 opacity-50" />
                              </>
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-32">
                          <DropdownMenuItem 
                            onClick={() => updateUserRole(user._id.toString(), 'admin')}
                            className="cursor-pointer text-yellow-700 font-medium"
                          >
                            {user.role === 'admin' && <Check className="h-4 w-4 mr-2" />}
                            admin
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => updateUserRole(user._id.toString(), 'doctor')}
                            className="cursor-pointer text-emerald-700 font-medium"
                          >
                            {user.role === 'doctor' && <Check className="h-4 w-4 mr-2" />}
                            doctor
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => updateUserRole(user._id.toString(), 'user')}
                            className="cursor-pointer text-blue-700 font-medium"
                          >
                            {user.role === 'user' && <Check className="h-4 w-4 mr-2" />}
                            user
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user._id.toString()}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/users/${user._id}`}>
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