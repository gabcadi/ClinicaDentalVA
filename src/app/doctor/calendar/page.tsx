'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import AppointmentsFullCalendar from '@/components/ui/calendar';

const AppointmentsPage = () => {
  const [form, setForm] = useState({
    description: '',
    date: '',
    time: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8">
      <div className="w-full max-w-4xl">
        <AppointmentsFullCalendar />
      </div>
    </div>
  );
};

export default AppointmentsPage;