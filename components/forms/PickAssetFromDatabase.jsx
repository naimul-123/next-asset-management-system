"use client"

import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { useMutation, useQuery } from '@tanstack/react-query';
import { getData, postData } from '../../lib/api';
import { MdOutlinePostAdd } from "react-icons/md";
import { IoCloseCircleSharp } from 'react-icons/io5';

const PickAssetFromDatabase = ({ assetMutation, assetLocation, isOpenModal, setIsOpenModal }) => {

   
    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState(null)
    const [assetError, setAssetError] = useState('');
    const { data: assetClasses = [] } = useQuery({
        queryKey: ['assetClasses'],
        queryFn: () => getData('/api/assetClass')
    })
    const Class = assetClasses?.map((g) => g.assetClass).sort((a, b) => a.localeCompare(b))
    const handleClassChange = async (assetClass) => {
        setTypes([])
        setSelectedType(null)
        const assetTypeData = await getData(`/api/getAssetType?assetClass=${assetClass}`)
        setTypes(assetTypeData)
    }
    const handleAssetTypeChange = async (assetType) => {
      setSelectedType(assetType);
    };

    function handleSubmitForm(e) {
        e.preventDefault();
        if (assetError) {
            alert('something wrong');
            return
        }
        const form = e.target;
        const assetNumber = form.assetNumber.value;
        const assetUser = form.assetUser.value;
        const assetData = {
            assetNumber, assetUser, ...assetLocation
        }
        if (assetData) {
            assetMutation.mutate(assetData, {

                onSuccess: () => remainingRefetch()
            })

        }
        form.reset()
    }



    const { data: remainingAssets = [], refetch: remainingRefetch } = useQuery({
        queryKey: [selectedType],
        queryFn: () => getData(`/api/assetInfo?assetType=${selectedType}`),
        enabled: !!selectedType
    })



    return (
        <div className={`${!isOpenModal ? "h-0 opacity-0" : "h-full  opacity-100"} transition-all duration-1000 ease-in-out  w-full rounded-lg  mx-auto relative`}>
            <button className="btn absolute right-0 -top-10 z-20   btn-circle btn-ghost text-danger  text-4xl " onClick={() => setIsOpenModal(null)}><IoCloseCircleSharp /></button>

            <form className='grid grid-cols-2 gap-2 max-w-screen-lg'>


                <label className="form-control flex-row items-center w-full">
                    <div className="label">
                        <span className="label-text">Asset Class: </span>
                    </div>
                    <select name='assetClass' defaultValue="" onChange={(e) => handleClassChange(e.target.value)} className="select select-sm bg-inherit  select-bordered" required>
                        <option value="" >---Select---</option>
                        {Class?.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                </label>
                <label className="form-control w-full flex-row items-center">
                    <div className="label">
                        <span className="label-text">Asset Type: </span>
                    </div>
                    <select name='assetType' defaultValue="" className="select select-sm select-bordered bg-inherit" required onChange={(e) => handleAssetTypeChange(e.target.value)} >
                        <option value="">---Select---</option>
                        {types.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                </label>

            </form>
            <div className="overflow-auto w-full h-full max-h-40  border-2 grow rounded-b-lg">

                <table className="table  table-xs table-zebra table-pin-rows  ">
                    <thead className=' '>
                        <tr className=' gird grid-cols-3 bg-gray-bright font-extrabold text-primary  '>
                            <th>SL</th>
                            <th className='text-center py-4'>Asset info</th>
                            <th className='flex justify-between max-w-xs py-4'><span>Asset User</span> <span>Total Assets= {remainingAssets.length}</span>  </th>
                        </tr>
                    </thead>
                    <tbody>
                        {remainingAssets?.map((data, idx) => <tr key={idx} >
                            <th>{idx + 1}</th>
                            <td >
                                <div className="grid grid-cols-3">
                                    <div>
                                        <div className="font-bold">Asset Number: {data.assetNumber}</div>
                                        <div className="font-bold">Class: {data.assetClass}</div>
                                    </div>
                                    <div>
                                        <div className="font-bold">Type: {data.assetType}</div>
                                        <div className="font-bold">Name: {data.assetDescription}</div>
                                    </div>
                                    <div>
                                        <div className="font-bold">Cap. Date: {data.capDate}</div>
                                        <div className="font-bold">Acquis. Val: {data.acquisVal}</div>
                                    </div>
                                </div>
                            </td>

                            <td className=''>
                                <form id='entryForm' className="flex gap-2 items-center justify-between" onSubmit={handleSubmitForm}>
                                    <div className="form-control">
                                        <input value={data.assetNumber} type="hidden" name='assetNumber' />
                                        <input value={data.assetClass} name='assetClass' type='hidden' />
                                        <input value={data.assetType} name='assetType' type='hidden' />
                                        <input value={data.assetDescription} name='assetDescription' type='hidden' />
                                        <input value={data.assetUser} type="text" name='assetUser' placeholder="Asset user name or section" className="input input-ghost  input-success input-sm" required />

                                    </div>
                                    <button type='submit' className=' btn btn-sm btn-square btn-warning text-white font-bold text-2xl'><MdOutlinePostAdd /></button>
                                </form>

                            </td>

                        </tr>)}

                    </tbody>
                </table>
            </div>
        </div>

    )
}

export default PickAssetFromDatabase