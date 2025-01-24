import React, { useState } from 'react'
import departmentData from "../../public/departments.json"
import Button from "../reusable/Button"
const DeptForm = ({ handleSubmit, btnText }) => {
    const [sections, setSections] = useState([]);
    const departments = departmentData.map(d => d.name);
    const handleDeptChange = (value) => {
        const sections = departmentData.find(d => d.name === value)?.sections;
        setSections(sections);
    }





    return (

        <form id='' className="" onSubmit={handleSubmit}>
            <label className="form-control w-full">
                <div className="label">
                    <span className="label-text">Department</span>
                </div>
                <select name='department' defaultValue="" className="select select-sm select-bordered" required onChange={(e) => handleDeptChange(e.target.value)}>
                    <option value="" >---Select---</option>
                    {departments.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
                </select>
            </label>
            <label className="form-control w-full">
                <div className="label">
                    <span className="label-text">Asset Type</span>
                </div>
                <select name='section' className="select select-bordered select-sm" required >
                    <option value="">---Select---</option>
                    {sections?.map((sec) => <option key={sec} value={sec}>{sec}</option>)}
                </select>
            </label>
            <div className='flex justify-end text-center'>

                <Button btnText={btnText} />
            </div>
        </form>
    )
}

export default DeptForm