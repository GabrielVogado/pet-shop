import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../../shared/hooks/useAuth';
import { getToken, setToken as saveToken, clearToken } from '../../shared/api/httpClient';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getToken();
    if (stored) {
      try {
        const payload = JSON.parse(atob(stored.split('.')[1]));
        setUser(payload);
      } catch {
        clearToken();
        setToken(null);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((newToken, userData) => {
    saveToken(newToken);
    setToken(newToken);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setToken(null);
    setUser(null);
  }, []);

  const isOwner = user?.groups?.includes('owner');
  const isTutor = !isOwner;

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isOwner, isTutor }}>
      {children}
    </AuthContext.Provider>
  );
}
