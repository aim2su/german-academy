import apiClient from "./client";

export const adminsApi = {
  getAll: () => apiClient.get("/api/admins"),
  getById: (id) => apiClient.get(`/api/admins/${id}`),
  create: (username, password) =>
    apiClient.post("/api/admins", { username, password }),
  toggleActive: (id) => apiClient.patch(`/api/admins/${id}/toggle-active`),
};