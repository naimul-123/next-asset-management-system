import React, { useState } from 'react'

const UserInput = ({ data, handleEdit }) => {
    const [isEdit, setIsEdit] = useState(false)
    return (

        <label className="input input-sm w-60 input-bordered flex items-center gap-2">
            {isEdit ?
                <input defaultValue={data} onBlur={(e) => { setIsEdit(false); handleEdit(e.target.value) }} type="text" className="grow" placeholder="" /> :
                <output value={data} onClick={() => setIsEdit(true)} className="grow">{data}</output>}
        </label>
    )
}

export default UserInput