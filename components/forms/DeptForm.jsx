import React, { useEffect, useState } from 'react'

import Button from "../reusable/Button"
import { useQuery } from '@tanstack/react-query'
import { getData } from '../../lib/api'
const DeptForm = ({ handleSubmit, btnText }) => {

    const { data: departmentData = [] } = useQuery({
        queryKey: ['departments'],
        queryFn: () => getData('/api/getdeptdata')

    })




    const departments = departmentData?.map(dept => dept.name)

    const [options, setOptions] = useState([])
    const [loctype, setLoctype] = useState('');

    const [selectedDept, setSelecteddept] = useState('')
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





    return (

        <form id='' className="" onSubmit={handleSubmit}>
            <label className="form-control w-full">
                <div className="label">
                    <span className="label-text">Department</span>
                </div>
                <select name='department' className="select select-sm select-bordered" required onChange={(e) => handleDeptChange(e.target.value)} value={selectedDept}>
                    <option value="" >---Select---</option>
                    {departments && departments?.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
                </select>
            </label>
            <div className="form-control">

            </div>


            {/* Location Type Selection */}
            <label className="form-control w-full">
                <div className="label">
                    <span className="label-text">Location Type</span>
                </div>
                <div className="flex gap-4">
                    {["section", "cell", "chember"].map((type) => (
                        <label key={type} className="flex items-center gap-1 cursor-pointer">
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
    )
}

export default DeptForm