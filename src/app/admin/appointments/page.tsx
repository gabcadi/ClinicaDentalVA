'use client';

import { useEffect, useState } from 'react';

interface Appointment {
  _id: string;
  description: string;
  date: string;
  time: string;
}

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ description: '', date: '', time: '' });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const res = await fetch('/api/appointments');
    const data = await res.json();
    setAppointments(data);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/appointment/${id}`, { method: 'DELETE' });
    fetchAppointments();
  };

  const handleEdit = (appt: Appointment) => {
    setEditingId(appt._id);
    setEditForm({ description: appt.description, date: appt.date, time: appt.time });
  };

  const handleSave = async (id: string) => {
    await fetch(`/api/appointment/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    setEditingId(null);
    fetchAppointments();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-8">
      <h2 className="text-2xl font-bold mb-6">Gestión de Citas</h2>
      <div className="overflow-x-auto w-full max-w-3xl shadow-lg rounded-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-sky-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Descripción</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Fecha</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Hora</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {appointments.map((appt) => (
              <tr key={appt._id}>
                <td className="px-4 py-2">
                  {editingId === appt._id ? (
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={editForm.description}
                      onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                    />
                  ) : (
                    appt.description
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingId === appt._id ? (
                    <input
                      type="date"
                      className="border rounded px-2 py-1 w-full"
                      value={editForm.date}
                      onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                    />
                  ) : (
                    appt.date
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingId === appt._id ? (
                    <input
                      type="time"
                      className="border rounded px-2 py-1 w-full"
                      value={editForm.time}
                      onChange={e => setEditForm({ ...editForm, time: e.target.value })}
                    />
                  ) : (
                    appt.time
                  )}
                </td>
                <td className="px-4 py-2 space-x-2">
                  {editingId === appt._id ? (
                    <>
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        onClick={() => handleSave(appt._id)}
                      >
                        Guardar
                      </button>
                      <button
                        className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                        onClick={() => setEditingId(null)}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        onClick={() => handleEdit(appt)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        onClick={() => handleDelete(appt._id)}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}