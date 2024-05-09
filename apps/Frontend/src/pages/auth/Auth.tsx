// AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const initialAuthContext: AuthContextType = {
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(initialAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => {
    // Your login logic
    setIsLoggedIn(true);
  };

  const logout = () => {
    // Your logout logic
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
