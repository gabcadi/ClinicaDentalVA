'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Image as ImageIcon, FileX } from 'lucide-react';

interface UploadImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, type: string, description: string) => Promise<void>;
  isUploading?: boolean;
}

const imageTypes = [
  { value: 'radiography', label: 'Radiografía' },
  { value: 'photo', label: 'Fotografía intraoral' },
  { value: 'panoramic', label: 'Panorámica' },
  { value: 'scan', label: 'Escáner 3D' },
  { value: 'other', label: 'Otro' }
];

export default function UploadImageModal({ 
  isOpen, 
  onClose, 
  onUpload, 
  isUploading = false 
}: UploadImageModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageType, setImageType] = useState('photo');
  const [description, setDescription] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Tipo de archivo no válido. Solo se permiten JPEG, PNG y WebP.');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('El archivo es demasiado grande. El tamaño máximo es 10MB.');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('Por favor selecciona una imagen');
      return;
    }

    try {
      await onUpload(selectedFile, imageType, description);
      handleClose();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    setDescription('');
    setImageType('photo');
    setDragOver(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-sky-600" />
            Subir Imagen Médica
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragOver
                ? 'border-sky-400 bg-sky-50'
                : selectedFile
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 bg-gray-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {preview ? (
              <div className="space-y-3">
                <div className="relative inline-block">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-32 max-w-full rounded-lg object-contain"
                  />
                  <button
                    onClick={() => handleFileSelect(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-sm text-gray-600">{selectedFile?.name}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className={`w-12 h-12 mx-auto ${dragOver ? 'text-sky-500' : 'text-gray-400'}`} />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Arrastra una imagen aquí o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, WebP hasta 10MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-block bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 cursor-pointer transition-colors"
                >
                  Seleccionar archivo
                </label>
              </div>
            )}
          </div>

          {/* Image Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de imagen
            </label>
            <select
              value={imageType}
              onChange={(e) => setImageType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              {imageTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (opcional)
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Radiografía preoperatoria, estado inicial..."
              className="w-full"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-sky-600 hover:bg-sky-700"
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Subiendo...
                </div>
              ) : (
                'Subir imagen'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
