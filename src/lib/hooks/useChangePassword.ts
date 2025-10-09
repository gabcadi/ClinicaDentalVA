import { useState } from 'react';
import { toast } from 'sonner';

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export function useChangePassword() {
  const [loading, setLoading] = useState(false);

  const changePassword = async (data: ChangePasswordData) => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Contraseña actualizada exitosamente');
        return { success: true };
      } else {
        toast.error(result.error || 'Error al cambiar la contraseña');
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión. Intenta de nuevo.');
      return { success: false, error: 'Error de conexión' };
    } finally {
      setLoading(false);
    }
  };

  return {
    changePassword,
    loading
  };
}