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
  const userRef = useRef(null);

  // Keep userRef in sync with user state
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const logout = async () => {
    try {
      await axios.post("/api/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      queryClient.clear();
      setUser(null);
      userRef.current = null;
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.push("/login");
    }
  };

  const refreshSession = async () => {
    try {
      const res = await postData("/api/refreshtoken");
      if (res?.data?.success) {
        getUser(); // update user info
      }
    } catch (error) {
      console.error("Token refresh failed", error);
      logout();
    }
  };

  const resetInactivityTimer = () => {
    const currentUser = userRef.current;
    const now = Date.now();

    if (currentUser?.exp) {
      const tokenExpiry = currentUser.exp * 1000;
      const timeLeft = tokenExpiry - now;

      // Refresh session if token expires within 60 seconds
      if (timeLeft > 0 && timeLeft < 60 * 1000) {
        refreshSession();
      }

      // Clear previous timer
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }


      inactivityTimeoutRef.current = setTimeout(() => {
        console.log("User inactive. Logging out.");
        getUser();
      }, 10000);
    }
  };


  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const debouncedResetInactivityTimer = debounce(resetInactivityTimer, 1000);

  const setupInactivityListeners = () => {
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) =>
      window.addEventListener(event, debouncedResetInactivityTimer)
    );

    resetInactivityTimer(); // Run initially

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, debouncedResetInactivityTimer)
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
      if (res?.payload) {
        setUser((prevUser) => {
          // Avoid unnecessary re-renders
          if (JSON.stringify(prevUser) !== JSON.stringify(res.payload)) {
            userRef.current = res.payload;
            return res.payload;
          }
          return prevUser;
        });
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
    const cleanup = setupInactivityListeners();
    return () => cleanup();
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
