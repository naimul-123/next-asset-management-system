"use client";
import { jwtDecode } from "jwt-decode";
import { getData, postData } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();

  const inactivityTimeoutRef = useRef(null);

  const logout = async () => {
    try {
      const res = await axios.post("/api/logout");
      if (res.success) {
        setUser(null);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      queryClient.clear();
      setUser(null);
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.push("/login");
    }
  };

  const getCookie = (name) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? decodeURIComponent(match[2]) : null;
  };

  const refreshSession = async () => {
    try {
      await postData("/api/refreshtoken");
    } catch (error) {
      console.error("Token refresh failed", error);
    }
  };
  const resetInactivityTimer = () => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }

    // Only try to refresh token if user is logged in
    if (user) {
      const token = getCookie("token");

      if (token) {
        try {
          const decoded = jwtDecode(token);
          const exp = decoded.exp * 1000; // ms
          const now = Date.now();

          // Only refresh if token will expire in the next 15 seconds
          if (exp - now <= 15 * 1000) {
            refreshSession(); // Refresh only if necessary
          }
        } catch (error) {
          console.error("Token decoding failed", error);
        }
      }
    }

    inactivityTimeoutRef.current = setTimeout(() => {
      console.log("Inactive. Logging out.");
      logout();
    }, 60 * 1000); // 1 minute timeout
  };

  const setupInactivityListeners = () => {
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) =>
      window.addEventListener(event, resetInactivityTimer)
    );
    resetInactivityTimer();

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetInactivityTimer)
      );
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  };

  const setupAxiosInterceptors = () => {
    axios.interceptors.response.use(
      (res) => res,
      async (err) => {
        if (err?.response?.status === 401) {
          await logout();
        }
        return Promise.reject(err);
      }
    );
  };

  const getUser = async () => {
    try {
      const res = await getData("/api/getUser");
      if (res.payload) {
        setUser(res.payload);
      } else {
        logout();
      }
    } catch (err) {
      console.error("Get user failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
    setupAxiosInterceptors();
    const cleanupActivity = setupInactivityListeners();

    return () => {
      cleanupActivity();
    };
  }, []);

  const authInfo = {
    user,
    getUser,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
