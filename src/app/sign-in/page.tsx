'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { TriangleAlert } from 'lucide-react';
import Link from 'next/link';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pending, setPending] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

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
        <div className="h-full flex items-center justify-center bg-[#1b0918]">
            <Card className="md:h-auto w-[80%] sm:w-[420px] p-4 sm:p-8">
                <CardHeader>
                    <CardTitle className="text-center">Inicia Sesión</CardTitle>
                    <CardDescription className="text-sm text-center text-accent-foreground">
                        Usa tu correo y contraseña para acceder a tu cuenta
                    </CardDescription>
                </CardHeader>
                {error && (
                    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
                        <TriangleAlert />
                        <p>{error}</p>
                    </div>
                )}
                <CardContent className="px-2 sm:px-6">
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <Input
                            type="email"
                            disabled={pending}
                            placeholder="Correo Electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            disabled={pending}
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button className="w-full" size="lg" disabled={pending}>
                            Iniciar sesión
                        </Button>
                    </form>
                    <Separator className="mt-2" />
                    <div className="text-center text-sm mt-2 text-muted-foreground">
                        ¿No tienes usuario?{' '}
                        <Link className="text-sky-700 ml-1 hover:underline cursor-pointer" href="/sign-up">
                            ¡Regístrate ya!
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignIn;