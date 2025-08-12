'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  Download, 
  Trash2, 
  ZoomIn,
  Calendar,
  FileType,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { getPatientById } from '@/lib/api/patients';
import { getUserById } from '@/lib/api/users';
import { Patient, User } from '@/lib/types/interfaces';
import { MedicalImage } from '@/app/models/patients';
import { InlineTextSkeleton } from '@/components/ui/loading-skeletons';

// Type guard para verificar si userId es un objeto User
const isUser = (userId: unknown): userId is User => {
  return userId !== null && typeof userId === 'object' && 'fullName' in (userId as Record<string, unknown>);
};

const typeLabels: { [key: string]: string } = {
  radiography: 'Radiografía',
  photo: 'Fotografía intraoral',
  panoramic: 'Panorámica',
  scan: 'Escáner 3D',
  other: 'Otro'
};

export default function PatientImagesPage() {
  const params = useParams();
  const patientId = params?.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [images, setImages] = useState<MedicalImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<MedicalImage | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!patientId) return;

      try {
        setLoading(true);
        
        // Obtener paciente
        const patientData = await getPatientById(patientId);
        setPatient(patientData);

        // Obtener usuario si existe
        if (patientData.userId) {
          if (isUser(patientData.userId)) {
            setUser(patientData.userId);
          } else {
            const userData = await getUserById(patientData.userId.toString());
            setUser(userData);
          }
        }

        // Obtener imágenes
        const imagesResponse = await fetch(`/api/patients/${patientId}/images`);
        if (imagesResponse.ok) {
          const imagesData = await imagesResponse.json();
          setImages(imagesData.images || []);
        }

      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) return;

    try {
      setIsDeleting(imageId);
      
      const response = await fetch(`/api/patients/${patientId}/images?imageId=${imageId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setImages(prevImages => prevImages.filter(img => img._id !== imageId));
      } else {
        alert('Error al eliminar la imagen');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error al eliminar la imagen');
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('es-CR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-white px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href={`/doctor/pacientes/${patientId}`}
            className="flex items-center gap-2 text-sky-600 hover:text-sky-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al paciente
          </Link>
        </div>

        <header className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-sky-700 tracking-tight">
                    Imágenes Médicas
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Paciente: {user?.fullName || 'Información no disponible'}
                  </p>
                  {patient && (
                    <p className="text-sm text-gray-500">
                      Cédula: {patient.id} • Edad: {patient.age} años
                    </p>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-sky-600">
                  {images.length}
                </div>
                <div className="text-sm text-gray-500">
                  {images.length === 1 ? 'Imagen' : 'Imágenes'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Images Grid */}
        {images.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No hay imágenes médicas
            </h3>
            <p className="text-gray-500 mb-6">
              Este paciente aún no tiene imágenes médicas cargadas en el sistema.
            </p>
            <Link href={`/doctor/pacientes/${patientId}`}>
              <Button className="bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white">
                Volver al perfil del paciente
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div 
                key={image._id} 
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={`/api/images/${image.gridfsId}`}
                    alt={image.originalName}
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setSelectedImage(image)}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <Button
                      onClick={() => setSelectedImage(image)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 hover:bg-white/30 text-white border-white/30"
                      variant="outline"
                    >
                      <ZoomIn className="w-4 h-4 mr-2" />
                      Ver imagen
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700">
                      <FileType className="w-3 h-3" />
                      {typeLabels[image.type] || image.type}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(image.uploadedAt)}
                    </span>
                  </div>

                  <h3 className="font-medium text-gray-900 mb-1 truncate">
                    {image.originalName}
                  </h3>
                  
                  {image.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {image.description}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedImage(image)}
                      className="flex-1"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = image.url;
                        link.download = image.originalName;
                        link.click();
                      }}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteImage(image._id)}
                      disabled={isDeleting === image._id}
                      className="text-red-600 hover:bg-red-50 border-red-200"
                    >
                      {isDeleting === image._id ? (
                        <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 cursor-pointer">
              <div className="relative">
                <img
                  src={`/api/images/${selectedImage.gridfsId}`}
                  alt={selectedImage.originalName}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="text-white">
                    <h3 className="text-lg font-semibold mb-2">{selectedImage.originalName}</h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="bg-white/20 px-2 py-1 rounded">
                        {typeLabels[selectedImage.type] || selectedImage.type}
                      </span>
                      <span>{formatDate(selectedImage.uploadedAt)}</span>
                    </div>
                    {selectedImage.description && (
                      <p className="mt-2 text-sm opacity-90">{selectedImage.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
