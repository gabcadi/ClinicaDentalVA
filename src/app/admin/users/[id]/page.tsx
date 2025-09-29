'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';
import { getUserById, updateUser } from '@/lib/api/users';
import { User } from '@/lib/types/interfaces';
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

export default function UserDetalle() {
  const { data: session, status } = useSession();
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '' });

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/sign-in');
      return;
    }

    const userRole = (session.user as any)?.role;
    if (userRole !== 'admin') {
      router.push('/home');
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await getUserById(id);
        setUser(data);
        setFormData({ fullName: data.fullName, email: data.email });
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Error al cargar los datos del usuario.');
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id, session, status, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const updatedUser = await updateUser(id, formData);
      setUser(updatedUser);
      toast.success('Usuario actualizado correctamente.');
      setIsModalOpen(false);
      router.push('/admin/users');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error al actualizar el usuario.');
    }
  };

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
            <p className="text-slate-600">Verificando permisos...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show unauthorized state if not authenticated or not admin
  if (!session || (session.user as any)?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
              <Icons.AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">
              Acceso Denegado
            </h1>
            <p className="text-slate-600 mb-6">
              No tienes permisos para acceder a esta página. Solo los administradores pueden ver detalles de usuarios.
            </p>
            <Button 
              onClick={() => router.push('/home')}
              className="bg-slate-900 hover:bg-slate-800 text-white"
            >
              Volver al Inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50 px-6 py-12 font-[var(--font-dmsans)]">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Usuario</h1>
          <p className="text-slate-600 mt-2 text-lg">ID: {id}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="col-span-2 bg-white rounded-2xl p-6 shadow-md border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
              <Icons.User className="w-5 h-5" /> Información General
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li><span className="font-medium text-slate-700">Nombre: </span>{user?.fullName}</li>
              <li><span className="font-medium text-slate-700">Email: </span>{user?.email}</li>
              <li><span className="font-medium text-slate-700">Rol:</span> {user?.role}</li>
              <li><span className="font-medium text-slate-700">ID:</span> {user?._id?.toString()}</li>
            </ul>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-lg">
            <Icons.Edit3 className="w-10 h-10 mb-4" />
            <h3 className="text-lg font-semibold mb-2">¿Deseas editar este usuario?</h3>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-slate-900 hover:bg-slate-200 w-full mt-2 rounded-full font-semibold">
                  Editar información
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                  <DialogTitle>Editar Usuario</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="fullName" className="text-right">Nombre</label>
                    <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="email" className="text-right">Email</label>
                    <Input id="email" name="email" value={formData.email} onChange={handleInputChange} className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleSubmit}>Guardar Cambios</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
      </div>
    </div>
  );
}


