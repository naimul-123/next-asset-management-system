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
    console.log(usersData);

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

        <div className="overflow-x-auto">
            <table className="table table-xs table-pin-rows">
                <thead>
                    <tr className='text-center'>
                        <th>SL</th>
                        <td>Name</td>
                        <td>SAP</td>
                        <td>Department</td>
                        <td>Location Type</td>
                        <td>Location</td>
                        <td>Status</td>
                        <td>Role</td>
                        <td colSpan={2} className='text-center'>Actions</td>


                    </tr>
                </thead>
                <tbody>
                    {usersData?.map((user, idx) =>
                        <tr key={user.sap}>

                            <th>{idx + 1}</th>
                            <td>{user.name}</td>
                            <td>{user.sap}</td>
                            <td>{user.department}</td>
                            <td>{user.loctype}</td>
                            <td>{user.location}</td>
                            <td> <button className={user?.status === "pending" ? "btn btn-xs btn-success" : "btn btn-warning text-white btn-xs"}>{user.status}</button></td>
                            <td>
                                <select defaultValue={user.role} className="select select-xs">
                                    <option value="">---Select---</option>
                                    <option value="admin">Admin</option>
                                    <option value="moderatror">Moderator</option>
                                    <option value="visitor">Visitor</option>
                                </select>
                            </td>
                            <td><button className='btn btn-xs btn-success'>Reset Password</button></td>
                            <td><button className='btn btn-xs btn-success'>Remove</button></td>

                        </tr>
                    )}


                </tbody>

            </table>
        </div>


    )

}

export default ManageUser