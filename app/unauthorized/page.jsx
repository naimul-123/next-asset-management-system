import Link from 'next/link'
import React from 'react'

const Unauthorized = () => {

    return (
        <div className="flex justify-center items-center gap-2 h-screen">
            <h1 className="text-2xl font-bold text-red-500">Unauthorized Access</h1>
            <Link className='link text-primary text-2xl' href="/">Go Back to Home</Link>
        </div>
    )
}

export default Unauthorized