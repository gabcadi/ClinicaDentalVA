import api from '@/lib/api/axiosInstance';
import { IAppointment } from '@/app/models/appointments';

export const getAppointments = async (): Promise<IAppointment[]> => {
  const res = await api.get('/appointments');
  if (res.status !== 200) {
    throw new Error('Error fetching appointments');
  }
  return res.data;
};

export interface IFlattenedMaterial {
  _id?: string;
  name: string;
  type: string;
  quantity: number;
  createdAt: string | Date;
  appointmentId: string;
  appointmentDate: string;
  appointmentTime: string;
  description: string;
}

export const getAllMaterialsFromAppointments = async (): Promise<IFlattenedMaterial[]> => {
  const appointments = await getAppointments();
  const flattened: IFlattenedMaterial[] = [];
  appointments.forEach(ap => {
    (ap.materials || []).forEach(mat => {
      flattened.push({
        ...mat,
        createdAt: mat.createdAt,
        appointmentId: (ap as any)._id?.toString?.() || '',
        appointmentDate: ap.date,
        appointmentTime: ap.time,
        description: ap.description
      });
    });
  });
  // Ordenar por fecha de cita descendente y luego por createdAt material
  flattened.sort((a,b) => {
    const dateCmp = b.appointmentDate.localeCompare(a.appointmentDate);
    if (dateCmp !== 0) return dateCmp;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  return flattened;
};
