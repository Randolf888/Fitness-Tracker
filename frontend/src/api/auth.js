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
