import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  currentUser: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    console.log('Login:', email);
    // Simulation pour l'instant
    setCurrentUser({ email, id: '1' });
  };

  const register = async (email: string, password: string, displayName: string) => {
    console.log('Register:', email, displayName);
    // Simulation pour l'instant
    setCurrentUser({ email, displayName, id: '1' });
  };

  const logout = async () => {
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

