import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("voxmate_user");
    return saved ? JSON.parse(saved) : null;
  });

  const saveLogin = (data) => {
    localStorage.setItem("voxmate_token", data.token);
    localStorage.setItem("voxmate_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    saveLogin(response.data);
    return response.data;
  };

  const signup = async (name, email, password) => {
    const response = await api.post("/auth/signup", {
      name,
      email,
      password,
    });

    saveLogin(response.data);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("voxmate_token");
    localStorage.removeItem("voxmate_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}