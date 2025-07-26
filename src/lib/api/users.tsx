import api from '@/lib/api/axiosInstance'; 

export const getUsers = async () => {
  const res = await api.get('/users');
  if (res.status !== 200) {
    throw new Error('Error fetching users');
  }
  return res.data;  
};

export const getUserById = async (id: string) => {
  const res = await api.get(`/users/${id}`);
  if (res.status !== 200) {
    throw new Error(`Error fetching user with ID ${id}`);
  }
  return res.data;
};

export const updateUserRole = async (id: string, role: string) => {
  const res = await api.put(`/users/${id}/role`, { role });
  if (res.status !== 200) {
    throw new Error(`Error updating role for user with ID ${id}`);
  }
  return res.data;
}