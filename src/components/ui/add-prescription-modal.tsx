'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pill } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que todos los campos requeridos estén llenos
    if (!formData.medication.trim() || 
        !formData.dosage.trim() || 
        !formData.duration.trim() || 
        !formData.instructions.trim()) {
      console.error('All fields are required');
      return;
    }
    
    setIsLoading(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Error adding prescription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      medication: '',
      dosage: '',
      duration: '',
      instructions: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-gray-900 via-blue-900/80 to-gray-900 border border-blue-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Pill className="w-5 h-5 text-white" />
            </div>
            Nueva Receta
          </DialogTitle>
          <p className="text-blue-300 text-sm text-left">
            Ingresá los detalles de la receta médica
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Medicamento */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Medicamento
            </label>
            <Input
              name="medication"
              type="text"
              placeholder="ej. Ibuprofeno 400mg"
              value={formData.medication}
              onChange={handleChange}
              className="w-full bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
              required
            />
          </div>

          {/* Dosis */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Dosis
            </label>
            <Input
              name="dosage"
              type="text"
              placeholder="ej. 1 tableta cada 8 horas"
              value={formData.dosage}
              onChange={handleChange}
              className="w-full bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
              required
            />
          </div>

          {/* Duración */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duración
            </label>
            <Input
              name="duration"
              type="text"
              placeholder="ej. 7 días"
              value={formData.duration}
              onChange={handleChange}
              className="w-full bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
              required
            />
          </div>

          {/* Instrucciones */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Instrucciones
            </label>
            <textarea
              name="instructions"
              placeholder="ej. Tomar después de las comidas con abundante agua"
              value={formData.instructions}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
              disabled={isLoading}
              required
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
              disabled={!formData.medication.trim() || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </div>
              ) : (
                <>
                  <Pill className="w-4 h-4 mr-2" />
                  Guardar Receta
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}