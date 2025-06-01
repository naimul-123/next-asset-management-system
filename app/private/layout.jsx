'use client'
import { useSession } from "next-auth/react";
export default function layout({ children }) {
  const { data: session, status } = useSession();

  if (status === 'loading')
    return (
      <div className="w-10 h-10 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
    );

  if (!session) return null;

  return <>{children}</>;
}
