import api from '@/lib/api/axiosInstance'; 

export const getUsers = async () => {
  const res = await api.get('/users');
  if (res.status !== 200) {
    throw new Error('Error fetching users');
  }
  return res.data;  
};

export const getUserById = async (_id: string) => {
  const res = await api.get(`/users/${_id}`);
  if (res.status !== 200) {
    throw new Error(`Error fetching user with ID ${_id}`);
  }
  return res.data;
};