'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AppointmentItem {
  _id: string;
  description: string;
  date: string;
  time: string;
  confirmed?: boolean;
  doctorReport?: string;
  totalPrice?: number;
}

export default function PatientAppointmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const loadAppointments = async () => {
      if (status === 'loading') return;

      if (!session) {
        router.push('/sign-in');
        return;
      }

      try {
        const email = session.user?.email;
        if (!email) throw new Error('No se encontró el correo del usuario');

        const patientRes = await fetch(`/api/patients/by-user?email=${encodeURIComponent(email)}`);
        if (!patientRes.ok) throw new Error('No se pudo obtener el paciente');
        const patient = await patientRes.json();

        const pid = typeof patient._id === 'string' ? patient._id : patient._id?.toString?.();
        if (!pid) throw new Error('Paciente inválido');

        const apptRes = await fetch(`/api/appointments?patientId=${encodeURIComponent(pid)}`);
        if (!apptRes.ok) throw new Error('No se pudieron obtener las citas');
        const appts = await apptRes.json();
        setAppointments(appts);
        setError(null);
      } catch (e: any) {
        setError(e?.message || 'Error cargando citas');
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [session, status, router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold tracking-tight">Mis Citas</h1>
        <Card className="mt-6 p-6">
          <p>Cargando tus citas…</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold tracking-tight">Mis Citas</h1>
        <Card className="mt-6 p-6">
          <p className="text-red-600">{error}</p>
        </Card>
      </div>
    );
  }

  const currentOpen = appointments.find(a => a._id === openId) || null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold tracking-tight">Mis Citas</h1>
      <p className="text-muted-foreground mt-2">Visualiza y consulta detalles de tus citas médicas.</p>
      <Separator className="mt-4" />

      {appointments.length === 0 ? (
        <Card className="mt-6 p-6">
          <p>No tienes citas registradas.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {appointments.map((a) => (
            <Card key={a._id} className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-semibold">{a.description}</p>
                  <p className="text-sm text-muted-foreground">{a.date} • {a.time}</p>
                </div>
                <Badge variant={a.confirmed ? 'default' : 'secondary'}>
                  {a.confirmed ? 'Confirmada' : 'Pendiente'}
                </Badge>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setOpenId(a._id)}>Ver detalles</Button>
                <Link href={`/appointments/${a._id}`}>
                  <Button variant="default">Abrir</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!openId} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles de la cita</DialogTitle>
          </DialogHeader>
          {currentOpen ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Estado</span>
                <Badge variant={currentOpen.confirmed ? 'default' : 'secondary'}>
                  {currentOpen.confirmed ? 'Confirmada' : 'Pendiente'}
                </Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Fecha</p>
                  <p className="font-medium">{currentOpen.date}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Hora</p>
                  <p className="font-medium">{currentOpen.time}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Descripción</p>
                  <p className="font-medium">{currentOpen.description}</p>
                </div>
                {typeof currentOpen.totalPrice === 'number' && (
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-medium">₡ {currentOpen.totalPrice.toFixed(2)}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Link href={`/appointments/${currentOpen._id}`}>
                  <Button variant="default">Abrir página</Button>
                </Link>
                <Button variant="outline" onClick={() => setOpenId(null)}>Cerrar</Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
