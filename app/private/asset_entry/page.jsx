"use client"
import AssetEntryForm from '../../../components/forms/AssetEntryForm'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import DeptForm from '../../../components/forms/DeptForm';
import DataTable from '../../../components/DataTable';
import { useMutation } from '@tanstack/react-query';
import { postData } from '../../../lib/api';

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
        const isExist = localAsset?.find(asset => asset.assetNumber === val.assetNumber)
        if (isExist) {
            alert("This asset already added to list of this section")
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
        const section = form.section.value;
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

        else if (!department || !section) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Please select department and section first!.",
                showConfirmButton: false,
                timer: 1500
            });
            return
        }

        else {
            const assetfinalData = assetData.map((data) => {
                const assetLocation = {
                    department,
                    section,
                    assetUser: data.assetUser
                }
                const asset = {
                    assetNumber: data.assetNumber,
                    assetGroup: data.assetGroup,
                    assetType: data.assetType,
                    assetDescription: data.assetDescription,
                    assetLocation
                }
                return asset
            })
            assetMutation.mutate(assetfinalData)
        }


    }


    return (

        <div className='mx-auto h-[calc(100vh-220px)] flex gap-2 '>
            <div className='grow flex flex-col'>
                <AssetEntryForm getFormData={getFormData} />
                <DataTable tableData={assetData} handleAction={handleRemove} />
            </div>
            <div className='max-w-60 w-full   p-2 border shadow-md rounded-md'>
                <DeptForm handleSubmit={handleFinalSubmit} />
            </div>

        </div>


    )
}

export default AssetEntry
