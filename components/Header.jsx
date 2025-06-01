"use client";
import { GoPasskeyFill } from "react-icons/go";
import React from "react";
import Image from "next/image";
import logo from "@/public/bb_logo.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoLogOutSharp } from "react-icons/io5";
import { FaEye, FaHome, FaSignInAlt, FaUser, FaUserPlus } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
const Header = () => {
  const { data: session, status } = useSession();
  const user = session?.user || null;
  const pathname = usePathname();
  return (
    <div className=" h-fit text-black   flex justify-between items-center bg-warning    shadow-lg print:hidden">
      <Link
        href="/"
        className="min-w-96 block py-2 text-white rounded-r-full border-r-gray-dark border-r-4  bg-primary "
      >
        <div className="flex justify-center items-center  ">
          <Image
            src={logo}
            alt="alt"
            width={80}
            height={80}
            className="bg-white rounded-full"
          />
          <div className="font-bold">
            <h2 className="text-xl">বাংলাদেশ ব্যাংক</h2>
            <hr className="border-white border-t-2" />
            <h2 className="text-lg">Asset Management System</h2>
          </div>
        </div>
      </Link>
      <div className="flex grow  flex-col justify-between py-2 px-4 h-full   items-end font-semibold text-sm ">
        <div className="grow">
          {user ? (
            <div className="flex justify-evenly items-center gap-2">
              {/* <p>{session?.user.exp > 0 ? `Session expires at ${new Date(user.exp * 1000).toLocaleTimeString()}` : null}</p> */}
              <h3 className="flex item-center gap-2">
                <FaUser />
                <span> Welcome {session?.user?.name}</span>

              </h3>
              <Link href={`/resetpassword?sap=${session?.user?.sap}`} className="flex item-center btn btn-xs btn-warning text-black btn-outline ">
                <GoPasskeyFill />
                Reset Password
              </Link>
              <button
                className="flex item-center btn btn-xs btn-warning text-black btn-outline "
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <IoLogOutSharp />
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex item-center btn btn-xs btn-warning "
              >
                <FaSignInAlt /> Log In
              </Link>
            </div>
          )}
        </div>
        <div className="flex text-sm gap-2 ">
          <Link
            className={`flex items-center  hover:link ${pathname === "/" ? " link " : ""
              }  `}
            href="/"
          >
            <FaHome className="" />
          </Link>
          <Link
            className={`flex items-center hover:link ${pathname === "/view_asset" ? " link" : ""
              }  `}
            href="/view_asset"
          >
            View Asset
          </Link>

          {user?.role && (
            <>
              {user.role === "admin" && (
                <>
                  <Link
                    className={`hover:link ${pathname === "/private/manage_user" ? " link " : ""
                      }  `}
                    href="/private/manage_user"
                  >
                    Manage User
                  </Link>
                </>
              )}
              <Link
                className={`hover:link ${pathname === "/private/asset_summary" ? " link " : ""
                  }  `}
                href="/private/asset_summary"
              >
                Asset Summary
              </Link>
              <Link
                className={`hover:link ${pathname === "/private/manage_assets" ? " link " : ""
                  }  `}
                href="/private/manage_assets"
              >
                Manage Assets
              </Link>
              {user.role === "admin" ? (
                <>
                  <Link
                    className={`hover:link ${pathname === "/private/manage_location" ? " link " : ""
                      }  `}
                    href="/private/manage_location"
                  >
                    Manage Location
                  </Link>
                  <Link
                    className={`hover:link ${pathname === "/private/update_assets" ? " link " : ""
                      }  `}
                    href="/private/update_assets"
                  >
                    Update All Assets
                  </Link>
                </>
              ) : (
                <Link
                  className={`hover:link ${pathname === "/private/upload_new_assets" ? " link " : ""
                    }  `}
                  href="/private/upload_new_assets"
                >
                  Upload New Assets
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
