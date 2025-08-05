'use client';

import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface Appointment {
  _id: string;
  description: string;
  date: string;
  time: string;
  confirmed?: boolean;
}

interface EditFormData {
  description: string;
  date: string;
  time: string;
  confirmed: boolean;
}

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditFormData>({
    description: '',
    date: '',
    time: '',
    confirmed: false
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments');
      if (!res.ok) throw new Error('Error al obtener citas');
      const data = await res.json();
      setAppointments(data);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Error al cargar las citas');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      toast.success('Cita eliminada exitosamente');
      await fetchAppointments();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Error al eliminar la cita');
    }
  };

  const confirmDelete = (id: string) => {
    toast(
      (t) => (
        <div className="p-2">
          <div className="mb-3 text-gray-800 font-semibold">¿Estás seguro de eliminar esta cita?</div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
              onClick={() => {
                handleDelete(id);
                toast.dismiss(t.id);
              }}
            >
              Sí, eliminar
            </button>
            <button
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      { duration: 8000 }
    );
  };

  const handleEdit = (appt: Appointment) => {
    setEditingId(appt._id);
    setEditForm({
      description: appt.description,
      date: appt.date,
      time: appt.time,
      confirmed: appt.confirmed ?? false,
    });
  };

  const handleSave = async (id: string) => {
    if (!editForm.description || !editForm.date || !editForm.time) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      
      if (!res.ok) throw new Error('Error al actualizar');
      
      toast.success('Cita modificada exitosamente');
      setEditingId(null);
      await fetchAppointments();
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Error al actualizar la cita');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10">
      <Toaster position="top-center" />
      <h2 className="mb-8 text-3xl font-bold text-center">Gestión de Citas</h2>
      
      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Hora</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Confirmada</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {appointments.map((appt) => (
              <tr key={appt._id} className="hover:bg-blue-50 transition">
                <td className="px-6 py-4">
                  {editingId === appt._id ? (
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    />
                  ) : (
                    appt.description
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === appt._id ? (
                    <input
                      type="date"
                      className="w-full border rounded px-2 py-1"
                      value={editForm.date}
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    />
                  ) : (
                    appt.date
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === appt._id ? (
                    <input
                      type="time"
                      className="w-full border rounded px-2 py-1"
                      value={editForm.time}
                      onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                    />
                  ) : (
                    appt.time
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {editingId === appt._id ? (
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.confirmed}
                        onChange={(e) => setEditForm({ ...editForm, confirmed: e.target.checked })}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className={editForm.confirmed ? 'text-green-700 text-sm font-semibold' : 'text-red-700 text-sm font-semibold'}>
                        {editForm.confirmed ? 'Confirmado' : 'No confirmado'}
                      </span>
                    </label>
                  ) : appt.confirmed ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">Confirmado</span>
                  ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">No confirmado</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    {editingId === appt._id ? (
                      <>
                        <button
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition cursor-pointer"
                          onClick={() => handleSave(appt._id)}
                        >
                          Guardar
                        </button>
                        <button
                          className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition cursor-pointer"
                          onClick={() => setEditingId(null)}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="px-3 py-1 bg-green-700 text-white rounded hover:bg-green-800 transition cursor-pointer"
                          onClick={() => handleEdit(appt)}
                        >
                          Editar
                        </button>
                        <button
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
                          onClick={() => confirmDelete(appt._id)}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}