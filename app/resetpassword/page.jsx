"use client"
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/authContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Button from '../../components/reusable/Button';
import { validatePassword } from '../../lib/passwordvalidation';
import { updateData } from '../../lib/api';

const ResetPassword = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [password, setPassword] = useState('');
    const [repass, setRepass] = useState('')
    const [sap, setSap] = useState("")
    const [error, setError] = useState([]);
    const [retypeError, setRetypeError] = useState('')

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const sap = params.get('sap');
        setSap(sap)
    }, [])

    const handlePasswordChange = (pas) => {
        setRepass('');
        setError([])
        const passErrors = validatePassword(pas)
        setError(passErrors)
        if (!passErrors) {
            setPassword(pas)
            matchpass()
        }
    }

    const matchpass = (v) => {

        if (password !== v) {
            setRetypeError("Retyped password dose not match with password")
        }
        else {
            setRetypeError('')
        }
    }

    const handleRetypePassword = (pass) => {
        matchpass(pass);
    }
    const handleResetPassword = async (e) => {
        e.preventDefault();
        const form = e.target;
        const password = form.password.value;
        console.log(password);
        if (!error && !retypeError) {
            const res = await updateData("/api/updatePass", { sap, password });
            if (res.success) {
                redirect(res.redirectTo)
            }
        }



    }

    return (
        <div className="hero bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">

                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <form className="card-body" onSubmit={handleResetPassword}>

                        <div className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Password </span>
                            </div>
                            <label className="input input-bordered input-sm flex items-center gap-2">
                                <input type={isOpen ? "text" : "password"} name='password' className="grow" onChange={(e) => handlePasswordChange(e.target.value)} />
                                <span onClick={() => setIsOpen(!isOpen)}>{isOpen ? <FaEyeSlash /> : <FaEye />}</span>

                            </label>
                            {error &&
                                <div className="label flex-col max-w-48 ">
                                    <span className='text-xs max-w-xs text-red-500' >{error}</span>
                                </div>}


                        </div>
                        <div className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Retype Password </span>
                            </div>
                            <label className="input input-sm input-bordered flex items-center gap-2">
                                <input type="password" className="grow" onChange={(e) => handleRetypePassword(e.target.value)} />
                            </label>
                            {retypeError &&
                                <div className="label flex-col max-w-48 ">
                                    <span className='text-xs max-w-xs text-red-500' >{retypeError}</span>
                                </div>}
                        </div>
                        <div className="form-control mt-2">
                            <Button btnText="Reset" isDisabled={error} />
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default ResetPassword