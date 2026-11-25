import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("nexusflow_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("nexusflow_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (token) {
        try {
          const res = await API.get("/auth/me");
          setUser(res.data.data.user);
          localStorage.setItem("nexusflow_user", JSON.stringify(res.data.data.user));
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    const { token: newToken, user: userData } = res.data.data;
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("nexusflow_token", newToken);
    localStorage.setItem("nexusflow_user", JSON.stringify(userData));
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await API.post("/auth/register", { name, email, password });
    const { token: newToken, user: userData } = res.data.data;
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("nexusflow_token", newToken);
    localStorage.setItem("nexusflow_user", JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("nexusflow_token");
    localStorage.removeItem("nexusflow_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
