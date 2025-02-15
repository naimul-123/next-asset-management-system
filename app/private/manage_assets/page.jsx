"use client"

import React, { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import DeptForm from '../../../components/forms/DeptForm';
import DataTable from '../../../components/DataTable';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getData, postData } from '../../../lib/api';
import { FaPlus, FaPrint } from 'react-icons/fa';
import AssetEntryByNumber from '../../../components/forms/AssetEntryByNumber';
import PickAssetFromDatabase from '../../../components/forms/PickAssetFromDatabase';


const ManageAssets = () => {
    const [isOpenModal, setIsOpenModal] = useState(null);
    const [assetLocation, setassetLocation] = useState(null)
    const pageNumberRef = useRef(null);
    const queryClient = useQueryClient();


    const handleDeptForm = async (e) => {
        setassetLocation(null)
        e.preventDefault();
        const form = e.target;
        const department = form.department.value;
        const loctype = form.loctype.value;
        const selectedLocation = form[loctype]?.value || '';
        if (!department || !selectedLocation || !loctype) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Please select department and location first!.",
                showConfirmButton: false,
                timer: 1500
            });
            return
        }
        else {
            const assetLocation = {
                department,
                loctype,
                location: selectedLocation,
            }
            setassetLocation(assetLocation)
        }
    }
    const { data: assets, isLoading: assetLoading } = useQuery({
        queryKey: ['assets', assetLocation],
        queryFn: () => assetLocation
            ? getData(
                `/api/getassetsbytype/?department=${assetLocation.department}&loctype=${assetLocation.loctype}&location=${assetLocation.location}`
            )
            : Promise.resolve([]),

        enabled: !!assetLocation
    })


    const assetMutation = useMutation({
        mutationFn: async (data) => postData('/api/postAssets', data),
        onSuccess: async (result) => {
            if (result.data.success) {
                queryClient.invalidateQueries(['selectedType', 'assetLocation',])
                Swal.fire({
                    position: "top-end",
                    title: result.data.message,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            else {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: result.data.message,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        },
        onError: (error) => {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: error.message,
                showConfirmButton: false,
                timer: 1500
            });
        }
    });



    const handlePrint = () => {

        window.print();


    }




    return (

        <div className='print:h-full overflow-auto h-full print:overflow-visible  flex w-full '>

            <div className='grow flex px-4 py-2 flex-col w-full'>
                {assetLocation &&
                    <div className=' space-y-2 print:hidden'>
                        <div className='flex gap-2 items-center'>
                            <button className='btn btn-sm btn-success text-white' onClick={() => setIsOpenModal(isOpenModal === "number" ? null : "number")}>Add asset by Number</button>
                            <button className='btn btn-sm btn-success text-white' onClick={() => setIsOpenModal(isOpenModal === "database" ? null : "database")}>Pick Asset from Database</button>
                        </div>
                        <div>
                            <AssetEntryByNumber isOpenModal={isOpenModal === "number"} setIsOpenModal={setIsOpenModal} assetMutation={assetMutation} assetLocation={assetLocation} />
                            <PickAssetFromDatabase assetMutation={assetMutation} isOpenModal={isOpenModal === "database"} setIsOpenModal={setIsOpenModal} assetLocation={assetLocation} />
                        </div>
                    </div>}
                {assets &&
                    <div className='flex mb-2 border-b-2'>
                        <div className='flex grow flex-col items-center print:text-black '>
                            <h2 className='text-center font-bold text-xl '> Asset list of {`${assetLocation?.location
                                } ${assetLocation?.loctype} of ${assetLocation?.department} department.`} </h2>
                            <p className='text-lg font-bold'>Total assets: {assets.length}</p>
                        </div>
                        <button className='btn btn-warning z-10 print:hidden' onClick={handlePrint}><FaPrint /></button>
                    </div>
                }
                <DataTable tableData={assets} assetLoading={assetLoading} pageNumberRef={pageNumberRef} />

            </div>
            <DeptForm handleSubmit={handleDeptForm} btnText="Search" isAssetEntry />
        </div>


    )
}




export default ManageAssets
