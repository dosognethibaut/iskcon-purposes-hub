import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  getCurrentUserFromStorage,
  loginUser,
  logoutUser,
  subscribeToLocalData,
} from "@/adi/lib/local-data";

export interface CurrentUser {
  id: number;
  fullName: string;
  email: string;
  dob: string;
  community: string;
  deptRoles: string[];
  photoDataUrl: string | null;
  isAdmin: boolean;
}

interface AuthContextValue {
  currentUser: CurrentUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUserFromRegistration: (user: CurrentUser, token: string) => void;
  updateCurrentUser: (partial: Partial<CurrentUser>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("auth_token"));
  const [isLoading, setIsLoading] = useState(true);

  const storeAuth = useCallback((user: CurrentUser, tok: string) => {
    setCurrentUser(user);
    setToken(tok);
    localStorage.setItem("auth_token", tok);
    localStorage.setItem("auth_user", JSON.stringify(user));
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setToken(null);
    logoutUser();
  }, []);

  useEffect(() => {
    const sync = () => {
      const savedToken = localStorage.getItem("auth_token");
      const user = getCurrentUserFromStorage();
      setCurrentUser(user);
      setToken(savedToken);
    };
    sync();
    setIsLoading(false);
    return subscribeToLocalData(sync);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const user = loginUser(email, password);
    storeAuth(user, String(user.id));
  }, [storeAuth]);

  const setUserFromRegistration = useCallback((user: CurrentUser, tok: string) => {
    storeAuth(user, tok);
  }, [storeAuth]);

  const updateCurrentUser = useCallback((partial: Partial<CurrentUser>) => {
    setCurrentUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...partial };
      localStorage.setItem("auth_user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, token, isLoading, login, logout, setUserFromRegistration, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
