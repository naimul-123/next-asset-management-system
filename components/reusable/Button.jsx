"use client"

const Button = ({ handleSubmit, btnText }) => {
    return (
        <button type='submit' className='mt-2 btn btn-sm text-primary bg-secondary hover:bg-[#c8ecda]' onClick={handleSubmit} >{btnText || "Submit"}</button>
    )
}

export default Button