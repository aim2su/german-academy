import apiClient from "./client";

export const leadsApi = {
  getAll: (page = 1, pageSize = 20) =>
    apiClient.get("/api/leads", { params: { page, pageSize } }),

  getById: (id) => apiClient.get(`/api/leads/${id}`),

  updateStatus: (id, isProcessed) =>
    apiClient.patch(`/api/leads/${id}/status`, { isProcessed }),
};