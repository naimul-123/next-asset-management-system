"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Layout = ({ children }) => {
  const pathname = usePathname();
  return (
    <div className="flex gap-4 justify-between  mx-auto items-start">
      <div className="flex flex-col text-2xl h-full">

        <Link
          className={`flex items-center hover:link ${pathname === "/private/manage_user" ? " link" : ""
            }  `}
          href="/private/manage_user"
        >
          Manage User
        </Link>
        <Link
          className={`flex items-center hover:link ${pathname === "/private/manage_user/add_user" ? " link" : ""
            }  `}
          href="/private/manage_user/add_user"
        >
          Add New User
        </Link>
        <Link
          className={`flex items-center hover:link ${pathname === "/private/manage_user/user_access_area" ? " link" : ""
            }  `}
          href="/private/manage_user/user_access_area"
        >
          User Access Area
        </Link>
      </div>
      {children}

    </div>
  );
};

export default Layout;
