"use client"
import React, { useEffect, useState } from 'react'
import { getData, postData } from '../../lib/api';
import { useMutation, useQuery } from '@tanstack/react-query';


const Register = () => {

    const [regError, setRegError] = useState('');
    const [successMessage, setSuccessMessage] = useState('')
    const [options, setOptions] = useState([])
    const [loctype, setLoctype] = useState('');
    const [selectedDept, setSelecteddept] = useState('')


    const { data: departmentData = [], refetch: deptRefetch } = useQuery({
        queryKey: ['departments'],
        queryFn: () => getData('/api/getdeptdata')

    })
    const { data: loctypes = [], refetch: loctypeRefetch } = useQuery({
        queryKey: ['loctypes'],
        queryFn: () => getData('/api/loctype')

    })

    const departments = departmentData?.map(dept => dept.name)


    const handleDeptChange = (value) => {
        setSelecteddept(value);
        setLoctype('')
        setOptions([])
    }
    useEffect(() => {
        if (!selectedDept || !loctype) {
            setOptions([]);
            return
        }
        const options = selectedDept && loctype && departmentData?.find(d => d.name === selectedDept)[loctype]?.sort((a, b) => a.localeCompare(b)) || [];
        setOptions(options)

    }, [selectedDept, loctype])


    const regMutation = useMutation({
        mutationFn: (data) => postData("/api/register", data),

    })


    const handleRegister = async (e) => {
        e.preventDefault();
        setRegError('')
        setSuccessMessage('')
        const form = e.target;
        const name = form.name.value;
        const sap = form.sap.value;
        const department = form.department.value;
        const loctype = form.loctype.value;
        const location = form.location.value;

        const userData = {
            name, sap, department, loctype, location
        }

        regMutation.mutate(userData, {
            onError: (error) => {
                setRegError(error.message)
            },
            onSuccess: (res) => {
                if (res?.data?.message) {
                    setSuccessMessage(res?.data?.message);
                }
                if (res?.data?.errortype) {
                    if (res?.data?.errortype === "existing_user") {
                        setRegError('You are already registered. Redirecting to login page');
                        setTimeout(() => {
                            window.location.href = "/login";
                        }, 2000)
                    }
                    if (res?.data?.errortype === "pending_user") {
                        setRegError('A request is pending. Redirecting to home page');
                        setTimeout(() => {
                            window.location.href = "/login";
                        }, 2000)
                    }
                }

                form.reset();


            }
        });

    }

    return (




        <form className="bg-[#f7f7f7] px-8 w-full max-w-sm mx-auto  rounded-xl" onSubmit={handleRegister}>
            {regError &&
                <div >
                    <p className=" relative  text-sm font-bold text-red-500 "> {regError}<span className='loading loading-dots loading-sm absolute bottom-0' ></span></p>

                </div>}
            {successMessage &&
                <div className="label max-w-xs ">

                    <span className='text-sm font-bold text-success' >{successMessage}</span>

                </div>}
            <div className="form-control">
                <div className="label ">
                    <span className="label-text">Department</span>
                </div>
                <select name='department' className="select select-sm" required onChange={(e) => handleDeptChange(e.target.value)} value={selectedDept}>
                    <option value="" >---Select---</option>
                    {departments && departments?.map((dept) => <option key={dept} className='capitalize' value={dept}>{dept.toUpperCase()}</option>)}
                </select>
            </div>


            {/* Location Type Selection */}
            <div className="form-control">
                <div className="label">
                    <span className="label-text">Location Type</span>
                </div>
                <select name='loctype' className="select select-sm" required onChange={(e) => setLoctype(e.target.value)} value={loctype}>
                    <option value="" >---Select---</option>
                    {loctypes && loctypes?.map((type) => <option key={type} className='capitalize' value={type}>{type.toUpperCase()}</option>)}
                </select>

            </div>
            {/* Dynamic Select Based on loctype */}
            {loctype && (
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">Select {loctype}</span>
                    </div>
                    <select
                        name='location'  // Dynamic name to ensure correct field submission
                        className="select select-bordered select-sm "
                        required
                    >
                        <option value="">---Select---</option>
                        {options.map((opt) => (
                            <option key={opt} value={opt} className='capitalize'>{opt}</option>
                        ))}
                    </select>
                </label>
            )}

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Name</span>
                </label>
                <input name='name' type="text" placeholder="User name" className="input input-bordered input-sm" required />
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">SAP ID</span>
                </label>
                <input name='sap' type="text" placeholder="SAP ID" className="input input-bordered input-sm" required />
            </div>
            <div className="form-control mt-6">
                <button className='btn btn-sm btn-warning' type='submit'>Send Request to Add</button>
            </div>



        </form>



    )
}

export default Register