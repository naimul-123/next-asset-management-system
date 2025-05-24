"use client";

import { useAuth } from '@/contexts/authContext';
import { getData } from '../../../lib/api';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

const AssetSummary = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const [printMode, setPrintMode] = useState(false);
    const { user } = useAuth();
    const { data: assetSummary = [], isLoading } = useQuery({
        queryKey: ['assetsummary'],
        queryFn: () => getData(`/api/getSummary?role=${user?.role}`),
    });

    // Automatically expand all rows during print
    useEffect(() => {
        const beforePrint = () => {
            setPrintMode(true);
            setOpenIndex('all'); // Expand all
        };
        const afterPrint = () => {
            setPrintMode(false);
            setOpenIndex(null); // Reset after print
        };

        window.addEventListener('beforeprint', beforePrint);
        window.addEventListener('afterprint', afterPrint);

        return () => {
            window.removeEventListener('beforeprint', beforePrint);
            window.removeEventListener('afterprint', afterPrint);
        };
    }, []);

    const handleToggle = (idx) => {
        if (printMode) return; // Disable toggle in print mode
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <div className={`overflow-auto h-full w-full mx-auto ${printMode ? 'print-mode' : ''}`}>
            <table className="table table-xs table-pin-rows">
                <thead>
                    <tr className="text-primary font-extrabold shadow-md border-b-0">

                        <th>SL</th>
                        <th className="">Asset Class</th>
                        <th className="text-right">Total Assets</th>
                        <th className="text-right">Acquisation Value</th>
                        <th className="text-right">Book Value</th>

                    </tr>
                </thead>
                <tbody>
                    {assetSummary.map((data, idx) => (
                        <React.Fragment key={idx}>

                            <tr onClick={() => handleToggle(idx)}
                                className={`cursor-pointer bg-light font-work-sans font-bold ${!printMode ? `sticky top-7 z-[${idx + 11}]` : ''}`}>
                                <td>{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}.</td>
                                <td className="">{data.assetClass}</td>
                                <td className="text-right">{data.totalAssets.toLocaleString('en-IN')}</td>
                                <td className="text-right">
                                    {data.totalAcquisVal.toLocaleString('en-IN', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </td>
                                <td className="text-right">
                                    {data.totalBookVal.toLocaleString('en-IN', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </td>
                            </tr>


                            {(openIndex === idx || openIndex === 'all') && (
                                // here  I want to break page after each tr in print mood
                                <tr className={printMode ? 'print:break-after-page' : ''}>
                                    <td colSpan={5} className="overflow-auto max-h-96">
                                        <table className="table table-xs table-pin-rows table-zebra bg-white w-full -z-10">
                                            <tbody>
                                                {data?.assetTypes.map((type, tdx) => (
                                                    <tr key={tdx} className="">
                                                        <td>
                                                            {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}.
                                                            {tdx + 1 < 10 ? `0${tdx + 1}` : tdx + 1}.
                                                        </td>
                                                        <td className="">{type.assetType}</td>
                                                        <td className="text-right">
                                                            {type.totalAssets.toLocaleString('en-IN')}
                                                        </td>
                                                        <td className="text-right">
                                                            {type.acquisVal.toLocaleString('en-IN', {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            })}
                                                        </td>
                                                        <td className="text-right">
                                                            {type.bookVal.toLocaleString('en-IN', {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            })}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssetSummary;
