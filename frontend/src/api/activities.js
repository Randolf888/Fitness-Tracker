import client from './client';

export const fetchActivities = async (params = {}) => {
  const { data } = await client.get('/activities', { params });
  return data;
};

export const createActivity = async (payload) => {
  const { data } = await client.post('/activities', payload);
  return data.data;
};

export const updateActivity = async (id, payload) => {
  const { data } = await client.put(`/activities/${id}`, payload);
  return data.data;
};

export const deleteActivity = async (id) => {
  const { data } = await client.delete(`/activities/${id}`);
  return data;
};
