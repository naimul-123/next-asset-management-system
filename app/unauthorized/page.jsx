import Link from 'next/link'
import React from 'react'

const Unauthorized = () => {

    return (
        <div className="flex flex-col w-full mx-auto flex-1 justify-center items-center">
            <div className='grow flex gap-3 items-center justify-center w-full'>
                <h1 className="text-2xl font-bold text-red-500">Unauthorized Access</h1>
                <Link className='link text-primary text-2xl' href="/">Go Back to Home</Link>
            </div>

        </div>
    )
}

export default Unauthorized