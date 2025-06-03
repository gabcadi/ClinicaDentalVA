'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { TriangleAlert } from 'lucide-react';
import Link from 'next/link';

const SignUp = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPending(true);
        setError(null);

        if (form.password !== form.confirmPassword) {
            setError('Las contraseñas no coinciden');
            setPending(false);
            return;
        }

        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        const data = await res.json();

        if (res.ok) {
            toast.success(data.message || 'Registro exitoso');
            router.push('/sign-in');
        } else {
            setError(data.message || 'Ocurrió un error. Intenta de nuevo.');
        }
        setPending(false);
    };

    return (
        <div className="h-full flex items-center justify-center bg-[#1b0918]">
            <Card className="md:h-auto w-[80%] sm:w-[420px] p-4 sm:p-8">
                <CardHeader>
                    <CardTitle className="text-center">Regístrate</CardTitle>
                    <CardDescription className="text-sm text-center text-accent-foreground">
                        Crea tu usuario para la Clínica Vargas Araya
                    </CardDescription>
                </CardHeader>
                {error && (
                    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                        <TriangleAlert />
                        <p>{error}</p>
                    </div>
                )}
                <CardContent className="px-2 sm:px-6">
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <Input
                            type="text"
                            disabled={pending}
                            placeholder="Nombre completo"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                        <Input
                            type="email"
                            disabled={pending}
                            placeholder="Correo electrónico"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                        <Input
                            type="password"
                            disabled={pending}
                            placeholder="Contraseña"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                        <Input
                            type="password"
                            disabled={pending}
                            placeholder="Confirmar contraseña"
                            value={form.confirmPassword}
                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                            required
                        />
                        <Button className="w-full" size="lg" disabled={pending}>
                            Registrarse
                        </Button>
                    </form>
                    <Separator className="mt-2" />
                    <div className="text-center text-sm mt-2 text-muted-foreground">
                        ¿Ya tienes una cuenta?{' '}
                        <Link className="text-sky-700 ml-1 hover:underline cursor-pointer" href="/sign-in">
                            Inicia sesión
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignUp;