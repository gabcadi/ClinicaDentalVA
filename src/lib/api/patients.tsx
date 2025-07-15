import api from '@/lib/api/axiosInstance';

export const getPatients = async () => {
  const res = await api.get('/patients');
  if (res.status !== 200) {
    throw new Error('Error fetching patients');
  }
  return res.data;  
};
