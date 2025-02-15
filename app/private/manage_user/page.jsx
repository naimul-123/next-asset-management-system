"use client"
import { useQuery } from '@tanstack/react-query'
import UserTable from '../../../components/UserTable'
import React from 'react'
import { deleteData, getData } from '../../../lib/api'
import Swal from 'sweetalert2'

const ManageUser = () => {

    const { data: usersData = [], isLoading, refetch: userRefetch } = useQuery({
        queryKey: ['userinfo'],
        queryFn: () => getData('/api/getUserData')
    })
    const handleDelete = (sap) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await deleteData(`/api/deleteUser?sap=${sap}`)
                if (res?.message) {
                    userRefetch()
                    Swal.fire({
                        title: "Deleted!",
                        text: res.message,
                        icon: "success"
                    });
                }

            }
        });

    }


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
                    {usersData?.map((data, idx) => <tr key={idx}>
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

export default ManageUser