"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { deleteData, getData, postData } from "../../../lib/api";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { FaDownload } from "react-icons/fa";
import { useAuth } from "@/contexts/authContext";

import AssetLocationInput from "@/components/assetLocationInput";
import DeptChangeForm from "@/components/DeptChangeForm";

const ManageAssets = () => {
  const [searchType, setSearchType] = useState("");
  const [location, setLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [locationTypes, setlocationTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedDept, setSelecteddept] = useState("");
  const [isEdit, setIsEdit] = useState(true);
  const [action, setAction] = useState("");
  const [selectedItems, setSelectedItmes] = useState([]);
  const queryClient = useQueryClient();
  const [assettypes, setTypes] = useState([]);
  const [assetInfo, setAssetInfo] = useState({});
  const { user } = useAuth();


  const { data: departmentData = [], refetch: deptRefetch } = useQuery({
    queryKey: ["departments"],
    queryFn: () => getData("/api/getdeptdata"),
  });

  const { data: rejectedassets = [], refetch: rejectdRefetch } = useQuery({
    queryKey: ["rejectedassets"],
    queryFn: async () => await getData("/api/rejectedassets"),
  });

  const handleDeleteRejectedAssets = () => {
    Swal.fire({
      title: "Do you want to delete the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await deleteData('/api/rejectedassets', { rejectedassets, role: user.role });
        if (res?.success) {
          Swal.fire(res.message);
          rejectdRefetch();
        }
      }
    });
  }

  const departments = departmentData?.map((dept) => dept.department);

  const handleDeptChange = (value) => {
    setLocations([]);
    setlocationTypes([]);
    setSelectedType("");
    setSelecteddept(value);
    const locationTypes = departmentData
      .find((d) => d.department === value)
      .locations.map((loc) => loc.locationType);
    setlocationTypes(locationTypes);
  };

  const handleLocTypeChange = (selectedType) => {
    setSelectedType(selectedType);
    const locations = departmentData
      .find((d) => d.department === selectedDept)
      .locations.find((loc) => loc.locationType === selectedType).location;
    setLocations(locations);
  };
  // asset by class code

  const { data: assetClasses = [] } = useQuery({
    queryKey: ["assetClasses"],
    queryFn: () => getData(`/api/assetClass?role=${user.role}`),
    enabled: !!(searchType === "assetClass"),
  });

  const handleClassChange = async (assetClass) => {
    setTypes([]);
    const assetTypeData = await getData(
      `/api/getAssetType?assetClass=${assetClass}`
    );
    setTypes(assetTypeData.assetTypes);
  };

  const handleSearchForm = (e) => {
    e.preventDefault();
    setAssetInfo({});
    const form = e.target;
    if (searchType === "assetNumber") {
      const assetNumber = form.assetNumber.value;
      setAssetInfo({ searchType, assetNumber, role: user?.role });
    } else if (searchType === "assetLocation") {
      const isBookVal1 = form.isBookVal1.checked;
      const sortBy = form.sortBy.value;
      const department = form.department.value;
      const locationType = form.locationType.value || "";
      const location = form[locationType].value || "";
      setAssetInfo({
        searchType,
        department,
        locationType,
        location,
        isBookVal1,
        sortBy,
        role: user?.role,
      });
    } else if (searchType === "assetClass") {
      const isBookVal1 = form.isBookVal1.checked;
      const sortBy = form.sortBy.value;
      const assetClass = form.assetClass.value;
      const assetType = form.assetType.value || "";

      setAssetInfo({
        searchType,
        assetClass,
        assetType,
        isBookVal1,
        sortBy,
        role: user?.role,
      });
    }
  };

  const {
    data: assets,
    isLoading: assetLoading,
    refetch: assetRefetch,
  } = useQuery({
    queryKey: ["assets", assetInfo],
    queryFn: () => {
      const queryString = new URLSearchParams(assetInfo).toString();
      return getData(`/api/getAssets/?${queryString}`);
    },
    enabled: !!assetInfo.searchType,
  });

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
          setLocation("");
        },
      });
    }
  };
  const handleLocationInfo = (assetInfo) => {
    const { assetNumber, assetLocation } = assetInfo;
    const data = {
      ...assetLocation,
      assetNumbers: [assetNumber],
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
      },
    });
  };
  const handleDownloadAssets = (data) => {
    // 1) Convert your data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 2) Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // 3) Write workbook to binary array
    const wbout = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // 4) Create a Blob from that array
    const blob = new Blob([wbout], {
      type: "application/octet-stream",
    });

    // 5) Create a link and trigger a download
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "data.xlsx";
    document.body.appendChild(anchor);
    anchor.click();

    // 6) Cleanup
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto w-full flex flex-col  h-full  space-y-1 ">
      <div className="flex justify-between bg-gray-bright py-3 px-2">
        <form
          className="flex grow flex-wrap items-end gap-3 justify-start"
          onSubmit={handleSearchForm}
        >
          <label className="flex flex-col gap-2 items-center">
            <span className="font-bold text-primary">Search Assets By</span>
            <select
              defaultValue=""
              className="select select-xs select-warning"
              onChange={(e) => {
                setSearchType(e.target.value);
                setSelecteddept("");
              }}
            >
              <option value="">---Select---</option>
              <option value="assetNumber">Asset Number</option>
              <option value="assetLocation">Asset Location</option>
              <option value="assetClass">Asset Class</option>
            </select>
          </label>
          {searchType === "assetNumber" && (
            <label className="flex flex-col gap-2 ">
              <span className="font-bold text-primary">Asset Number</span>
              <input
                type="text"
                name="assetNumber"
                placeholder="Asset Number"
                className="input input-warning input-xs"
              />
            </label>
          )}
          {searchType === "assetLocation" && (
            <>
              <label className="flex flex-col gap-2 ">
                <span className=" font-bold text-primary ">Department</span>
                <select
                  name="department"
                  className="select select-xs  select-warning"
                  required
                  onChange={(e) => handleDeptChange(e.target.value)}
                  value={selectedDept}
                >
                  <option value="">---Select---</option>
                  {departments &&
                    departments?.map((dept) => (
                      <option key={dept} className="capitalize" value={dept}>
                        {dept.toUpperCase()}
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 ">
                <span className=" font-bold text-primary">Location Type</span>
                <select
                  name="locationType" // Dynamic name to ensure correct field submission
                  className="select select-warning select-xs"
                  onChange={(e) => handleLocTypeChange(e.target.value)}
                  value={selectedType}
                  required
                >
                  <option value="">---Select---</option>
                  {locationTypes?.map((type) => (
                    <option key={type} value={type} className="capitalize">
                      {type}
                    </option>
                  ))}
                </select>
              </label>
              {selectedType && (
                <label className="flex gap-2 flex-col ">
                  <span className="label-text font-bold text-primary">
                    Select {selectedType}
                  </span>
                  <select
                    name={selectedType} // Dynamic name to ensure correct field submission
                    className="select select-warning select-xs"
                  >
                    <option value="">---Select---</option>
                    {locations.map((opt) => (
                      <option key={opt} value={opt} className="capitalize">
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </>
          )}

          {searchType === "assetClass" && (
            <>
              <label className="flex flex-col  gap-2">
                <span className="font-bold text-primary">Asset Class </span>

                <select
                  name="assetClass"
                  defaultValue=""
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="select select-xs select-warning"
                  required
                >
                  <option value="all">---Select---</option>
                  {assetClasses?.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col  gap-2">
                <span className="font-bold text-primary">Asset Type </span>
                <select
                  name="assetType"
                  defaultValue=""
                  className="select select-xs select-warning"
                >
                  <option value="">---Select---</option>
                  {assettypes?.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}

          {(searchType === "assetLocation" || searchType === "assetClass") && (
            <>
              <label className="label items-end">
                <input
                  name="isBookVal1"
                  type="checkbox"
                  className="checkbox checkbox-warning checkbox-md"
                />
                <span>Book Value 1 only</span>
              </label>
              <label className="flex flex-col  gap-2">
                <span className="font-bold text-primary">Sort By</span>

                <select
                  name="sortBy"
                  defaultValue="assetNumber"
                  className="select select-xs select-warning"
                >
                  <option value="assetNumber">Asset Number(Default)</option>
                  <option value="assetClass">Asset Class</option>
                  <option value="assetType">Asset Type</option>
                  <option value="assetDescription">Asset Description</option>
                  <option value="capDate">Acquisition date</option>
                  <option value="acquisationVal">Acquisition Value</option>
                  <option value="department">Department</option>
                  <option value="locationType">Location Type</option>
                  <option value="location">Location</option>
                  <option value="assetUser">Asset User</option>
                </select>
              </label>
            </>
          )}
          <div className="flex gap-2 ">
            <button type="submit" className="btn btn-xs">
              Search
            </button>
          </div>
        </form>
        {user.role && rejectedassets?.length > 0 && (
          <div>
            <button className="btn btn-error btn-soft" onClick={handleDeleteRejectedAssets}>
              {rejectedassets?.length} rejected assets. click to remove this
            </button>
          </div>
        )}
      </div>

      {assetLoading ? (
        <div className="flex flex-col h-full justify-center items-center ">
          <div className="loading loading-dots  loading-xl grow text-warning "></div>
        </div>
      ) : (
        assets?.length > 0 && (
          <div className="overflow-auto">
            <table className="table table-xs table-zebra table-pin-rows">
              <thead className="">
                <tr className="bg-stone-100 border-b-0">
                  <th colSpan={12}>
                    <div className="flex items-start w-full ">
                      <DeptChangeForm
                        handleAction={handleAction}
                        departmentData={departmentData}
                        handleSelectAll={handleSelectAll}
                        selectedItems={selectedItems}
                        action={action}
                        setAction={setAction}
                      />

                      <button
                        onClick={() => handleDownloadAssets(assets)}
                        className="btn w-full max-w-fit  btn-xs btn-warning hover:link "
                      >
                        <span>Download Excel</span>
                        <FaDownload />
                      </button>
                    </div>
                  </th>
                </tr>
                <tr className=" text-primary bg-gray-bright">
                  <th className="py-4">SL</th>
                  <th className="py-4">Asset Number</th>
                  <th className="py-4">Asset Class</th>
                  <th className="py-4">Asset Type</th>
                  <th className="py-4">Asset Description</th>

                  <th className="py-4">Department</th>
                  <th className="py-4">Location Type</th>
                  <th className="py-4">Location</th>
                  <th className="py-4">Asset User</th>
                  <th className="py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {assets?.map((data, index) => (
                  <tr key={index}>
                    <td>
                      <label className="flex items-center gap-2">
                        {isEdit && (
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(data.assetNumber)}
                            onChange={(e) =>
                              handleSelectItem(
                                e.target.checked,
                                data.assetNumber
                              )
                            }
                            className="checkbox checkbox-warning print:hidden"
                          />
                        )}
                        <span>{index + 1}</span>
                      </label>
                    </td>
                    <td>{data.assetNumber}</td>
                    <td>{data.assetClass}</td>
                    <td>{data.assetType}</td>
                    <td>
                      <div className="tooltip tooltip-bottom">
                        <p>{data?.assetDescription}</p>
                        <div className="tooltip-content text-left">
                          <p>Cap.Date:{data?.capDate}</p>
                          <p>Acquis.Val:{data?.acquisationVal}</p>
                          <p>Book Val:{data?.bookVal}</p>
                        </div>
                      </div>
                    </td>

                    <AssetLocationInput
                      departmentData={departmentData}
                      rowData={data}
                      handleLocationInfo={handleLocationInfo}
                    />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export default ManageAssets;
