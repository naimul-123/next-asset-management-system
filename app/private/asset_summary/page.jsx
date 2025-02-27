"use client"

import { getData } from '../../../lib/api';
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'

const AssetSummary = () => {

    const [openIndex, setOpenIndex] = useState(null)
    const { data: assetSummary = [], isLoading, refetch } = useQuery({
        queryKey: ['assetsummary'],
        queryFn: () => getData('/api/getSummary')
    })


    const handleToggle = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx)
    }
    console.log(assetSummary);


    return (



        <div className='overflow-auto h-full print:overflow-hidden'>
            <table className="table h-full   table-md table-pin-rows  ">
                <thead className=' '>
                    <tr className='text-primary bg-gray-bright font-extrabold shadow-md '>
                        <th>
                            <div className='grid grid-cols-6'>
                                <h2>SL</h2>
                                <h2 className='col-span-2'>Asset Class</h2>
                                <h2 className='text-right'>Total Assets</h2>
                                <h2 className='text-right'>Acquisation Value</h2>
                                <h2 className='text-right'>Book Value</h2>
                            </div>
                        </th>

                    </tr>
                </thead>
                <tbody className='bg-gray-bright  '>

                    {assetSummary?.map((data, idx) => {
                        return (
                            <tr key={idx} className={`sticky bg-gray-bright border-none top-8  z-[${idx + 11}]`}>
                                <th className='p-0 bg-gray-bright print:visible collapse border-b border-primary rounded-none   '>
                                    <input type="checkbox" className='' />
                                    <div className='grid grid-cols-6  px-4 bg-gray-bright shadow-xl  collapse-title'>
                                        <h2>{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}.</h2>
                                        <h2 className='col-span-2'>{data.assetClass}</h2>
                                        <h2 className='text-right'>{data.totalAssets.toLocaleString("en-IN")}</h2>
                                        <h2 className='text-right'>{data.totalAcquisVal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                                        <h2 className='text-right'>{data.totalBookVal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                                    </div>
                                    <div className='collapse-content print:visible bg-white !min-h-0 print:min-h-fit max-h-96 overflow-auto'>
                                        {
                                            data?.assetTypes.map((type, tdx) =>
                                                <div key={tdx} className={`grid grid-cols-6 py-2 
                                                
                                                `}>
                                                    <h3 className=''>{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}.{tdx + 1 < 10 ? `0${tdx + 1}` : tdx + 1}.</h3>
                                                    <h3 className='col-span-2'>{type.assetType}</h3>
                                                    <h3 className='text-right'>{type.totalAssets.toLocaleString("en-IN")}</h3>
                                                    <h3 className='text-right'>{type.acquisVal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                                                    <h3 className='text-right'>{type.bookVal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                                                </div>
                                            )
                                        }
                                    </div>

                                </th>

                            </tr>


                        )
                    }


                    )}

                </tbody>
            </table>
        </div >

    )
}

export default AssetSummary