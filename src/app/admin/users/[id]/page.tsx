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

export default function UserDetalle() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '' });

  useEffect(() => {
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
  }, [id]);

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

function CardItem({ icon, title, description }: { icon: React.ReactElement; title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3 mb-3 text-sky-600">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>
  );
}
