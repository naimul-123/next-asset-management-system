import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const PasswordInput = ({ fieldName, cls, handler }) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <label className="input input-bordered input-sm flex items-center gap-2">
            <input
                type={isOpen ? "text" : "password"}
                name={fieldName}
                className={cls}
                onChange={(e) => handler && handler(e.target.value)}
                required
            />
            <span onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <FaEyeSlash /> : <FaEye />}
            </span>
        </label>
    )
}

export default PasswordInput