import client from './client';

export const register = async (payload) => {
  const { data } = await client.post('/auth/register', payload);
  return { user: data.data, message: data.message };
};

export const login = async (payload) => {
  const { data } = await client.post('/auth/login', payload);
  return data.message;
};

export const verifyLogin = async (payload) => {
  const { data } = await client.post('/auth/verify-login', payload);
  return { user: data.data, token: data.token };
};

export const fetchUsers = async (params = {}) => {
  const { data } = await client.get('/auth/users', { params });
  return data;
};

export const fetchAdminStats = async () => {
  const { data } = await client.get('/auth/stats');
  return data.data;
};

export const updateUserAccount = async (id, payload) => {
  const { data } = await client.put(`/auth/${id}`, payload);
  return data.data;
};

export const deleteUserAccount = async (id) => {
  const { data } = await client.delete(`/auth/${id}`);
  return data;
};
