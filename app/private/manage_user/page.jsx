"use client"
import { useQuery } from '@tanstack/react-query'
import UserTable from '../../../components/UserTable'
import React from 'react'
import { deleteData, getData } from '../../../lib/api'
import Swal from 'sweetalert2'

const ManageUser = () => {

    const { data = [], isLoading, refetch: userRefetch } = useQuery({
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
        <div className='mx-auto h-[calc(100vh-220px)] flex gap-2 '>
            <span className="loading loading-spinner text-primary"></span>
        </div>
    }

    return (
        <div className='mx-auto h-[calc(100vh-220px)] flex gap-2 '>
            <UserTable tableData={data} handleDelete={handleDelete} />
        </div>
    )
}

export default ManageUser