'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getUsers } from '@/lib/api/users';
import { User } from '@/lib/types/interfaces';
import { toast } from 'sonner';
import { Search, Check, ChevronDown, UserIcon } from 'lucide-react';

export default function NuevoPacientePage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    age: '',
    id: '',
    phone: '',
    address: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Cierra el dropdown cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isDropdownOpen && !target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        // Filtrar solo usuarios con rol "user"
        const userRoleOnly = data.filter((user: User) => user.role === 'user');
        setUsers(userRoleOnly);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Error al cargar usuarios');
      }
    };

    fetchUsers();
  }, []);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      ...formData,
      userId: user._id.toString()
    });
    setIsDropdownOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.userId) {
      toast.error('Debes seleccionar un usuario');
      return;
    }
    
    if (!formData.age || !formData.id || !formData.phone || !formData.address) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age)
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear el paciente');
      }

      toast.success('Paciente creado exitosamente');
      router.push('/doctor/pacientes');
    } catch (error) {
      toast.error('Error al crear el paciente. Ya existe un usuario asignado como paciente.');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar usuarios según el término de búsqueda
  const filteredUsers = users.filter(user => 
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-sky-700 mb-8">Nuevo Paciente</h1>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Usuario
              </label>
              
              <div className="relative user-dropdown">
                {/* Campo de visualización del usuario seleccionado */}
                <div 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center justify-between w-full p-2.5 border ${
                    selectedUser ? 'border-green-400 bg-green-50' : 'border-gray-300'
                  } rounded-md cursor-pointer hover:border-sky-400 transition`}
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-sky-100 p-1.5 rounded-full">
                      <UserIcon className="h-4 w-4 text-sky-600" />
                    </div>
                    {selectedUser ? (
                      <div className="flex flex-col">
                        <span className="font-medium">{selectedUser.fullName}</span>
                        <span className="text-sm text-gray-500">{selectedUser.email}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Seleccionar un usuario...</span>
                    )}
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                
                {/* Dropdown para buscar y seleccionar usuarios */}
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Buscar usuario..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                      </div>
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto py-1">
                      {filteredUsers.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          No se encontraron usuarios
                        </div>
                      ) : (
                        filteredUsers.map((user) => (
                          <div
                            key={user._id.toString()}
                            onClick={() => handleSelectUser(user)}
                            className={`px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-sky-50 ${
                              formData.userId === user._id.toString() ? 'bg-sky-50' : ''
                            }`}
                          >
                            <div className={`p-1 rounded-full ${
                              formData.userId === user._id.toString() ? 'bg-sky-100' : 'bg-gray-100'
                            }`}>
                              <UserIcon className={`h-4 w-4 ${
                                formData.userId === user._id.toString() ? 'text-sky-600' : 'text-gray-500'
                              }`} />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium">{user.fullName}</span>
                              <span className="text-xs text-gray-500">{user.email}</span>
                            </div>
                            {formData.userId === user._id.toString() && (
                              <Check className="h-4 w-4 ml-auto text-sky-600" />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cédula
                </label>
                <Input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="Ej: 12345678"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Edad
                </label>
                <Input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Ej: 30"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ej: +506 4121-2367"
                required
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Dirección completa"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/doctor/pacientes')}
                className="border-gray-300 :hover:border-gray-400"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-sky-600 text-white hover:bg-sky-700"
              >
                {loading ? (
                  <span className="flex items-center gap-1">
                    <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                    Guardando...
                  </span>
                ) : (
                  'Guardar Paciente'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
