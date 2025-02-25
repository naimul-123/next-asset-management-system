"use client"
import React from 'react'
import Image from 'next/image'
import logo from '../../public/bb_logo.png'
import Link from 'next/link'
import { useAuth } from '../../contexts/authContext'
import { usePathname } from 'next/navigation'
import { IoLogOutSharp } from 'react-icons/io5'
import { FaHome, FaSignInAlt, FaUser, FaUserPlus } from 'react-icons/fa'

const Header = () => {
    const { user, logout } = useAuth()
    const pathname = usePathname();
    return (
        <div className='flex justify-between items-center border-b-8 border-b-primary text-primary shadow-lg print:hidden'>
            <Link href="/" className='min-w-96 block py-2 text-primary rounded-r-full border-r-[16px] border-r-primary  rounded-b-none bg-lightGray'>
                <div className='flex justify-center items-center  '>
                    <Image src={logo} alt="alt" width={80} height={80} />
                    <div className='font-bold'>
                        <h2 className='text-xl'>বাংলাদেশ ব্যাংক</h2>
                        <hr className='border-[#007f40] border-t-2' />
                        <h2 className='text-lg'>Asset Management System</h2>
                    </div>
                </div>
            </Link>
            <div className='flex grow  flex-col justify-between py-2 px-4 h-full   items-end font-semibold text-sm '>
                <div className='grow'>
                    {
                        user ?
                            <div className='flex items-center gap-2'>
                                <h3 className='flex item-center gap-1'><FaUser /> {user.name}</h3>
                                <button className='flex item-center btn btn-xs btn-warning ' onClick={logout} ><IoLogOutSharp />Log Out</button>
                            </div>
                            :
                            <div className='flex items-center gap-2'>
                                <Link href='/login' className='flex item-center btn btn-xs btn-warning '><FaSignInAlt /> Log In</Link>
                                <Link href='/register' className='flex item-center btn btn-xs btn-warning '><FaUserPlus /> Register</Link>
                            </div>
                    }
                </div>
                <div className='flex min-w-full text-sm gap-2 text-primary'>
                    <Link className={`flex items-center  hover:link ${pathname === "/" ? ' link ' : ''}  `} href="/"><FaHome className='' /></Link>
                    <Link className={`hover:link ${pathname === '/view_asset' ? ' link' : ''}  `} href='/view_asset'>View Asset</Link>


                    {(user?.role === "admin" || user?.role === "moderator") &&
                        <>
                            <Link className={`hover:link ${pathname === "/private/asset_entry" ? ' link ' : ''}  `} href="/private/asset_entry">Asset Entry</Link>
                            {
                                user.isSuperAdmin && <>
                                    <Link className={`hover:link ${pathname === "/private/add_user" ? ' link ' : ''}  `} href="/private/add_user">Add User</Link>
                                    <Link className={`hover:link ${pathname === "/private/manage_user" ? ' link ' : ''}  `} href="/private/manage_user">Manage User</Link></>
                            }
                            <Link className={`hover:link ${pathname === "/private/asset_summary" ? ' link ' : ''}  `} href="/private/asset_summary">Asset Summary</Link>
                            <Link className={`hover:link ${pathname === "/private/manage_assets" ? ' link ' : ''}  `} href="/private/manage_assets">Manage Assets</Link>
                            <Link className={`hover:link ${pathname === "/private/upload_assets" ? ' link ' : ''}  `} href="/private/upload_assets">Upload Assets</Link>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default Header