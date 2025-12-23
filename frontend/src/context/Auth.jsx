import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { getSocket } from "../../socket";
// Helper to decode JWT and check expiry
function isTokenExpired(token) {
  if (!token) return true;
  
  try {
    
    const base64Url = token.split(".")[1];
    
    if (!base64Url) return true;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    const { exp } = JSON.parse(jsonPayload);
    if (!exp) return true;
    // exp is in seconds
    return Date.now() >= exp * 1000;
  } catch (err) {
    return true;
  }
}

const AuthContext = createContext();

const getInitialAuth = () => {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return { user: null, token: "" };
    const parsed = JSON.parse(raw);
    return {
      user: parsed.user ?? null,
      token: parsed.token ?? "",
    };
  } catch (err) {
    console.log(err)
    return { user: null, token: "" };
  }
};

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(getInitialAuth);
  const isAuthenticated = auth && !!auth.token && !isTokenExpired(auth.token);
  console.log("isAuthent8icated i", isAuthenticated);
 

  // Persist auth state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  // Set axios default header when token changes
  useEffect(() => {
    if (auth?.token) {
      axios.defaults.headers.common["Authorization"] = auth.token;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [auth.token]);

  // Auto-logout if token expired (on mount and token change)
  useEffect(() => {
    if (auth.token && isTokenExpired(auth.token)) {
      logout();
    }
  }, [auth.token]);

 const logout = async () => {
    try {
      console.log("inside auth.jsx logout");
      await axios.post("/api/v1/auth/logout", { userId: auth?.user?._id });
    } catch (err) {
      console.error("Logout error:", err);
    }
    setAuth({ user: null, token: "" });
    localStorage.removeItem("auth");
  };
  useEffect(() => {
  const socket = getSocket();
  if (!socket) return;

  socket.on("forceLogout", ({ userId, reason }) => {
    if (auth?.user?._id === userId) {
      toast.error(reason);
      logout();
    }
  });

  return () => socket.off("forceLogout");
}, [auth]);


  return (
    <AuthContext.Provider value={{ auth, setAuth, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
