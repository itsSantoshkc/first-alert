import { createContext, useState, useContext } from "react";

interface UserContextType {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    accessToken: string;
  } | null;
  setUser: (user: UserContextType["user"]) => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserContextType["user"]>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be inside UserProvider");
  return ctx;
}
