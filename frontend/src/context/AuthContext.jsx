import { createContext, useState, useEffect } from "react";
import api from "../lib/api";

// ignore:start
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();
// ignore:end

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const res = await api.get("/users", { withCredentials: true });
        console.log("Auth check response:", res);
        if (res.status === 200) {
          setIsAuthenticated(true);
          setUser({
            userID: res.data.userID,
            email: res.data.email,
            username: res.data.username,
            mfaEnabled: res.data.mfaEnabled,
            role: res.data.role,
            createdAt: res.data.createdAt,
          });
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [setIsAuthenticated, setUser, setLoading]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        setIsAuthenticated,
        setUser,
        setLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
