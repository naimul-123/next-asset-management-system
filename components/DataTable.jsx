import React from 'react'
import { TiDelete } from "react-icons/ti";
const DataTable = ({ tableData, handleAction }) => {
    if (tableData.length > 0) {
        return (
            <div className="overflow-auto min-w-full border-2 rounded-b-lg">
                <table className="table table-zebra table-md">
                    <thead className=''>
                        <tr className='bg-[#d3efe1] text-[#007f40] sticky top-0 shadow-md py-7 '>
                            <th>SL</th>
                            <th>Asset Number</th>
                            <th>Asset Group</th>
                            <th>Asset Type</th>
                            <th>Asset Description</th>
                            <th>Asset User</th>
                            {handleAction && <th>Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData?.map((data, idx) => <tr key={idx}>
                            <th>{idx + 1}</th>
                            <td>{data.assetNumber}</td>
                            <td>{data.assetGroup}</td>
                            <td>{data.assetType}</td>
                            <td>{data.assetDescription}</td>
                            <td>{data?.assetUser || data?.currentLocation?.assetUser}</td>
                            {
                                handleAction && <td onClick={() => handleAction(data.assetNumber)}><TiDelete className='text-3xl text-red-500' /></td>
                            }

                        </tr>)}

                    </tbody>
                </table>
            </div>
        )
    }
    else return (
        <div className="overflow-auto min-w-full flex flex-coll items-center justify-center">
            <h2 className='text-lg font-bold text-red-500 p-4'>No data found!</h2>
        </div>
    )



}

export default DataTable