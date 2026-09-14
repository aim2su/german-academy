import apiClient from "./client";

export const authApi = {
  login: (username, password) =>
    apiClient.post("/api/auth/login", { username, password }),

  logout: (refreshToken) =>
    apiClient.post("/api/auth/logout", { refreshToken }),

  me: () => apiClient.get("/api/auth/me"),

  changePassword: (currentPassword, newPassword) =>
    apiClient.post("/api/auth/change-password", {
      currentPassword,
      newPassword,
    }),
};