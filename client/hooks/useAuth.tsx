import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthStatus } from "../../shared/auth";

interface AuthContextType {
  auth: AuthStatus;
  login: (token: string, user: any) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthStatus>({
    isAuthenticated: false,
  });

  const login = (token: string, user: any) => {
    localStorage.setItem("auth_token", token);
    setAuth({
      isAuthenticated: true,
      user,
    });
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setAuth({
      isAuthenticated: false,
    });
  };

  const checkAuth = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setAuth({ isAuthenticated: false });
      return;
    }

    try {
      const response = await fetch("/api/auth/status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAuth({
          isAuthenticated: true,
          user: data.user,
        });
      } else {
        logout();
      }
    } catch (error) {
      logout();
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
