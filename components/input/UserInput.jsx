import React, { useState } from 'react'

const UserInput = ({ data, handleEdit }) => {
    const [isEdit, setIsEdit] = useState(false)
    return (


        <label className="input input-sm w-60  bg-inherit flex items-center gap-2" onClick={() => handleEdit && setIsEdit(true)}>
            {isEdit ?
                <input disabled={!isEdit} defaultValue={data} onBlur={(e) => { setIsEdit(false); handleEdit(e.target.value) }} type="text" className="grow" />

                :
                <output value={data} className="grow w-60">{data}</output>}
        </label>

    )
}

export default UserInput