'use client';

import { useState } from 'react';
import { Pill, X } from 'lucide-react';

interface AddPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    medication: string;
    dosage: string;
    duration: string;
    instructions: string;
  }) => void;
}


export default function AddPrescriptionModal({ 
  isOpen, 
  onClose, 
  onSubmit 
}: AddPrescriptionModalProps) {
  const [formData, setFormData] = useState({
    medication: '',
    dosage: '',
    duration: '',
    instructions: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl w-full max-w-md relative">
        <button
          className="absolute top-4 right-4 text-white hover:text-gray-300"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>

        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Pill className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Nueva Receta</h2>
              <p className="text-blue-300">Ingresá los detalles de la receta</p>
            </div>
          </div>

          <div className="space-y-4">
            <input
              name="medication"
              type="text"
              placeholder="Medicamento"
              value={formData.medication}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl bg-white/5 text-white placeholder:text-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              name="dosage"
              type="text"
              placeholder="Dosis"
              value={formData.dosage}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl bg-white/5 text-white placeholder:text-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              name="duration"
              type="text"
              placeholder="Duración"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl bg-white/5 text-white placeholder:text-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              name="instructions"
              placeholder="Instrucciones"
              value={formData.instructions}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl bg-white/5 text-white placeholder:text-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>

          <div className="mt-6 text-right">
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-2 rounded-xl"
            >
              Guardar Receta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};