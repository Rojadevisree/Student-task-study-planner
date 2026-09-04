import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AUTH_SESSION_EVENT,
  getMe,
  getStoredToken,
  loginRequest,
  logoutRequest,
  registerRequest,
  setStoredToken,
} from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getStoredToken());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const storedToken = getStoredToken();

      if (!storedToken) {
        setUser(null);
        setToken(null);
        setIsLoading(false);
        return;
      }

      try {
        const result = await getMe();
        setUser(result.data.user);
        setToken(storedToken);
      } catch {
        setStoredToken(null);
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  useEffect(() => {
    function clearSession() {
      setUser(null);
      setToken(null);
    }

    window.addEventListener(AUTH_SESSION_EVENT, clearSession);
    return () => window.removeEventListener(AUTH_SESSION_EVENT, clearSession);
  }, []);

  const applyAuth = useCallback((result) => {
    const nextToken = result.data.token;
    const nextUser = result.data.user;
    setStoredToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const result = await loginRequest({ email, password });
      applyAuth(result);
      navigate("/dashboard");
      return result;
    },
    [applyAuth, navigate]
  );

  const register = useCallback(
    async (payload) => {
      const result = await registerRequest(payload);
      applyAuth(result);
      navigate("/dashboard");
      return result;
    },
    [applyAuth, navigate]
  );

  const logout = useCallback(async () => {
    try {
      if (getStoredToken()) {
        await logoutRequest();
      }
    } catch {
      // Client still logs out even if the API call fails.
    }

    setStoredToken(null);
    setUser(null);
    setToken(null);
    navigate("/login");
  }, [navigate]);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user),
      setUser,
      login,
      register,
      logout,
    }),
    [user, token, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
