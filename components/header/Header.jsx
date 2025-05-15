"use client";
import React from "react";
import Image from "next/image";
import logo from "../../public/bb_logo.png";
import Link from "next/link";
import { useAuth } from "../../contexts/authContext";
import { usePathname } from "next/navigation";
import { IoLogOutSharp } from "react-icons/io5";
import { FaEye, FaHome, FaSignInAlt, FaUser, FaUserPlus } from "react-icons/fa";

const Header = () => {
  const { user, logout, remainingTime } = useAuth();
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
            <div className="flex items-center gap-2">
              <p>Your session will be expired after {remainingTime}</p>
              <h3 className="flex item-center gap-1">
                <FaUser /> {user.name}
              </h3>
              <button
                className="flex item-center btn btn-xs btn-warning "
                onClick={logout}
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
              {user.role === 'admin' && (
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
              {user.role === 'admin' ? (

                <Link
                  className={`hover:link ${pathname === "/private/update_assets" ? " link " : ""
                    }  `}
                  href="/private/update_assets"
                >
                  Update All Assets
                </Link>
              ) : (<Link
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
