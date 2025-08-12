'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Plus, Search, Check, ChevronsUpDown, Users, UserCheck, AlertCircle } from 'lucide-react';
import { getUsers, updateUserRole as apiUpdateUserRole } from '@/lib/api/users';
import { User } from '@/lib/types/interfaces';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [busqueda, setBusqueda] = useState<string>('');
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setFetchLoading(true);
      setError(null);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error al cargar los usuarios');
      toast.error('Error al cargar los usuarios');
    } finally {
      setFetchLoading(false);
    }
  };

  // Filtrado en frontend
  const filteredUsers = users.filter((user) =>
    user.fullName?.toLowerCase().includes(busqueda.toLowerCase()) ||
    user.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
    user._id?.toString().toLowerCase().includes(busqueda.toLowerCase())
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

  const getRoleStyles = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'doctor':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'user':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50">
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-4 py-2 mb-6">
              <Users className="w-4 h-4 text-slate-600" />
              <span className="text-slate-700 font-medium text-sm">
                Gestión de Usuarios
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                Usuarios del Sistema
              </h1>
              <Link href="/admin/users/nuevo" className="mt-4 sm:mt-0">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white font-medium h-11 px-6 rounded-xl transition-all duration-200">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Usuario
                </Button>
              </Link>
            </div>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Administra cuentas, roles y permisos del sistema
            </p>
          </header>

          {/* Filtros */}
          <div className="mb-8 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por nombre, email o ID..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10 h-11 border-slate-200 focus-visible:ring-2 focus-visible:ring-slate-900"
              />
            </div>
          </div>

          <Separator className="mb-8 bg-slate-200" />

          {/* Estados de carga */}
          {fetchLoading && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 rounded-xl bg-slate-100 animate-pulse border border-slate-200" />
              ))}
            </div>
          )}

          {!fetchLoading && error && (
            <div className="flex items-center gap-3 text-red-700 bg-red-50 border border-red-200 rounded-xl p-4 text-sm max-w-2xl mx-auto">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!fetchLoading && !error && filteredUsers.length === 0 && (
            <div className="text-center py-20 text-slate-500 text-sm">
              {busqueda ? 'No se encontraron usuarios con los criterios de búsqueda.' : 'No hay usuarios registrados.'}
            </div>
          )}

          {/* Lista de usuarios */}
          {!fetchLoading && !error && filteredUsers.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              {/* Header de la tabla */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-700">
                <div className="col-span-3">Usuario</div>
                <div className="col-span-3">Email</div>
                <div className="col-span-2">Rol</div>
                <div className="col-span-3">ID</div>
                <div className="col-span-1">Acciones</div>
              </div>

              {/* Filas de usuarios */}
              <div className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <div
                    key={user._id.toString()}
                    className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-50 transition-colors items-center"
                  >
                    {/* Usuario */}
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center flex-shrink-0">
                        <UserCheck className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900 truncate">{user.fullName}</p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-span-3">
                      <p className="text-sm text-slate-600 truncate">{user.email}</p>
                    </div>

                    {/* Rol */}
                    <div className="col-span-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            className={`h-8 px-3 text-xs font-medium border transition-colors ${getRoleStyles(user.role)}`}
                            disabled={loading[user._id.toString()]}
                          >
                            {loading[user._id.toString()] ? (
                              <div className="flex items-center gap-1">
                                <div className="animate-spin h-3 w-3 border-2 border-current rounded-full border-r-transparent"></div>
                                <span>...</span>
                              </div>
                            ) : (
                              <>
                                <span className="capitalize">{user.role}</span>
                                <ChevronsUpDown className="h-3 w-3 ml-1 opacity-50" />
                              </>
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-32">
                          <DropdownMenuItem 
                            onClick={() => updateUserRole(user._id.toString(), 'admin')}
                            className="cursor-pointer text-amber-700 font-medium"
                          >
                            {user.role === 'admin' && <Check className="h-4 w-4 mr-2" />}
                            Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => updateUserRole(user._id.toString(), 'doctor')}
                            className="cursor-pointer text-emerald-700 font-medium"
                          >
                            {user.role === 'doctor' && <Check className="h-4 w-4 mr-2" />}
                            Doctor
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => updateUserRole(user._id.toString(), 'user')}
                            className="cursor-pointer text-blue-700 font-medium"
                          >
                            {user.role === 'user' && <Check className="h-4 w-4 mr-2" />}
                            Usuario
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* ID */}
                    <div className="col-span-3">
                      <p className="text-xs text-slate-400 font-mono truncate">{user._id.toString()}</p>
                    </div>

                    {/* Acciones */}
                    <div className="col-span-1">
                      <Link href={`/admin/users/${user._id}`}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 px-3 text-xs border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                        >
                          Ver
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}