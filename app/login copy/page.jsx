"use client"
import { redirect, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useAuth } from '../../contexts/authContext';
import { postData } from '../../lib/api';
import Swal from 'sweetalert2';


const Login = () => {

    
    const router = useRouter();
    const [loginerror, setLoginError] = useState('')
    const { getUser } = useAuth()
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('')
        const form = e.target;
        const sap = form.sapid.value;
        const password = form.password.value;
        try {
            const res = await postData("/api/login", {
                sap, password
            })

            if (res?.data?.redirected) {
                router.push(res.data.url)
                return
            }

            if (res.data.success) {
                Swal.fire({
                    title: res.data.message,
                    timer: 1500,
                    icon: "success"
                });
                getUser();
                router.push("/")
            }

        } catch (error) {
            setLoginError(error.response?.data?.error);
        }




    }

    return (



        <div className="flex flex-col max-w-xs mx-auto  min-h-full justify-center">
            <form className="bg-[#f7f7f7] p-8 rounded-xl" onSubmit={handleLogin}>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">SAP ID</span>
                    </label>
                    <input name='sapid' type="text" placeholder="SAP ID" className="input input-bordered input-sm" required />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Password</span>
                    </label>
                    <input name='password' type="password" placeholder="password" className="input input-bordered input-sm" required />

                </div>
                <div className="form-control mt-2 justify-center">
                    <button className='btn btn-info btn-soft w-full'>Login</button>
                </div>
                {loginerror &&
                    <div className="label flex-col max-w-xs ">
                        <span className='text-xs text-danger' >{loginerror}</span>
                    </div>}

            </form>
        </div>


    )
}

export default Login