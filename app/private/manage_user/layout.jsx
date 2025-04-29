"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Layout = ({ children }) => {
  const pathname = usePathname();
  return (
    <div className="flex h-svh gap-4 justify-between min-w- w-screen mx-auto border items-start">
      <div className=" h-screen min-w-fit w-72 max-w-sm border-r border-r-gray-500 bg-gray-300 px-4 py-3 flex flex-col gap-4 text-2xl">
        <Link
          className={`flex items-center hover:link ${
            pathname === "/private/manage_user" ? " link" : ""
          }  `}
          href="/private/manage_user"
        >
          Manage User
        </Link>
        <Link
          className={`flex items-center hover:link ${
            pathname === "/private/manage_user/add_user" ? " link" : ""
          }  `}
          href="/private/manage_user/add_user"
        >
          Add New User
        </Link>
        <Link
          className={`flex items-center hover:link ${
            pathname === "/private/manage_user/manage_role" ? " link" : ""
          }  `}
          href="/private/manage_user/manage_role"
        >
          Manage User Role
        </Link>
      </div>
      <div className="grow w-full">{children}</div>
    </div>
  );
};

export default Layout;
