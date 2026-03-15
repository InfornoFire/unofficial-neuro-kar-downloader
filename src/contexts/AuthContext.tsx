import { createContext, useContext, useEffect, useState } from "react";
import {
  clearAccessToken,
  clearPersistedToken,
  loadPersistedToken,
  persistAccessToken,
  setAccessToken,
} from "@/api/auth";

interface AuthContextValue {
  isSignedIn: boolean;
  signIn: (token: string, expiresIn: number) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  isSignedIn: false,
  signIn: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const token = loadPersistedToken();
    if (token) {
      setAccessToken(token);
      setIsSignedIn(true);
    }
  }, []);

  const signIn = (token: string, expiresIn: number) => {
    persistAccessToken(token, expiresIn);
    setIsSignedIn(true);
  };

  const signOut = () => {
    clearAccessToken();
    clearPersistedToken();
    setIsSignedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
