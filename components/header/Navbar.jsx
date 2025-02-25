"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useAuth } from '../../contexts/authContext'
import { IoLogInSharp, IoLogOutSharp } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
const Navbar = () => {

    return (
        <div className='flex flex-col justify-end items-end  bg-[#007F40] text-white hover:text-white  font-semibold text-lg'>
            <div className='flex px-4 gap-2 '>
                {
                    user && <>

                        <h3 className=''>Welcome {user.name}</h3>
                        <button className='btn btn-square btn-warning text-white  text-4xl' onClick={logout} ><IoLogOutSharp /></button>
                    </>



                }

                {
                    !user && <Link href='/login' className='btn btn-square btn-warning text-white  text-4xl'><IoLogInSharp /></Link>
                }
            </div>
            <div className='flex'>
                <Link className={` py-5 px-4  flex items-center  hover:bg-[#022d17] ${pathname === "/" ? ' bg-[#022d17] ' : ''}  `} href="/"><FaHome className='' /></Link>
                {(user?.role === "admin" || user?.role === "moderator") &&
                    <>
                        <Link className={` py-5 px-3  hover:bg-[#022d17] ${pathname === "/private/asset_entry" ? ' bg-[#022d17] ' : ''}  `} href="/private/asset_entry">Asset Entry</Link>
                        {
                            user.isSuperAdmin && <>
                                <Link className={` py-5 px-3  hover:bg-[#022d17] ${pathname === "/private/add_user" ? ' bg-[#022d17] ' : ''}  `} href="/private/add_user">Add User</Link>
                                <Link className={` py-5 px-3  hover:bg-[#022d17] ${pathname === "/private/manage_user" ? ' bg-[#022d17] ' : ''}  `} href="/private/manage_user">Manage User</Link></>
                        }
                        <Link className={` py-5 px-3  hover:bg-[#022d17] ${pathname === "/private/asset_summary" ? ' bg-[#022d17] ' : ''}  `} href="/private/asset_summary">Asset Summary</Link>
                        <Link className={` py-5 px-3  hover:bg-[#022d17] ${pathname === "/private/manage_assets" ? ' bg-[#022d17] ' : ''}  `} href="/private/manage_assets">Manage Assets</Link>
                        <Link className={` py-5 px-3  hover:bg-[#022d17] ${pathname === "/private/upload_assets" ? ' bg-[#022d17] ' : ''}  `} href="/private/upload_assets">Upload Assets</Link>
                    </>
                }
                <Link className={` py-5 px-3  hover:bg-[#022d17] ${pathname === '/view_asset' ? ' bg-[#022d17] ' : ''}  `} href='/view_asset'>View Asset</Link>
            </div>

        </div>
    )
}

export default Navbar