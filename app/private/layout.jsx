"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/authContext";
import { useEffect } from "react";
export default function layout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading)
    return (
      <div className="w-10 h-10 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
    );

  if (!user) return null;

  return <>{children}</>;
}
