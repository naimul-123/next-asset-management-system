import React, { useEffect, useState } from 'react'

import Button from "../reusable/Button"
import { useQuery } from '@tanstack/react-query'
import { getData, postData } from '../../lib/api'
import Swal from 'sweetalert2'
const DeptForm = ({ handleSubmit, btnText, isAssetEntry }) => {
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


    const handleAddNewLocationType = async (e) => {
        e.preventDefault();
        const locType = e.target.loctype.value.toLowerCase();
        if (!locType) {
            alert('Input a location type');
            return
        }
        const res = await postData('/api/loctype', { locType })
        if (res.data.error) {
            Swal.fire({

                text: res.data.error,
                icon: "error"
            })
        }
        if (res.data.message) {
            Swal.fire({

                text: res.data.message,
                icon: "success"
            })
            loctypeRefetch();
            setLoctype('')
            setOptions([])
            // here I want to run useEffect. how to possible?
        }

        e.target.reset()


    }
    const handleAddNewLocation = async (e) => {
        e.preventDefault();
        const locName = e.target.locname.value;
        if (!selectedDept || !loctype) {
            alert("select a department and location type first");
            return
        }
        const data = {
            deptName: selectedDept,
            locType: loctype,
            locName
        }
        const res = await postData('/api/addLocation', data)
        if (res.data.error) {
            Swal.fire({

                text: res.data.error,
                icon: "error"
            })
        }
        if (res.data.message) {
            Swal.fire({

                text: res.data.message,
                icon: "success"
            })
            deptRefetch();
            setLoctype('')
            setOptions([])
            // here I want to run useEffect. how to possible?
        }

        e.target.reset()
    }


    return (
        <>

            <form id='' className="" onSubmit={handleSubmit}>
                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Department</span>
                    </div>
                    <select name='department' className="select select-sm select-bordered" required onChange={(e) => handleDeptChange(e.target.value)} value={selectedDept}>
                        <option value="" >---Select---</option>
                        {departments && departments?.map((dept) => <option key={dept} className='capitalize' value={dept}>{dept.toUpperCase()}</option>)}
                    </select>
                </label>
                <div className="form-control">

                </div>


                {/* Location Type Selection */}
                <label className="form-control w-full border p-2 my-2 rounded-md">
                    <div className="label">
                        <span className="label-text">Location Type</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                        {loctypes?.map((type) => (
                            <label key={type} className=" flex  items-center gap-1 cursor-pointer">
                                <input
                                    type="radio"
                                    name="loctype"
                                    className="radio checked:bg-primary"
                                    onChange={() => setLoctype(type)}
                                    value={type}
                                    checked={loctype === type}
                                />
                                <span className="label-text capitalize">{type}</span>
                            </label>
                        ))}
                    </div>
                </label>

                {/* Dynamic Select Based on loctype */}
                {loctype && (
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text capitalize">Select {loctype}</span>
                        </div>
                        <select
                            name={loctype}  // Dynamic name to ensure correct field submission
                            className="select select-bordered select-sm"
                            required
                        >
                            <option value="">---Select---</option>
                            {options.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </label>
                )}
                <div className='flex justify-end text-center'>

                    <Button btnText={btnText} />
                </div>
            </form>
            {
                isAssetEntry &&
                <div className='overflow-auto px-2'>

                    <div className="collapse static  collapse-plus">
                        <input type="radio" name="my-accordion-1" />
                        <summary className="collapse-title after:py-0   text-xs  font-medium">Add Location Type</summary>
                        <div className='collapse-content my-0'>
                            <form onSubmit={handleAddNewLocationType} className=''>
                                <div className='form-control'>
                                    <input name='loctype' type="text" placeholder="Location Type" className="input  input-sm" required />
                                    <Button btnText="Add" />
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="collapse static collapse-plus">
                        <input type="radio" name="my-accordion-1" />
                        <summary className="collapse-title text-sm   font-medium">Add Location</summary>

                        <form onSubmit={handleAddNewLocation} className='collapse-content'>
                            <div className='form-control'>
                                <input name='locname' type="text" placeholder="Location Name" className="input input-sm" required />
                                <Button btnText="Add" />
                            </div>
                        </form>
                    </div>
                </div>


            }
        </>
    )
}

export default DeptForm