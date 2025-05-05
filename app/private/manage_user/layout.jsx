"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Layout = ({ children }) => {
  const pathname = usePathname();
  return (
    <div className="flex justify-between min-w-full h-[calc(100vh-148px)]">
      <nav className="w-60  p-4 min-h-full bg-slate-100 text-2xl space-y-2 ">
        <Link
          className={`flex items-center  hover:link ${
            pathname === "/private/manage_user" ? " link" : ""
          }  `}
          href="/private/manage_user"
        >
          Manage User
        </Link>

        <Link
          className={`flex items-center hover:link ${
            pathname === "/private/manage_user/manage_access" ? " link" : ""
          }  `}
          href="/private/manage_user/manage_access"
        >
          Manage Access
        </Link>
      </nav>
      <div className="flex-1 p-6 overflow-auto">{children}</div>
    </div>
  );
};

export default Layout;
