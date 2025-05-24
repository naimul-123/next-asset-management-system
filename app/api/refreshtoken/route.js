import { postData } from "@/lib/api"; // or your own method
import { jwtDecode } from "jwt-decode";

// Helper to get cookie by name
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
};

const refreshSession = async () => {
  try {
    const token = getCookie("token");

    if (!token) return; // ✅ Do nothing if token doesn't exist

    const decoded = jwtDecode(token);
    const exp = decoded.exp * 1000; // convert to milliseconds
    const now = Date.now();

    // Only refresh if token is going to expire within 15 seconds
    if (exp - now < 15 * 1000) {
      await postData("/api/refreshtoken");
    }
  } catch (error) {
    console.error("Token refresh failed", error);
    // logout(); // optional: uncomment to logout on error
  }
};
