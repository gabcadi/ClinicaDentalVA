"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail, Send, ArrowLeft } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('El correo electrónico es requerido');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Por favor ingresa un correo electrónico válido');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailSent(true);
        toast.success('Correo enviado exitosamente');
      } else {
        toast.error(data.error || 'Error al enviar el correo');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setEmailSent(false);
    setLoading(false);
    onClose();
  };

  const handleBackToLogin = () => {
    setEmailSent(false);
    setEmail('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl">
        {!emailSent ? (
          <>
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-800">
                ¿Olvidaste tu contraseña?
              </CardTitle>
              <CardDescription className="text-slate-600">
                Ingresa el correo electrónico registrado en tu cuenta y te enviaremos un enlace para restablecer tu contraseña
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Correo Electrónico
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    required
                    className="w-full"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-600"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </div>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Enlace
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Send className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-800">
                ¡Correo Enviado!
              </CardTitle>
              <CardDescription className="text-slate-600">
                Hemos enviado un enlace de restablecimiento a <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Próximos pasos:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Revisa tu bandeja de entrada</li>
                  <li>• Busca en spam si no lo encuentras</li>
                  <li>• El enlace expira en 1 hora</li>
                  <li>• Haz clic en el enlace para restablecer tu contraseña</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToLogin}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
                <Button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-700"
                >
                  Cerrar
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}