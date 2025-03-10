import React from 'react'
import { TiDelete } from "react-icons/ti";
import { AiOutlineUserDelete } from "react-icons/ai";
import Swal from 'sweetalert2';
import { deleteData } from '../lib/api';
const UserTable = ({ tableData, isLoading, handleDelete }) => {



    if (isLoading) {
        return (
            <div className="overflow-auto min-w-full border-2 grow rounded-b-lg">
                <span className="loading loading-spinner text-primary"></span>
            </div>
        )
    }

    const handleRoleChange = (data) => {
        console.log(data);
    }

    return (
        <div className="overflow-auto min-w-full border-2 grow rounded-b-lg">
            <table className="table table-zebra table-sm table-pin-rows">
                <thead className=''>
                    <tr className='bg-[#d3efe1] text-[#007f40] shadow-md '>
                        <th>SL</th>
                        <th>User Name</th>
                        <th>SAP ID</th>
                        <th>Change Role</th>
                        <th>Delete User</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData?.map((data, idx) => <tr key={idx}>
                        <th>{idx + 1}</th>
                        <td>{data.name}</td>
                        <td>{data.sap}</td>
                        <td>

                            <select name='role' onChange={(e) => handleRoleChange({ sap: data.sap, role: e.target.value })} className="select select-bordered select-xs" defaultValue={data.role} >
                                <option value="admin">Admin</option>
                                <option value="moderator">Moderator</option>
                                <option value="visitor">Visitor</option>
                            </select>
                        </td>
                        <td onClick={() => handleDelete(data.sap)} ><TiDelete className='text-3xl text-red-500' /></td>

                    </tr>)}

                </tbody>
            </table>
        </div>
    )


}

export default UserTable