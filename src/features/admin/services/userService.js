import api from "../../../config/api";

export const getUsers = async (params = {}) => {
  // params could include department_id, role, etc.
  const { data } = await api.get("/api/identity/users", { params });
  return data.data; // assuming standard gateway response: { success, data, message }
};

export const createUser = async (payload) => {
  const { data } = await api.post("/api/identity/users", payload);
  return data.data;
};

export const updateUser = async (id, payload) => {
  const { data } = await api.put(`/api/identity/users/${id}`, payload);
  return data.data;
};

export const deleteUser = async (id) => {
  const { data } = await api.delete(`/api/identity/users/${id}`);
  return data.data;
};
