import { createContext, useState, useContext, type ReactNode } from "react";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  setAuth: (data: { user: User; accessToken: string } | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const setAuth = (data: { user: User; accessToken: string } | null) => {
    if (!data) {
      setUser(null);
      setAccessToken(null);
      return;
    }

    setUser(data.user);
    setAccessToken(data.accessToken);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
