"use client";
import { useEffect, useMemo, useState } from "react";
import { getData, postData } from "../../../lib/api";
import * as XLSX from "xlsx";
import AssetTypeInput from "@/components/assetTypeInput";
import AssetLocationInput from "@/components/assetLocationInput";
import { useMutation, useQuery } from "@tanstack/react-query";
import DeptChangeForm from "@/components/DeptChangeForm";
import { FaDownload } from "react-icons/fa";
import Swal from "sweetalert2";

const UploadNewAssets = () => {
  const [error, setError] = useState({});
  const [data, setData] = useState([]);
  const [assetTypesInfo, setAssetTypesInfo] = useState([]);
  const [missingtypesAssets, setMissingtypesAssets] = useState([]);
  const [missingLocations, setMissingLocations] = useState([]);
  const [locationError, setLocationError] = useState("");
  const [selectedItems, setSelectedItmes] = useState([]);
  const [action, setAction] = useState("");
  const requiredFields = [
    "assetNumber",
    "assetDescription",
    "capDate",
    "acquisVal",
    "accumDep",
    "bookVal",
  ];
  const { data: departmentData = [], refetch: deptRefetch } = useQuery({
    queryKey: ["departments"],
    queryFn: () => getData("/api/getdeptdata"),
  });
  const assetTypesMap = useMemo(() => {
    const map = new Map();
    assetTypesInfo?.forEach(({ assetClass, assetTypes }) => {
      map.set(assetClass, assetTypes);
    });
    return map;
  }, [assetTypesInfo]);
  console.log(data);
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
        const headersError = `Mandatory field(s) missing: ${missingHeaders.join(
          ", "
        )}`;
        error.headersError = headersError;
        return;
      }

      const rawData = XLSX.utils.sheet_to_json(ws, { raw: false });
      const assetNumbers = rawData?.map((d) => d.assetNumber);
      const res = await postData("/api/processeuploaddata", { assetNumbers });

      if (res?.data.enhancedData) {
        const enrichedData = res?.data.enhancedData;
        const enrichedMap = new Map(
          enrichedData.map((d) => [String(d.assetNumber), d])
        );
        const finalData = rawData.map((item) => {
          const enriched = enrichedMap.get(String(item.assetNumber)) || {
            assetClass: null,
            assetType: null,
            isTypeExist: false,
          };
          return {
            ...item,
            ...enriched,
          };
        });

        setData(finalData);
      }

      if (res?.data?.assetTypesInfo) {
        setAssetTypesInfo(res.data.assetTypesInfo);
      }

      setError("");
    };

    reader.readAsBinaryString(file);
  };

  const handleAssetTypeMissing = (data) => {
    setMissingtypesAssets([]);
    setError((prev) => ({
      ...prev,
      typesError: "",
    }));

    const missingtypesAssets = data.reduce(
      (acc, item) =>
        !item.assetType && item.assetNumber ? [...acc, item.assetNumber] : acc,
      []
    );
    if (missingtypesAssets.length > 0) {
      setMissingtypesAssets(missingtypesAssets);
      const typesError = `Asset number(s)${missingtypesAssets.join(
        ", "
      )} are missing assetType.`;

      setError((prev) => ({
        ...prev,
        typesError: typesError,
      }));
    }
  };
  const handleLocationMissing = (data) => {
    setMissingLocations([]);
    setError((prev) => ({
      ...prev,
      locationError: "",
    }));

    const missingLocationAssets = data.reduce(
      (acc, item) =>
        !item.assetLocation && item.assetNumber
          ? [...acc, item.assetNumber]
          : acc,
      []
    );
    if (missingLocationAssets.length > 0) {
      setMissingLocations(missingLocationAssets);
      const locationError = `Asset number(s)${missingLocationAssets.join(
        ", "
      )} are missing location info.`;
      setError((prev) => ({
        ...prev,
        locationError: locationError,
      }));
    }
  };
  const handleSavedata = async () => {
    try {
      if (missingtypesAssets.length > 0 || missingLocations.length > 0) {
        return;
        // } else {
        //   const newAssets = data.map((d) => {
        //     const newAsset = {
        //       assetNumber: d.assetNumber,
        //       assetType: d.assetType,
        //       assetClass: d.assetNumber,
        //       accumDep: d.accumDep,
        //       acquisVal: d.acquisVal,
        //       bookVal: d.bookVal,
        //     };
        //     return newAsset;
        //   });

        //   const newLocations = data.map((d) => {
        //     const newLoc = {
        //       assetNumber: d.assetNumber,
        //       locationInfo: d.locationInfo,
        //     };
        //     return newLoc;
        //   });
        //   console.log(newLocations);
        //   console.log(newAssets);
        //   return;
        // }

      } else {
        const res = await postData("/api/uploadnewassets", data);
        console.log(res);
        if (res.data.message) {
          Swal.fire(res.data.message)
          setData([]);
        }

      }
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
    handleAssetTypeMissing(data);
    handleLocationMissing(data);
  }, [data]);

  const handleLocationInfo = (e) => {
    e.preventDefault();
    const form = e.target;
    const assetNumber = form.assetNumber.value;
    const department = form.department.value;
    const locationType = form.locationType.value;
    const location = form.location.value;
    const assetUser = form.assetUser.value;
    const assetLocation = {
      department,
      locationType,
      location,
      assetUser
    };

    const updated = data.map((item) =>
      item.assetNumber === assetNumber ? { ...item, assetLocation } : item
    );
    setData(updated);
  };

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
        },
      });
    }
  };

  return (
    <div className="mx-auto w-full flex flex-col h-full space-y-1 ">
      {data?.length > 0 ? (
        <>

          <div className="overflow-auto h-full max-h-[calc(100vh-250px)]">
            <table className="table table-xs">
              <thead>
                <tr className="bg-gray-200 sticky top-0 z-20">
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
                {data.length > 0 &&
                  data?.map((rowData, idx) => (
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
                      <td>
                        <div className="tooltip tooltip-bottom">
                          <p>{rowData?.assetDescription}</p>
                          <div className="tooltip-content px-2 py-1">
                            <p>Cap.Date:{rowData?.capDate}</p>
                            <p>Acquis.Val:{rowData?.acquisVal}</p>
                          </div>
                        </div>

                      </td>
                      <td colSpan={5} className="w-full">
                        {" "}
                        <AssetLocationInput
                          departmentData={departmentData}
                          handleAssetTypeChange={handleAssetTypeChange}
                          rowData={rowData}
                          handleLocationInfo={handleLocationInfo}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setData([])}
              className="btn btn-error btn-soft btn-sm"
            >
              Clear
            </button>
            {error.typesError && (
              <div>
                {/* Open the modal using document.getElementById('ID').showModal() method */}
                <button
                  className="btn btn-error btn-soft btn-sm"
                  onClick={() =>
                    document.getElementById("typeError").showModal()
                  }
                >
                  {missingtypesAssets.length} asset(s) missing assetType.
                </button>
                <dialog id="typeError" className="modal">
                  <div className="modal-box">
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                        ✕
                      </button>
                    </form>
                    <div className="">
                      <span>{error.typesError}</span>
                    </div>
                  </div>
                </dialog>
              </div>
            )}
            {error.locationError && (
              <div>
                {/* Open the modal using document.getElementById('ID').showModal() method */}
                <button
                  className="btn btn-error btn-soft btn-sm"
                  onClick={() =>
                    document.getElementById("locationError").showModal()
                  }
                >
                  {missingLocations.length} asset(s) missing location info.
                </button>
                <dialog id="locationError" className="modal">
                  <div className="modal-box">
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                        ✕
                      </button>
                    </form>
                    <div className="">
                      <span>{error.locationError}</span>
                    </div>
                  </div>
                </dialog>
              </div>
            )}

            <button
              disabled={missingLocations.length || missingtypesAssets.length}
              onClick={handleSavedata}
              className="btn btn-success btn-soft btn-sm"
            >
              Upload
            </button>
          </div>
        </>
      ) : (
        <div className="form-control">
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
        </div>
      )}
    </div>
  );
};

export default UploadNewAssets;
