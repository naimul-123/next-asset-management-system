"use client";
import { useEffect, useMemo, useState } from "react";
import { postData } from "../../../lib/api";
import * as XLSX from "xlsx";
import AssetTypeInput from "@/components/assetTypeInput";
import AssetLocationInput from "@/components/assetLocationInput";
import { useMutation, useQuery } from "@tanstack/react-query";
import DeptChangeForm from "@/components/DeptChangeForm";
import { FaDownload } from "react-icons/fa";

const UploadNewAssets = () => {
    const [error, setError] = useState("");
    const [data, setData] = useState([]);
    const [assetTypesInfo, setAssetTypesInfo] = useState([])
    const [missingtypesAssets, setMissingtypesAssets] = useState([]);
    const [selectedItems, setSelectedItmes] = useState([]);
    const [action, setAction] = useState("");
    const requiredFields = ["assetNumber", "assetDescription", "capDate", "acquisVal", "accumDep", "bookVal"];
    const { data: departmentData = [], refetch: deptRefetch } = useQuery({
        queryKey: ["departments"],
        queryFn: () => getData("/api/getdeptdata"),
    });
    const assetTypesMap = useMemo(() => {
        const map = new Map();
        assetTypesInfo?.forEach(({ assetClass, assetTypes }) => {
            map.set(assetClass, assetTypes)

        });
        return map;
    }, [assetTypesInfo])


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
            const assetNumbers = rawData?.map(d => d.assetNumber)
            const res = await postData('/api/processeuploaddata', { assetNumbers })


            if (res?.data.enhancedData) {
                const enrichedData = res?.data.enhancedData
                const enrichedMap = new Map(enrichedData.map(d => [String(d.assetNumber), d]));
                const finalData = rawData.map(item => {
                    const enriched = enrichedMap.get(String(item.assetNumber)) || {
                        assetClass: null,
                        assetType: null,
                        isTypeExist: false
                    };
                    return {
                        ...item,
                        ...enriched
                    }


                });

                setData(finalData)
            }

            if (res?.data?.assetTypesInfo) {
                setAssetTypesInfo(res.data.assetTypesInfo)
            }

            setError("");
        };

        reader.readAsBinaryString(file);
    };


    const handleAssetTypeMissing = (data) => {
        setMissingtypesAssets([])
        setError('')
        const missingtypesAssets = data.reduce((acc, item) =>
            !item.assetType && item.assetNumber ? [...acc, item.assetNumber] : acc, []
        );
        if (missingtypesAssets.length > 0) {
            setMissingtypesAssets(missingtypesAssets)
            setError(`Asset number(s)${missingtypesAssets.join(', ')} are missing assetType.`);
        }
    }

    const handleSavedata = async () => {


        try {
            if (missingtypesAssets.length > 0) {
                return
            }

            // else {
            //     await postData("/api/UploadNewAssets", data);
            //     alert("Data saved successfully!");
            //     setData([]);
            // }

        } catch (err) {
            console.log(err);
            setError("Failed to save data. Try again.");
        }
    };

    const handleAssetTypeChange = async ({ assetNumber, selectedAssetType }) => {
        const updated = data.map((item) =>
            item.assetNumber === assetNumber
                ? { ...item, assetType: selectedAssetType }
                : item
        );
        setData(updated);

    };

    useEffect(() => {
        handleAssetTypeMissing(data)
    }, [data])

    const handleLocationInfo = (e) => {
        e.preventDefault();
        const form = e.target;
        const assetNumber = form.assetNumber.value;
        const department = form.department.value;
        const locationType = form.locationType.value;
        const location = form.location.value;
        const locationInfo = {
            department,
            locationType,
            location
        }

        const updated = data.map((item) =>
            item.assetNumber === assetNumber
                ? { ...item, locationInfo }
                : item
        );
        setData(updated);
        console.log(assetNumber, locationInfo);
    }


    const handleSelectAll = (isSelect) => {
        if (isSelect) {
            const selected = assets?.map((data) => data.assetNumber);
            setSelectedItmes(selected);
        } else {
            setSelectedItmes([]);
        }
    };
    const handleSelectItem = (isSelect, number) => {
        if (isSelect) {
            setSelectedItmes((prev) => [...prev, number]);
        } else {
            const remaining = selectedItems.filter((item) => item !== number);
            setSelectedItmes(remaining);
        }
    };
    const updateAssetsLocation = useMutation({
        mutationFn: (data) => postData("/api/updateAssetsLocation", data),
        queryKey: ["updateAssetsLocation"],
    });



    const updateAssetsUser = useMutation({
        mutationFn: (data) => postData("/api/updateAssetsUser", data),
        queryKey: ["updateAssetsUser"],
    });

    const handleAction = (e) => {
        e.preventDefault();
        const form = e.target;
        const assetUser = form.assetUser.value;
        if (action === "changeUser") {
            const data = { assetUser, assetNumbers: selectedItems };
            updateAssetsUser.mutate(data, {
                onSuccess: (result) => {
                    console.log(result);
                    if (result.data.success) {
                        queryClient.invalidateQueries(["assets"]);
                        Swal.fire({
                            position: "top-end",
                            title: result.data.message,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    } else {
                        Swal.fire({
                            position: "top-end",
                            title: result.data.message,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    }
                    form.reset();
                    setSelectedItmes([]);
                    setSelecteddept("");
                    setlocationType("");
                },
            });
        }

        if (action === "changeLocation") {
            const department = form.department.value;
            const locationType = form.locationType.value;
            const location = form.location.value;
            const data = {
                department,
                location,
                locationType,
                assetUser,
                assetNumbers: selectedItems,
            };
            updateAssetsLocation.mutate(data, {
                onSuccess: (result) => {
                    if (result.data.success) {
                        queryClient.invalidateQueries(["assets"]);
                        Swal.fire({
                            position: "top-end",
                            title: result.data.message,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    } else {
                        Swal.fire({
                            position: "top-end",
                            icon: "error",
                            title: result.data.message,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    }
                    form.reset();
                    setSelectedItmes([]);
                    setSelecteddept("");
                    setSelectedType("");
                    setLocation('')
                },
            });
        }
    };
    console.log(data);
    return (
        <div className="mx-auto w-full flex flex-col h-full space-y-1 ">

            {data?.length > 0 ?
                <>
                    <div className="flex items-start w-full ">
                        <DeptChangeForm handleAction={handleAction} departmentData={departmentData} handleSelectAll={handleSelectAll} selectedItems={selectedItems} action={action} setAction={setAction} />

                        <button
                            onClick={() => handleDownloadAssets(assets)}
                            className="btn w-full max-w-fit  btn-xs btn-warning hover:link "
                        >
                            <span>Download Excel</span>
                            <FaDownload />
                        </button>
                    </div>
                    <div className="overflow-auto h-full max-h-[calc(100vh-250px)]">
                        <table className="table table-xs">
                            <thead>
                                <tr className="bg-gray-200 sticky top-0 z-20">
                                    {/* {Object.keys(data[0]).map((header, index) => (
                                        <th key={index}>{header}</th>
                                    ))} */}
                                    <th>SL</th>
                                    <th>Asset Number</th>
                                    <th>Asset Type</th>
                                    <th>Asset Description</th>
                                    <th>Department</th>
                                    <th>Location Type</th>
                                    <th>Location</th>
                                    <th>Asset User</th>
                                    <th>Action</th>



                                </tr>
                            </thead>
                            <tbody>
                                {data.length > 0 && data?.map((rowData, idx) => (
                                    <tr key={idx} className="even:bg-gray-300">
                                        <td>{idx + 1}</td>
                                        <td>{rowData?.assetNumber}</td>
                                        <td>
                                            {rowData.isTypeExist ? (
                                                rowData.assetType
                                            ) : (
                                                <AssetTypeInput
                                                    isMissingType={missingtypesAssets.includes(
                                                        rowData.assetNumber
                                                    )}
                                                    rowData={rowData}
                                                    assetTypes={
                                                        assetTypesMap.get(rowData.assetClass) || []
                                                    }
                                                    handleAssetTypeChange={handleAssetTypeChange}
                                                />
                                            )}
                                        </td>
                                        <td className="tooltip">
                                            <p>{rowData?.assetDescription}</p>
                                            <div className="tooltip-content px-2 py-1">
                                                <p>Cap.Date:{rowData?.capDate}</p>
                                                <p>Acquis.Val:{rowData?.acquisVal}</p>
                                            </div>


                                        </td>
                                        <td colSpan={5} className="w-full"> <AssetLocationInput handleAssetTypeChange={handleAssetTypeChange} rowData={rowData} handleLocationInfo={handleLocationInfo} /></td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                    {
                        error ? <div className="bg-rose-400 text-wrap px-3 py-2">
                            <span>{error}</span>
                        </div>
                            : <div className="flex gap-3">
                                <button onClick={() => setData([])} className="btn btn-error mt-2 btn-sm text-white">Clear</button>
                                <button onClick={handleSavedata} className="btn btn-info btn-sm text-white mt-2">Save</button>
                            </div>
                    }
                </>

                :
                <div className="form-control">
                    <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                </div>
            }






        </div>

    );
};

export default UploadNewAssets;
