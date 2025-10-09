"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Token inválido');
      router.push('/sign-in');
    }
  }, [token, router]);

  const validateForm = () => {
    if (!formData.password) {
      toast.error('La contraseña es requerida');
      return false;
    }
    
    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    // Validación adicional de seguridad
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumbers = /\d/.test(formData.password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      toast.error('La contraseña debe contener al menos una mayúscula, una minúscula y un número');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        toast.success('Contraseña restablecida exitosamente');
      } else {
        toast.error(data.error || 'Error al restablecer la contraseña');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'password' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Define the animated particles component
  const DentalParticle = ({ delay = 0 }) => (
    <div
      className="absolute w-3 h-3 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full animate-float-dental"
      style={{
        animationDelay: `${delay}s`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
    />
  );

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-750/40 to-slate-300 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold text-slate-800">Token Inválido</CardTitle>
            <CardDescription className="text-slate-600">
              El enlace no es válido o ha expirado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/sign-in">
              <Button className="w-full">Volver al Inicio de Sesión</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-750/40 to-slate-300 relative overflow-hidden">
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <DentalParticle key={i} delay={i * 0.3} />
        ))}
      </div>

      {/* Geometric background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CjxnIGZpbGw9InJnYmEoNTksIDEzMCwgMjQ2LCAwLjAzKSIgZmlsbC1ydWxlPSJub256ZXJvIj4KPHBhdGggZD0iTTUwIDUwbDEwLTEwdjIweiIvPgo8L2c+CjwvZz4KPC9zdmc+')] opacity-30"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl">
          {!success ? (
            <>
              <CardHeader className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white px-10" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-800">
                  Restablecer Contraseña
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Ingresa tu nueva contraseña
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nueva Contraseña */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Nueva Contraseña
                    </label>
                    <div className="relative password-input-container">
                      <Input
                        type={showPasswords.password ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Ingresa tu nueva contraseña"
                        className=""
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('password')}
                        className="absolute password-toggle-btn top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 cursor-pointer transition-colors duration-200 focus:outline-none focus:text-slate-700"
                      >
                        {showPasswords.password ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Mínimo 6 caracteres, debe incluir mayúsculas, minúsculas y números
                    </p>
                  </div>

                  {/* Confirmar Nueva Contraseña */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Confirmar Nueva Contraseña
                    </label>
                    <div className="relative password-input-container">
                      <Input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirma tu nueva contraseña"
                        className=""
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute password-toggle-btn top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 cursor-pointer transition-colors duration-200 focus:outline-none focus:text-slate-700"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Botón */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Restableciendo...
                        </div>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Restablecer Contraseña
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
                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-800">
                  ¡Contraseña Restablecida!
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Tu contraseña ha sido actualizada exitosamente
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-green-800 font-medium">
                    Ahora puedes iniciar sesión con tu nueva contraseña
                  </p>
                </div>

                <Link href="/sign-in">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                    Iniciar Sesión
                  </Button>
                </Link>
              </CardContent>
            </>
          )}
        </Card>
      </div>

      <style jsx>{`
        @keyframes float-dental {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
            opacity: 0.6;
          }
        }

        .animate-float-dental {
          animation: float-dental 8s ease-in-out infinite;
        }

        /* Estilos específicos para campos de contraseña con ícono */
        .password-input-container input {
          padding-right: 3rem !important; /* 48px */
          padding-left: 0.75rem !important; /* 12px */
        }
        
        .password-toggle-btn {
          right: 0.75rem; /* 12px */
          width: 1.5rem; /* 24px */
          height: 1.5rem; /* 24px */
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-750/40 to-slate-300 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
          <p className="text-lg font-medium text-cyan-300">Cargando...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}