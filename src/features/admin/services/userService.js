import api from "../../../config/api";

export const getUsers = async (params = {}) => {
  const { data } = await api.get("/api/users", { params });
  return data?.data || data;
};

export const createUser = async (payload) => {
  const { data } = await api.post("/api/users", payload);
  return data?.data || data;
};

export const getUserById = async (id) => {
  const { data } = await api.get(`/api/users/${id}`);
  return data?.data || data;
};

export const updateUser = async (id, payload) => {
  const { data } = await api.patch(`/api/users/${id}`, payload);
  return data?.data || data;
};

export const resetUserPassword = async (id, newPassword) => {
  const { data } = await api.post(`/api/users/${id}/reset-password`, { newPassword });
  return data?.data || data;
};
