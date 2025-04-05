import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("current_user");
    return {
      creds: storedUser ? JSON.parse(storedUser) : null,
      role: localStorage.getItem("user_role") ?? null,
      token: localStorage.getItem("user_token") ?? null,
      name: storedUser ? JSON.parse(storedUser).name : null, 
    };
  });

  function setAuth(role, token, user = null) {
    localStorage.setItem("current_user", JSON.stringify(user));
    localStorage.setItem("user_role", role);
    localStorage.setItem("user_token", token);
    setUser({
      role,
      token,
      creds: user,
      name: user?.name || null, 
    });
  }

  function revokeAuth() {
    localStorage.removeItem("current_user");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_token");
    setUser({ role: null, token: null, creds: null, name: null });
  }

  return (
    <AuthContext.Provider value={{ user, setAuth, revokeAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
