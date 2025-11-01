import type React from "react";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import AuthService from "../services/auth.service";
import type { User } from "../models/User";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = (props: AuthProviderProps) => {
  const authService = new AuthService();
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setTokenState(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      refreshUser();
    }
    else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [token]);

  const setToken = useCallback((newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
    }
    else {
      localStorage.removeItem("token");
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) {
      return;
    }
    
    try {
      const decodedUser = await authService.decodeToken(token);
      setUser(decodedUser);
      setIsAuthenticated(true);
    }
    catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("token");
    }
  }, [token]);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setToken(null);
  }, [setToken]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    setToken,
    refreshUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthProvider;
