'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Package } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  materialName: string;
  isDeleting: boolean;
}

export default function ConfirmDeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  materialName,
  isDeleting 
}: ConfirmDeleteModalProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-gray-900 via-red-900/80 to-gray-900 border border-red-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            Confirmar Eliminación
          </DialogTitle>
          <p className="text-red-300 text-sm text-left">
            Esta acción no se puede deshacer
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Material Info */}
          <div className="bg-white/5 rounded-xl p-4 border border-red-500/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <p className="text-white font-medium">
                  {materialName}
                </p>
                <p className="text-red-300 text-sm">
                  Se eliminará permanentemente
                </p>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-300 text-sm font-medium mb-1">
                  ¿Estás seguro?
                </p>
                <p className="text-red-400 text-xs">
                  Este material será eliminado del registro de la consulta y no podrás recuperarlo.
                </p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 cursor-pointer"
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white cursor-pointer"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Eliminando...
                </div>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Eliminar Material
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
