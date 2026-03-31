import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { setAuthTokenGetter } from "@workspace/api-client-react";

export interface CurrentUser {
  id: number;
  fullName: string;
  email: string;
  community: string;
  deptRoles: string[];
  photoDataUrl: string | null;
}

interface AuthContextValue {
  currentUser: CurrentUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUserFromRegistration: (user: CurrentUser, token: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("auth_token"));
  const [isLoading, setIsLoading] = useState(true);

  const storeAuth = useCallback((user: CurrentUser, tok: string) => {
    setCurrentUser(user);
    setToken(tok);
    localStorage.setItem("auth_token", tok);
    localStorage.setItem("auth_user", JSON.stringify(user));
    setAuthTokenGetter(() => tok);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setAuthTokenGetter(null);
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");
    if (savedToken && savedUser) {
      try {
        const user = JSON.parse(savedUser) as CurrentUser;
        setCurrentUser(user);
        setToken(savedToken);
        setAuthTokenGetter(() => savedToken);
      } catch {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    storeAuth(data.user, data.token);
  }, [storeAuth]);

  const setUserFromRegistration = useCallback((user: CurrentUser, tok: string) => {
    storeAuth(user, tok);
  }, [storeAuth]);

  return (
    <AuthContext.Provider value={{ currentUser, token, isLoading, login, logout, setUserFromRegistration }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
