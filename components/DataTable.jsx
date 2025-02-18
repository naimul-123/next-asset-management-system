import React, { useState } from 'react'
import { GiReturnArrow } from "react-icons/gi";
import UserInput from "./input/UserInput"
const DataTable = ({ tableData, handleEditLocation, isEditable, assetLoading, handleRemoveAsset }) => {

    const [selectedItems, setSelectedItmes] = useState([]);


    if (assetLoading) {
        return <div className='flex flex-col h-full items-center justify-center'>
            <span className="loading loading-bars grow  loading-sm" ></span >
        </div>
    }

    const handleAction = (e) => {
        e.preventDefault();
    }
    const handleSelectAll = (isSelect) => {
        if (isSelect) {
            const selected = tableData?.map((data) => data.assetNumber);
            setSelectedItmes(selected)
        }
        else {
            setSelectedItmes([])
        }

    }
    const handleSelectItem = (isSelect, number) => {
        console.log(isSelect, number);
        if (isSelect) {
            setSelectedItmes((prev) => [...prev, number])
        }
        else {
            const remaining = selectedItems.filter((item) => item !== number);
            console.log(remaining);
            setSelectedItmes(remaining)
        }
    }

    console.log(selectedItems);
    return (

        <div className="print:min-h-full   overflow-auto print:overflow-hidden print:text-black">

            {tableData?.length > 0 ? (
                <table className="table table-xs table-zebra bg-secondary table-pin-rows ">
                    <thead className="">

                        <tr className="bg-success text-white shadow-xl print:text-black print:shadow-none print:bg-base-200">
                            <th className='py-4'>SL</th>
                            <th className='py-4'>Asset Number</th>
                            <th className='py-4'>Asset Class</th>
                            <th className='py-4'>Asset Type</th>
                            <th className='py-4'>Asset Description</th>
                            <th className='py-4'>Asset User</th>
                            <th className='py-4 print:hidden'></th>
                        </tr>
                        <tr className='print:hidden print:h-0'>
                            <th colSpan={7} className='py-4'>
                                <form className='flex gap-2' onSubmit={handleAction}>
                                    <label className='flex items-center gap-2'>
                                        <input type='checkbox' className='checkbox checkbox-warning' onClick={(e) => handleSelectAll(e.target.checked)} />
                                        <span>All</span>
                                    </label>
                                    <label className='flex items-center gap-2'>
                                        <select className='select select-primary select-sm'>
                                            <option value="">Bulk Action</option>
                                            <option value="">Remove</option>
                                            <option value="">Rename</option>
                                        </select>

                                    </label>
                                    <label className='flex items-center gap-2'>
                                        <button className='btn btn-sm btn-warning'>Submit</button>
                                    </label>
                                    <label className='flex items-center gap-2'>
                                        <span className='label-text'>{`${selectedItems.length}  Item${selectedItems.length > 1 ? "s" : ''} selected`}</span>
                                    </label>
                                </form>
                            </th>
                        </tr>
                    </thead>
                    <tbody>

                        {tableData.length > 0 &&
                            tableData?.map((data, idx) => {
                                const handleEdit = (assetUser) => {
                                    const assetInfo = {
                                        assetNumber: data?.assetNumber,
                                        assetUser: assetUser,
                                    };
                                    handleEditLocation && handleEditLocation(assetInfo);
                                };
                                return (
                                    <tr key={idx}>

                                        <th>
                                            <label className='flex items-center gap-2 '>
                                                <input type='checkbox' checked={selectedItems.includes(data.assetNumber)} onClick={(e) => handleSelectItem(e.target.checked, data?.assetNumber)} className='checkbox checkbox-warning print:hidden' />
                                                <span> {idx + 1}</span>
                                            </label>
                                        </th>
                                        <td>{data.assetNumber}</td>
                                        <td>{data.assetClass}</td>
                                        <td>{data.assetType}</td>
                                        <td>{data.assetDescription}</td>
                                        <td className="hidden print:block">{data?.assetUser}</td>
                                        <td className="print:hidden">
                                            <UserInput
                                                isEditable
                                                handleEdit={handleEdit}
                                                data={data?.assetUser || data?.currentLocation?.assetUser}
                                            />
                                        </td>
                                        <td className="print:hidden ">
                                            <button className="btn btn-warning" onClick={() => handleRemoveAsset(data)}>
                                                <GiReturnArrow className="text-red-500" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}

                    </tbody>
                    <tfoot className=''>
                        <tr className="hidden print:table-row">
                            <th colSpan={6} className="text-center py-2">
                                Copyright © {new Date().getFullYear()} - All rights reserved by <br /> Dead Stock Section, Bangladesh Bank, Barishal.
                            </th>
                        </tr>
                    </tfoot>
                </table>

            ) : (
                <h2 className="text-2xl font-bold text-red-500 p-4 bg-secondary text-center">
                    Select department, location type, location, and click on the search button to view assets.
                </h2>
            )}
        </div>


    )
}






export default DataTable