import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .me()
      .then(({ data }) => setAdmin(data))
      .catch(() => localStorage.clear())
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const { data } = await authApi.login(username, password);
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    setAdmin({ username: data.username, role: data.role });
    return data;
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {
      }
    }
    localStorage.clear();
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}