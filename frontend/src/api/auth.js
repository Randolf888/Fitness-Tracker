import client from './client';

export const register = async (payload) => {
  const { data } = await client.post('/auth/register', payload);
  return data.data;
};

export const login = async (payload) => {
  const { data } = await client.post('/auth/login', payload);
  return data.data;
};
