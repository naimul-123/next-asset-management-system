"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getData, postData } from "../../../lib/api";



const UploadAssets = () => {
    const [error, setError] = useState('')

    const [data, setData] = useState([]);
    const headers = ["assetNumber", "assetType", "assetDescription", "capDate", "acquisVal"
    ];
    const { data: assetClasses = [] } = useQuery({
        queryKey: ['assetClasses'],
        queryFn: () => getData('/api/assetClass')
    })
    console.log(assetClasses);
    const handlePaste = (event) => {
        setData([]);

        const pastedText = event.clipboardData.getData("text").replace(/\r/g, "");
        const rows = pastedText.trim().split("\n");

        const dataArray = rows.map((row) => {
            const values = row.split("\t");

            let rowObj = headers.reduce((obj, header, index) => {
                obj[header] = values[index]?.trim() || "";
                return obj;
            }, {});

            // Extract assetCode from assetNumber
            const assetNumber = rowObj.assetNumber;
            if (assetNumber) {
                const assetCode = parseInt(assetNumber.substring(0, 2)); // Adjust based on assetCode length

                // Find matching assetClass
                const assetClassObj = assetClasses.find(ac => ac.assetCode === assetCode);
                if (assetClassObj) {
                    rowObj.assetClass = assetClassObj.assetClass;
                }
            }

            return rowObj;
        }).filter(Boolean); // Remove invalid rows

        setData(dataArray);
    };




    console.log(data);

    const handleSave = async () => {

        try {
            await postData("/api/saveAssets", data);
            alert("Data saved successfully!");
            setData([]);

        } catch (err) {
            setError("Failed to save data. Try again.");
        }
    };



    return (
        <div className="max-w-screen-xl w-full bg-lightGray">


            <div className="overflow-auto h-fit">
                {data.length > 0 ?
                    <table className="table table-xs table-zebra table-pin-rows table-pin-cols">
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

                        <textarea
                            className="textarea textarea-xs border-none focus:border-none focus:outline-none textarea-ghost"
                            placeholder="Paste Excel data Here..."
                            onPaste={handlePaste}
                        ></textarea>

                    </div>}

            </div>
            <div className="flex gap-3">
                <button onClick={() => setData([])} className="btn btn-success mt-2">Clear</button>
                <button onClick={handleSave} className="btn btn-success mt-2">Save</button>

            </div>

        </div>
    );
};

export default UploadAssets;
