"use client"
import React from 'react'
import Image from 'next/image'
import logo from '../../public/bb_logo.png'
import Link from 'next/link'
import { useAuth } from '../../contexts/authContext'

const Header = () => {
    const { user } = useAuth()

    return (
        <div className='flex justify-between items-center px-4'>
            <Link href="/">
                <div className='flex justify-center items-center gap-3'>
                    <Image src={logo} alt="alt" width={100} height={100} />
                    <div className='space-y-1'>
                        <h1>Bangladesh Bank</h1>
                        <hr className='border-[#007f40] border-2' />
                        <h2>বাংলাদেশ ব্যাংক</h2>
                    </div>
                </div>
            </Link>
            <h2 className='text-4xl font-bold'>Asset Management System</h2>
        </div>
    )
}

export default Header