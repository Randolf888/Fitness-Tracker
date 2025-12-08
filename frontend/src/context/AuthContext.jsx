import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  saveSession: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    const stored = localStorage.getItem('fitlog-session');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (_) {
        return { user: null, token: null };
      }
    }

    const legacyUser = localStorage.getItem('fitlog-user');
    if (legacyUser) {
      try {
        return { user: JSON.parse(legacyUser), token: null };
      } catch (_) {
        return { user: null, token: null };
      }
    }

    return { user: null, token: null };
  });

  useEffect(() => {
    if (session?.user || session?.token) {
      localStorage.setItem('fitlog-session', JSON.stringify(session));
    } else {
      localStorage.removeItem('fitlog-session');
    }
    localStorage.removeItem('fitlog-user');
  }, [session]);

  const value = useMemo(() => ({
    user: session?.user || null,
    token: session?.token || null,
    isAuthenticated: Boolean(session?.token),
    saveSession: (user, token) => setSession({ user, token }),
    logout: () => setSession({ user: null, token: null })
  }), [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
