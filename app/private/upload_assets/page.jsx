"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getData, postData } from "../../../lib/api";
import * as XLSX from 'xlsx';

const UploadAssets = () => {
    const [error, setError] = useState('')

    const [data, setData] = useState([]);
    const headers = ["assetNumber", "assetType", "assetDescription", "capDate", "acquisVal"
    ];
    const { data: assetClasses = [] } = useQuery({
        queryKey: ['assetClasses'],
        queryFn: () => getData('/api/assetClass')
    })

    const handleSave = async () => {

        try {
            await postData("/api/saveAssets", data);
            alert("Data saved successfully!");
            setData([]);

        } catch (err) {
            setError("Failed to save data. Try again.");
        }
    };

    // const [data, setData] = useState([]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });

            // Get the first sheet
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];

            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 }); // `header: 1` gives array of arrays
            setData(jsonData);
        };

        reader.readAsBinaryString(file);
    };

    return (
        <div className="mx-auto w-full flex flex-col  h-full  space-y-1">

            <div className="flex-1 ">
                <div className="overflow-auto h-fit max-h-[calc(100vh-250px)]">
                    {data.length > 0 ?
                        <table className="table table-xs table-zebra">
                            <thead>
                                <tr className="bg-gray-200">
                                    {data.length > 0 &&
                                        Object.keys(data[0]).map((header, index) => (
                                            <th key={index} className="">{header}</th>
                                        ))
                                    }

                                </tr>
                            </thead>
                            <tbody>
                                {data.length > 0 && (
                                    data.map((rowData, rowIndex) => (
                                        <tr key={rowIndex} className="even:bg-gray-100">
                                            {Object.keys(rowData).map((key, colIndex) => (
                                                <td key={`${rowIndex}-${colIndex}`} className="">{rowData[key]}</td>
                                            ))}
                                        </tr>
                                    ))
                                )}

                            </tbody>
                        </table>
                        :

                        <div className="form-control">

                            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

                        </div>}

                </div>
                <div className="flex gap-3">
                    <button onClick={() => setData([])} className="btn btn-success mt-2">Clear</button>
                    <button onClick={handleSave} className="btn btn-success mt-2">Save</button>
                </div>
            </div>

        </div>
    );
};

export default UploadAssets;
