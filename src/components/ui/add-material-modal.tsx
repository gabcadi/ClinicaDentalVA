'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Package, X } from 'lucide-react';

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; type: string; quantity: number }) => void;
  isLoading: boolean;
}

const materialTypes = [
  { value: 'consumible', label: 'Consumible' },
  { value: 'instrumental', label: 'Instrumental' },
  { value: 'medicamento', label: 'Medicamento' },
  { value: 'protesico', label: 'Protésico' },
  { value: 'ortodontico', label: 'Ortodóntico' },
  { value: 'otro', label: 'Otro' }
];

export default function AddMaterialModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  isLoading 
}: AddMaterialModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'consumible',
    quantity: 1
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseInt(value) || 1 : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Error adding material:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      type: 'consumible',
      quantity: 1
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-gray-900 via-purple-900/80 to-gray-900 border border-purple-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            Agregar Material
          </DialogTitle>
          <p className="text-purple-300 text-sm text-left">
            Registra el material utilizado en la consulta
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Nombre del Material */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nombre del Material
            </label>
            <Input
              name="name"
              type="text"
              placeholder="ej. Jeringa desechable 5ml"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-purple-500 focus:border-purple-500"
              disabled={isLoading}
              required
            />
          </div>

          {/* Tipo de Material */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipo de Material
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              disabled={isLoading}
            >
              {materialTypes.map((type) => (
                <option key={type.value} value={type.value} className="bg-gray-800 text-white">
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Cantidad */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cantidad
            </label>
            <Input
              name="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full bg-white/10 border-white/20 text-white focus:ring-purple-500 focus:border-purple-500"
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
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              disabled={!formData.name.trim() || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Agregando...
                </div>
              ) : (
                <>
                  <Package className="w-4 h-4 mr-2" />
                  Agregar Material
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
