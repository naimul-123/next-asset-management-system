"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getData, postData } from "../../../lib/api";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { FaDownload } from "react-icons/fa";
const ManageAssets = () => {
  const [searchType, setSearchType] = useState("");
  const [options, setOptions] = useState([]);
  const [locationType, setlocationType] = useState("");
  const [selectedDept, setSelecteddept] = useState("");
  const [isEdit, setIsEdit] = useState(true);
  const [action, setAction] = useState("");
  const [selectedItems, setSelectedItmes] = useState([]);
  const queryClient = useQueryClient();
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [assetError, setAssetError] = useState("");
  const [assetInfo, setAssetInfo] = useState({});

  const { data: departmentData = [], refetch: deptRefetch } = useQuery({
    queryKey: ["departments"],
    queryFn: () => getData("/api/getdeptdata"),
    enabled: !!(searchType === "assetLocation" || action === "changeLocation"),
  });

  const { data: locationTypes = [], refetch: locationTypeRefetch } = useQuery({
    queryKey: ["locationTypes"],
    queryFn: () => getData("/api/locationType"),
  });

  const departments = departmentData?.map((dept) => dept.name);

  const handleDeptChange = (value) => {
    setSelecteddept(value);
    setlocationType("");
    setOptions([]);
  };
  useEffect(() => {
    if (!selectedDept || !locationType) {
      setOptions([]);
      return;
    }
    const options =
      (selectedDept &&
        locationType &&
        departmentData
          ?.find((d) => d.name === selectedDept)
          [locationType]?.sort((a, b) => a.localeCompare(b))) ||
      [];
    setOptions(options);
  }, [selectedDept, locationType]);

  // asset by class code

  const { data: assetClasses = [] } = useQuery({
    queryKey: ["assetClasses"],
    queryFn: () => getData("/api/assetClass"),
    enabled: !!(searchType === "assetClass"),
  });
  const Class = assetClasses
    ?.map((g) => g.assetClass)
    .sort((a, b) => a.localeCompare(b));
  const handleClassChange = async (assetClass) => {
    setTypes([]);
    setSelectedType(null);
    const assetTypeData = await getData(
      `/api/getAssetType?assetClass=${assetClass}`
    );
    setTypes(assetTypeData);
  };
  const handleAssetTypeChange = async (assetType) => {
    setSelectedType(assetType);
  };

  const handleSerchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSelecteddept("");
  };

  const handleSearchForm = (e) => {
    e.preventDefault();
    setAssetInfo({});
    const form = e.target;
    if (searchType === "assetNumber") {
      const assetNumber = form.assetNumber.value;
      setAssetInfo({ searchType, assetNumber });
    } else if (searchType === "assetLocation") {
      const isBookVal1 = form.isBookVal1.checked;
      const sortBy = form.sortBy.value;
      const department = form.department.value;
      const locationType = form.locationType.value;
      const location = form[locationType].value;
      setAssetInfo({
        searchType,
        department,
        locationType,
        location,
        isBookVal1,
        sortBy,
      });
    } else if (searchType === "assetClass") {
      const isBookVal1 = form.isBookVal1.checked;
      const sortBy = form.sortBy.value;
      const assetClass = form.assetClass.value;
      const assetType = form.assetType.value;

      setAssetInfo({ searchType, assetClass, assetType, isBookVal1, sortBy });
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
  const updateAssets = useMutation({
    mutationFn: (data) => postData("/api/updateAssets", data),
    queryKey: ["updateAssets"],
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
      updateAssets.mutate(data, {
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
          setlocationType("");
        },
      });
    }
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
    <div className="min-w-full mx-auto w-screen-2xl">
      <div>
        <form
          className="flex gap-2 items-center w-full grow mx-auto"
          onSubmit={handleSearchForm}
        >
          <div className="flex gap-2 items-center">
            <span className="fieldset-legend">Search Assets By</span>
            <select
              defaultValue=""
              className="select select-sm select-warning"
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="">---Select---</option>
              <option value="assetNumber">Asset Number</option>
              <option value="assetLocation">Asset Location</option>
              <option value="assetClass">Asset Class</option>
            </select>
          </div>
          {searchType === "assetNumber" && (
            <div className="flex gap-2 items-center">
              <span className="fieldset-legend">Asset Number</span>
              <input
                type="text"
                name="assetNumber"
                placeholder="Asset Number"
                className="input input-warning input-sm"
              />
            </div>
          )}
          {searchType === "assetLocation" && (
            <>
              <div className="flex gap-2 items-center">
                <span className=" text-primary ">Department</span>
              </div>
              <select
                name="department"
                className="select select-sm  select-warning"
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
              <div className="flex gap-2 items-center">
                <span className=" text-primary">Location Type</span>
                <select
                  name="locationType" // Dynamic name to ensure correct field submission
                  className="select select-warning select-sm"
                  onChange={(e) => setlocationType(e.target.value)}
                  value={locationType}
                >
                  <option value="">---Select---</option>
                  {locationTypes?.map((type) => (
                    <option key={type} value={type} className="capitalize">
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              {locationType && (
                <div className="flex gap-2 items-center">
                  <span className="label-text font-bold text-primary">
                    Select {locationType}
                  </span>
                  <select
                    name={locationType} // Dynamic name to ensure correct field submission
                    className="select select-warning select-sm"
                  >
                    <option value="">---Select---</option>
                    {options.map((opt) => (
                      <option key={opt} value={opt} className="capitalize">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          {searchType === "assetClass" && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-primary">Asset Class </span>

                <select
                  name="assetClass"
                  defaultValue=""
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="select select-sm select-warning"
                  required
                >
                  <option value="">---Select---</option>
                  {Class?.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-primary">Asset Type </span>
                <select
                  name="assetType"
                  defaultValue=""
                  className="select select-sm select-warning"
                  onChange={(e) => handleAssetTypeChange(e.target.value)}
                >
                  <option value="">---Select---</option>
                  {types.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {(searchType === "assetLocation" || searchType === "assetClass") && (
            <>
              <label className="flex items-center gap-2">
                <input
                  name="isBookVal1"
                  type="checkbox"
                  className="checkbox checkbox-warning checkbox-sm"
                />
                Book Value 1 only
              </label>
              <div className="flex items-center gap-2">
                <span className="text-primary">Sort By</span>

                <select
                  name="sortBy"
                  defaultValue="assetNumber"
                  className="select select-sm select-warning"
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
              </div>
            </>
          )}
          <div className="flex gap-2 items-center">
            <button type="submit" className="btn btn-sm">
              Search
            </button>
          </div>
        </form>
      </div>
      <div className="print:h-fit w-full   overflow-auto print:overflow-visible print:text-black">
        {assetLoading ? (
          <div className="flex flex-col h-full justify-center items-center">
            <div className="loading loading-dots  loading-xl grow"></div>
          </div>
        ) : (
          assets?.length > 0 && (
            <table className="table table-xs table-zebra">
              <thead className="sticky print:static">
                <tr className=" text-primary bg-gray-bright print:text-black print:bg-white sticky top-0 print:static">
                  <th className="py-4">SL</th>
                  <th className="py-4">Asset Number</th>
                  <th className="py-4">Asset Class</th>
                  <th className="py-4">Asset Type</th>
                  <th className="py-4">Asset Description</th>
                  <th className="py-4">Capitalized Date</th>
                  <th className="py-4">Acquisition Value</th>
                  <th className="py-4">Book Value</th>
                  <th className="py-4">Department</th>
                  <th className="py-4">Location Type</th>
                  <th className="py-4">Location</th>
                  <th className="py-4">Asset User</th>
                </tr>

                <tr className="print:hidden text-deepBlue">
                  <th colSpan={6} className="py-4">
                    <form
                      className="grid grid-cols-7 text-deepBlue gap-1 items-end"
                      onSubmit={handleAction}
                    >
                      <label className="form-control">
                        <div className="label">
                          <span className="label-text font-bold ">
                            Select All ({selectedItems.length})
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-warning"
                          onClick={(e) => handleSelectAll(e.target.checked)}
                        />
                      </label>

                      <label className="form-control">
                        <div className="label">
                          <span className="label-text font-bold ">
                            Select Action
                          </span>
                        </div>
                        <select
                          name="action"
                          defaultValue={action}
                          className="select select-warning select-xs"
                          onChange={(e) => setAction(e.target.value)}
                        >
                          <option value="">---Select---</option>
                          <option value="changeLocation">
                            Change Location
                          </option>
                          <option value="changeUser">Change User</option>
                        </select>
                      </label>

                      {action === "changeLocation" && (
                        <>
                          <label className="form-control">
                            <div className="label">
                              <span className="label-text font-bold ">
                                Department
                              </span>
                            </div>
                            <select
                              name="department"
                              className="select select-xs select-warning"
                              required
                              onChange={(e) => handleDeptChange(e.target.value)}
                              value={selectedDept}
                            >
                              <option value="">---Select---</option>
                              {departments?.map((dept) => (
                                <option
                                  key={dept}
                                  className="capitalize"
                                  value={dept}
                                >
                                  {dept.toUpperCase()}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="form-control">
                            <div className="label">
                              <span className="label-text font-bold ">
                                Location Type
                              </span>
                            </div>
                            <select
                              name="locationType"
                              className="select select-warning select-bordered select-xs"
                              required
                              onChange={(e) => setlocationType(e.target.value)}
                              value={locationType}
                            >
                              <option value="">---Select---</option>
                              {locationTypes?.map((type) => (
                                <option
                                  key={type}
                                  value={type}
                                  className="capitalize"
                                >
                                  {type}
                                </option>
                              ))}
                            </select>
                          </label>
                          {locationType && (
                            <label className="form-control">
                              <div className="label">
                                <span className="label-text font-bold ">
                                  Select {locationType}
                                </span>
                              </div>
                              <select
                                name="location"
                                className="select select-warning select-bordered select-xs"
                                required
                              >
                                <option value="">---Select---</option>
                                {options?.map((opt) => (
                                  <option
                                    key={opt}
                                    value={opt}
                                    className="capitalize"
                                  >
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            </label>
                          )}
                        </>
                      )}

                      {["changeUser", "changeLocation"].includes(action) && (
                        <label className="form-control">
                          <div className="label">
                            <span className="label-text font-bold ">
                              Asset User Name
                            </span>
                          </div>
                          <input
                            name="assetUser"
                            type="text"
                            className="input input-xs input-warning"
                          />
                        </label>
                      )}

                      <label className="flex items-center gap-2">
                        <button className="btn btn-xs btn-success text-white">
                          Submit
                        </button>
                      </label>
                    </form>
                  </th>
                  <th colSpan={3}></th>
                  <th colSpan={3} className="">
                    <button
                      onClick={() => handleDownloadAssets(assets)}
                      className="btn btn-sm w-full link  btn-warning flex items-center"
                    >
                      <FaDownload />
                      Download Excel
                    </button>
                  </th>
                </tr>
              </thead>

              <tbody>
                {assets?.length > 0 &&
                  assets.map((data, idx) => (
                    <tr key={idx}>
                      <td>
                        <label className="flex items-center gap-2">
                          {isEdit && (
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(data.assetNumber)}
                              onChange={(e) =>
                                handleSelectItem(
                                  e.target.checked,
                                  data?.assetNumber
                                )
                              }
                              className="checkbox checkbox-warning print:hidden"
                            />
                          )}
                          <span>{idx + 1}</span>
                        </label>
                      </td>
                      <td>{data.assetNumber}</td>
                      <td>{data.assetClass}</td>
                      <td>{data.assetType}</td>
                      <td>{data.assetDescription}</td>
                      <td>{data.capDate}</td>
                      <td>{data.acquisationVal}</td>
                      <td>{data.bookVal}</td>
                      <td>{data?.department}</td>
                      <td>{data?.locationType}</td>
                      <td>{data?.location}</td>
                      <td>{data?.assetUser}</td>
                    </tr>
                  ))}
              </tbody>

              <tfoot>
                <tr className="hidden print:table-row relative bottom-0">
                  <th colSpan={7} className="text-center py-2">
                    Copyright © {new Date().getFullYear()} - All rights reserved
                    by <br /> Dead Stock Section, Bangladesh Bank, Barishal.
                  </th>
                </tr>
              </tfoot>
            </table>
          )
        )}
      </div>
    </div>
  );
};

export default ManageAssets;
