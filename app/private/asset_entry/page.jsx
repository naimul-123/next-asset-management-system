"use client"
import AssetEntryForm from '../../../components/forms/AssetEntryForm'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import DeptForm from '../../../components/forms/DeptForm';
import DataTable from '../../../components/DataTable';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getData, postData } from '../../../lib/api';
import axios from 'axios';
import Button from '../../../components/reusable/Button';

const AssetEntry = () => {
    const [assetData, setAssetData] = useState([])










    const assetMutation = useMutation({
        mutationFn: async (data) => postData('/api/assetInfo', data),
        onSuccess: async (result) => {
            if (result.data.success) {
                localStorage.removeItem('assetData');
                setAssetData([]);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Assets have been saved successfully.",
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


    useEffect(() => {
        const localAssetData = localStorage.getItem('assetData');
        const localAsset = localAssetData ? JSON.parse(localAssetData) : [];
        setAssetData(localAsset)
    }, [setAssetData])
    const getFormData = (val) => {

        const localAssetData = localStorage.getItem('assetData');
        const localAsset = localAssetData ? JSON.parse(localAssetData) : [];
        const isExist = localAsset?.find(asset => val.assetNumber && asset.assetNumber === val.assetNumber)
        if (isExist) {

            Swal.fire({
                position: "top",
                title: "This asset already added to list of this section",
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                    container: 'rounded-lg z-[9999]'
                }
            })
            return
        }
        else {
            const updateAssets = [...localAsset, val];
            localStorage.setItem("assetData", JSON.stringify(updateAssets));
            setAssetData(updateAssets);
        }
    }
    const handleRemove = (assetNum) => {
        const localAssetData = localStorage.getItem('assetData');
        const localAsset = localAssetData ? JSON.parse(localAssetData) : [];
        const remainingList = localAsset?.filter((asset) => asset.assetNumber !== assetNum)
        localStorage.setItem("assetData", JSON.stringify(remainingList))
        setAssetData(remainingList)
    }

    const handleFinalSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const department = form.department.value;
        const loctype = form.loctype.value;
        const selectedLocation = form[loctype]?.value || '';


        if (assetData.length <= 0) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "You have no data to seve!.",
                showConfirmButton: false,
                timer: 1500
            });
            return
        }

        else if (!department || !selectedLocation) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: `Please select department and ${loctype} first!.`,
                showConfirmButton: false,
                timer: 1500
            });
            return
        }

        else {
            const assetfinalData = assetData.map((data) => {
                const asset = {
                    assetNumber: data.assetNumber,
                    assetGroup: data.assetGroup,
                    assetType: data.assetType,
                    assetDescription: data.assetDescription,
                    assetLocation: {
                        department,
                        [loctype]: selectedLocation,
                        assetUser: data.assetUser
                    }
                }
                return asset
            })
            assetMutation.mutate(assetfinalData)
        }

    }




    return (

        <div className='mx-auto  h-[calc(100vh-220px)] flex gap-2 '>
            <div className='grow flex flex-col'>
                <AssetEntryForm getFormData={getFormData} />
                <DataTable tableData={assetData} handleAction={handleRemove} />
            </div>
            <div className='max-w-xs w-full h-full overflow-auto  p-2 border shadow-md rounded-md'>
                <DeptForm handleSubmit={handleFinalSubmit} isAssetEntry />
            </div>

        </div>


    )
}

export default AssetEntry
