'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardDescription, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { TriangleAlert, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pending, setPending] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    // Datos deterministas para partículas (evita random y no afecta la lógica del formulario)
    const PARTICLES = [
        { l: '8%', t: '15%', d: '0s' }, { l: '18%', t: '40%', d: '1.5s' }, { l: '28%', t: '75%', d: '3s' },
        { l: '45%', t: '25%', d: '0.8s' }, { l: '60%', t: '60%', d: '2.2s' }, { l: '75%', t: '20%', d: '1.8s' },
        { l: '85%', t: '45%', d: '0.4s' }, { l: '92%', t: '80%', d: '2.8s' }, { l: '35%', t: '90%', d: '1.2s' },
        { l: '15%', t: '65%', d: '2.5s' }, { l: '50%', t: '85%', d: '1.1s' }, { l: '68%', t: '35%', d: '3.2s' },
        { l: '80%', t: '65%', d: '0.6s' }, { l: '95%', t: '30%', d: '2.4s' }, { l: '10%', t: '85%', d: '1.9s' }
    ];

    const ParticleLayer = () => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {PARTICLES.map((p, i) => (
                <span
                    key={i}
                    className="absolute block w-2.5 h-2.5 rounded-full bg-gradient-to-br from-cyan-400/40 to-blue-500/40 animate-float-dental will-change-transform"
                    style={{ left: p.l, top: p.t, animationDelay: p.d }}
                />
            ))}
        </div>
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPending(true);
        setError('');
        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });
        if (res?.ok) {
            toast.success('Inicio de sesión exitoso');
            router.push('/');
        } else if (res?.status === 401) {
            setError('Credenciales inválidas');
        } else {
            setError('Ocurrió un error. Intenta de nuevo.');
        }
        setPending(false);
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900/90 to-slate-950">
            {/* Patrón geométrico semitransparente */}
            <div className="absolute inset-0 opacity-25 mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJyBoZWlnaHQ9JzEwMCcgdmlld0JveD0nMCAwIDEwMCAxMDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PGcgc3Ryb2tlPSdyZ2JhKDIwNSwyNTUsMjU1LDAuMDMpJyBzdHJva2Utd2lkdGg9JzAuNSc+PHBhdGggZD0nTTAgMGw1MCA1MCA1MC01MCcvPjxwYXRoIGQ9J00wIDUwbDUwIDUwIDUwLTUwJyBzdHJva2U9J3JnYmEoMTI4LDIwNSwyNTUsMC4wNScpJy8+PC9nPjwvc3ZnPg==')]" />
            {/* Capa de partículas */}
            <ParticleLayer />
            {/* Halo suave detrás del card */}
            <div className="absolute inset-0">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial from-cyan-500/10 via-transparent to-transparent" />
            </div>

            <div className="relative w-full max-w-lg">
                <Card className="w-full border-slate-600/50 bg-slate-900/90 backdrop-blur-md shadow-[0_10px_45px_-10px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)] rounded-2xl overflow-hidden ring-1 ring-cyan-500/10">
                    <CardHeader className="space-y-4 pb-4 relative">
                        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
                        <div className="flex justify-center">
                            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium tracking-wide bg-gradient-to-r from-cyan-500/15 to-blue-600/15 border border-cyan-400/20 text-cyan-200 backdrop-blur-sm">
                                Acceso seguro
                            </span>
                        </div>
                        <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent drop-shadow">
                            Inicia Sesión
                        </CardTitle>
                        <CardDescription className="text-center px-2 sm:px-8 text-slate-300 leading-relaxed tracking-wide">
                            Usa tu correo y contraseña para acceder a tu cuenta
                        </CardDescription>
                    </CardHeader>
                    
                    {error && (
                        <div className="mx-6 mb-3 bg-red-600/15 p-3 rounded-lg flex items-center gap-x-3 text-sm text-red-400 border border-red-500/40 animate-in fade-in slide-in-from-top-2 shadow-inner" role="alert" aria-live="assertive">
                            <TriangleAlert className="h-5 w-5 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}
                    
                    <CardContent className="pt-2 px-4 sm:px-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative group">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-500 group-focus-within:text-cyan-300 transition-colors" />
                                <Input
                                    type="email"
                                    disabled={pending}
                                    placeholder="Correo Electrónico"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="pl-10 h-11 bg-slate-800/80 border-slate-600 text-slate-100 placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:border-cyan-400 focus:bg-slate-800 transition-colors"
                                    aria-label="Correo electrónico"
                                />
                            </div>
                            
                            <div className="relative group">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-500 group-focus-within:text-cyan-300 transition-colors" />
                                <Input
                                    type="password"
                                    disabled={pending}
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pl-10 h-11 bg-slate-800/80 border-slate-600 text-slate-100 placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:border-cyan-400 focus:bg-slate-800 transition-colors"
                                    aria-label="Contraseña"
                                />
                            </div>
                            
                            <Button 
                                className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 hover:from-cyan-400 hover:via-cyan-500 hover:to-blue-500 text-white font-semibold transition-all shadow-lg shadow-cyan-900/40 hover:shadow-cyan-800/50 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed"
                                size="lg" 
                                disabled={pending}
                            >
                                {pending ? 'Iniciando...' : 'Iniciar sesión'}
                            </Button>
                        </form>
                    </CardContent>
                    
                    <CardFooter className="flex flex-col items-center pt-2 px-4 sm:px-8 pb-6">
                        <Separator className="w-full mb-5 bg-white/15" />
                        <p className="text-sm text-slate-300 text-center">
                            ¿No tienes usuario?{' '}
                            <Link className="text-cyan-300 font-semibold hover:text-cyan-200 underline-offset-4 hover:underline transition-colors" href="/sign-up">
                                ¡Regístrate ya!
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>

            <style jsx>{`
                @keyframes float-dental { 0%,100% { transform: translateY(0) scale(1); opacity:.35 } 50% { transform: translateY(-28px) scale(1.15); opacity:.8 } }
                .animate-float-dental { animation: float-dental 9s ease-in-out infinite; }
                .bg-radial { background: radial-gradient(circle at center, rgba(34,211,238,0.18), rgba(0,0,0,0) 60%); }
            `}</style>
        </div>
    );
};

export default SignIn;