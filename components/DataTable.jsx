import React, { useState } from 'react'
import { GiReturnArrow } from "react-icons/gi";
import UserInput from "./input/UserInput"
const DataTable = ({ tableData, handleEditLocation, isEditable, assetLoading, handleRemoveAsset }) => {




    if (assetLoading) {
        return <div className='flex flex-col h-full items-center justify-center'>
            <span className="loading loading-bars grow  loading-sm" ></span >
        </div>
    }
    return (

        <div className="print:min-h-full min-w-full  overflow-auto print:overflow-visible print:text-black">
            {tableData?.length > 0 ? (
                <table className="table table-xs table-zebra bg-secondary table-pin-rows h-full">
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
                                        <th>{idx + 1}</th>
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
                        <tr className=" hidden print:table-row ">
                            <th colSpan={7} className="text-center">
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