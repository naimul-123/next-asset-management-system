"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getData, postData } from "../../../lib/api";

const assetClasses = [
    "Security Equipment",
    "Electrical Equipment- Office",
    "Electrical Equipment- Residence",
    "Fixture and Fittings- Office",
    "Mechanical Equipment- Office",
    "Motor Vehicles",
    "Fixture and Fittings- Residence",
    "Computer and Networking",
    "Mechanical Equipment- Residence",
    "Low value Asset",
];

const UploadAssets = () => {
    const [error, setError] = useState('')

    const [data, setData] = useState([]);
    const headers = ["assetNumber", "assetClass", "assetType", "capDate", "assetDescription", "acquisVal", "bookVal"
    ];


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
                <table className="table table-xs table-zebra table-pin-rows table-pin-cols">
                    <thead>
                        <tr className="bg-gray-200">
                            {headers.map((header, index) => (
                                <th key={index} className="">{header}</th>
                            ))}

                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? data.map((rowData, rowIndex) => (
                            <tr key={rowIndex} className="even:bg-gray-100">
                                {headers.map((header, colIndex) => (
                                    <td key={`${rowIndex}-${colIndex}`} className="">
                                        {rowData[header]}
                                    </td>
                                ))}
                            </tr>
                        )) : <tr>

                            <td colSpan={7}> <textarea className="textarea textarea-bordered w-full" placeholder="Paste Excel data Here..." onPaste={handlePaste}></textarea></td></tr>}
                    </tbody>
                </table>


            </div>
            <div className="flex gap-3">
                <button onClick={() => setData([])} className="btn btn-success mt-2">Clear</button>
                <button onClick={handleSave} className="btn btn-success mt-2">Save</button>

            </div>

        </div>
    );
};

export default UploadAssets;
