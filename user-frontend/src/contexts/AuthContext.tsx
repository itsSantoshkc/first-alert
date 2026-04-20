import { createContext, useState, useContext, type ReactNode } from "react";

interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  setAccessToken: (accessToken: string) => void;
  setUser: (data: User) => void;
  setAuth: (data: { user: User; accessToken: string } | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const localStorageUser = localStorage.getItem("user");
  const localStorageAccessToken = localStorage.getItem("accessToken");

  if (!user && localStorageUser) {
    setUser(JSON.parse(localStorageUser));
  }
  if (!accessToken && localStorageAccessToken) {
    setAccessToken(localStorageAccessToken);
  }

  const setAuth = (data: { user?: User; accessToken?: string } | null) => {
    if (!data) {
      setUser(null);
      setAccessToken(null);
      return;
    }
    if (data.user) {
      setUser(data.user);
    }
    if (data.accessToken) {
      setAccessToken(data.accessToken);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, setAuth, setAccessToken, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
