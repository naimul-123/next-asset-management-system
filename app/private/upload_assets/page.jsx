"use client";
import { useState } from "react";
import { postData } from "../../../lib/api";
import * as XLSX from "xlsx";
import AssetTypeInput from "@/components/assetTypeInput";

const UploadAssets = () => {
    const [error, setError] = useState("");
    const [data, setData] = useState([]);
    const [missingtypesAssets, setMissingtypesAssets] = useState([]);
    const requiredFields = ["assetNumber", "assetDescription", "capDate", "acquisVal", "accumDep"];

    const getAssetClassByPrefix = (prefix) => {
        const map = {
            "10": "Low Value Asset",
            "11": "Land - off",
            "12": "Building-off",
            "13": "Mechanical Equipment-off",
            "14": "Mechanical Equipment-res",
            "15": "Computer and Network",
            "16": "Electrical  Equip-off",
            "17": "Electrical  Equip-res",
            "20": "Fixture and Fittings-off",
            "21": "Fixture and Fittings-res",
            "22": "Motor Vehicles",
            "51": "Security Equipment",
        };
        return map[prefix] || "";
    };

    const formatExcelDate = (value) => {
        if (typeof value === "number") {
            const baseDate = new Date(1899, 11, 30);
            return new Date(baseDate.setDate(baseDate.getDate() + value));
        }
        return new Date(value);
    };

    const handleFileUpload = async (e) => {
        setData([]);
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = async (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: "binary", cellDates: true });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];

            const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });
            const headersRow = jsonData[0];

            const missingHeaders = requiredFields.filter(
                (field) =>
                    !headersRow.some(
                        (header) =>
                            header &&
                            header.toString().trim().toLowerCase() === field.toLowerCase()
                    )
            );

            if (missingHeaders.length > 0) {
                setError(`Mandatory field(s) missing: ${missingHeaders.join(", ")}`);

                return;
            }

            const rawData = XLSX.utils.sheet_to_json(ws, { raw: false });
            console.log(rawData);
            const res = await postData('/api/processeuploaddata', rawData)
            console.log(res.data);



            setData(res.data);
            setError("");
        };

        reader.readAsBinaryString(file);
    };

    const handleSavedata = async () => {

        setMissingtypesAssets([])
        setError('')

        try {
            const missingtypesAssets = data.reduce((acc, item) =>
                !item.assetType && item.assetNumber ? [...acc, item.assetNumber] : acc, []
            );

            if (missingtypesAssets.length > 0) {
                setMissingtypesAssets(missingtypesAssets)
                setError(`Asset number(s)${missingtypesAssets.join(', ')} are missing assetType. Please select or input assetType of these number assets and try to upload again.`);
                return

            }
            return
            // else {
            //     await postData("/api/uploadassets", data);
            //     alert("Data saved successfully!");
            //     setData([]);
            // }

        } catch (err) {
            console.log(err);
            setError("Failed to save data. Try again.");
        }
    };

    const handleAssetTypeChange = ({ assetNumber, selectedAssetType }) => {
        const updated = data.map((item) =>
            item.assetNumber === assetNumber
                ? { ...item, assetType: selectedAssetType }
                : item
        );
        setData(updated);
    };
    // console.log(data);
    return (
        <div className="mx-auto w-full flex flex-col h-full space-y-1 ">
            <div className="flex-1">
                <div className="overflow-auto h-full max-h-[calc(100vh-250px)]">

                    <table className="table table-xs">
                        <thead>
                            <tr className="bg-gray-200 sticky top-0 z-20">
                                {/* {Object.keys(data[0]).map((header, index) => (
                                        <th key={index}>{header}</th>
                                    ))} */}
                                <th>SL</th>
                                <th>Asset Number</th>
                                <th>Asset Class</th>
                                <th>Asset Type</th>
                                <th>Asset Description</th>
                                <th>Acquis Date</th>
                                <th>Acquis. Val</th>
                                <th>Accum. Dep</th>
                                <th>Book Val</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 && data.map((rowData, idx) => (
                                <tr key={idx} className={`${missingtypesAssets.includes(rowData.assetNumber) ? 'bg-red' : 'even:bg-gray-300'} `}>
                                    <td>{idx + 1}</td>
                                    <td>{rowData?.assetNumber}</td>
                                    <td>{rowData?.assetClass}</td>
                                    <td>{Array.isArray(rowData.assetTypes) && rowData?.assetTypes.length > 0 ?
                                        <AssetTypeInput rowData={rowData} handleAssetTypeChange={handleAssetTypeChange} /> : rowData.assetType}


                                    </td>
                                    <td>{rowData?.assetDescription}</td>
                                    <td>{rowData?.capDate}</td>

                                    <td>{rowData?.acquisVal}</td>
                                    <td>{rowData?.accumDep}</td>
                                    <td>{rowData?.bookVal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                    {data.length === 0 && <div className="form-control">
                        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                    </div>}
                </div>

                {data.length > 0 && (
                    <div className="flex gap-3">
                        <button onClick={() => setData([])} className="btn btn-error mt-2 btn-sm text-white">Clear</button>
                        <button onClick={handleSavedata} className="btn btn-info btn-sm text-white mt-2">Save</button>
                    </div>
                )}
            </div>

            {error && <p className="text-red mt-2">{error}</p>}
        </div>
    );
};

export default UploadAssets;
