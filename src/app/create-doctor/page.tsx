'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CreateDoctorUser() {
  const [formData, setFormData] = useState({
    fullName: 'Dr. Marco Test',
    email: 'doctor@test.com',
    password: 'doctor123'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: 'doctor'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult('✅ Usuario doctor creado exitosamente!');
      } else {
        setResult(`❌ Error: ${data.error || 'Error desconocido'}`);
      }
    } catch (error) {
      setResult(`❌ Error de red: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Crear Usuario Doctor</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre Completo:</label>
            <Input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Contraseña:</label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creando...' : 'Crear Usuario Doctor'}
          </Button>
        </form>

        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p>{result}</p>
          </div>
        )}

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-semibold text-yellow-800 mb-2">Instrucciones:</h3>
          <ol className="text-sm text-yellow-700 list-decimal list-inside space-y-1">
            <li>Crea el usuario doctor con este formulario</li>
            <li>Ve a <code>/sign-in</code> e inicia sesión con las credenciales</li>
            <li>Después ve a <code>/doctor</code> para probar el acceso</li>
          </ol>
        </div>
      </div>
    </div>
  );
}