"use client"

import { postData } from "../../../lib/api";
import Button from "../../../components/reusable/Button"
import { useState } from "react";

const AddUser = () => {
    const [userMessage, setuserMessage] = useState('');
    const [userError, setUserError] = useState('');
    const handleAddUser = async (e) => {
        e.preventDefault();
        setUserError('');
        setuserMessage('')
        const form = e.target;
        const userData = {
            name: form.name.value,
            sap: form.sap.value,
            role: form.role.value

        }

        if (userData.name && userData.sap && userData.role) {
            const res = await postData('/api/addUser', userData)
            if (res.data.message) {
                setuserMessage(res?.data?.message);
                form.reset()
            }
            if (res.data.error) {
                setUserError(res?.data?.error)
                form.reset()
            }
        }



    }
    return (
        <div className="hero bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <form className="card-body" onSubmit={handleAddUser}>
                        {userMessage && <p className="font-bold text-primary text-xs">{userMessage}</p>}
                        {userError && <p className="font-bold text-red-500 text-xs">{userError}</p>}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">User Name</span>
                            </label>
                            <input name='name' type="text" placeholder="Name" className="input input-xs input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">SAP ID</span>
                            </label>
                            <input name='sap' type="text" placeholder="SAP ID" className="input input-xs input-bordered" required />
                        </div>
                        <div className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Role</span>
                            </div>
                            <select name='role' className="select select-bordered select-xs" required >
                                <option value="">---Select---</option>
                                <option value="admin">Admin</option>
                                <option value="moderator">Moderator</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                        <div className="form-control xs">
                            <Button btnText="Add" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddUser