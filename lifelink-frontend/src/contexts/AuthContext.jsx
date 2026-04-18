/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";
import { login as loginApi } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("lifelinkAuth") || "null");
    } catch {
      return null;
    }
  });

  const value = useMemo(
    () => ({
      user: session?.user || null,
      isAuthenticated: Boolean(session?.user),
      async login(email, password) {
        const response = await loginApi({ email, password });
        const nextSession = { token: response.token, user: response.user };
        localStorage.setItem("lifelinkAuth", JSON.stringify(nextSession));
        setSession(nextSession);
        return response.user;
      },
      logout() {
        localStorage.removeItem("lifelinkAuth");
        setSession(null);
      },
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
