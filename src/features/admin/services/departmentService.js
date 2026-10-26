import api from "../../../config/api";

export const getDepartments = async () => {
  const { data } = await api.get("/api/departments");
  return data?.data || data;
};

export const createDepartment = async (payload) => {
  const { data } = await api.post("/api/departments", payload);
  return data?.data || data;
};

export const updateDepartment = async (id, payload) => {
  const { data } = await api.patch(`/api/departments/${id}`, payload);
  return data?.data || data;
};

export const deleteDepartment = async (id) => {
  const { data } = await api.delete(`/api/departments/${id}`);
  return data?.data || data;
};
