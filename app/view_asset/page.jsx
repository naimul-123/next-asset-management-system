"use client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { getData, postData } from "../../lib/api";
import { FaPrint } from "react-icons/fa";

const AssetsByDepartment = () => {
  const [assetInfo, setAssetInfo] = useState({});
  const [location, setLocation] = useState("");
  const [selectedType, setSelectedType] = useState('')
  const [locationTypes, setlocationTypes] = useState([]);
  const [locations, setLocations] = useState([])
  const [selectedDept, setSelecteddept] = useState("");

  const handleDeptForm = async (e) => {
    e.preventDefault();
    const form = e.target;
    const department = form.department.value;
    const locationType = form.locationType.value;
    const location = form.location.value;
    const sortBy = form.sortBy.value;

    if (!department || !location || !locationType) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Please select department and location first!.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    } else {
      const assetInfo = {
        department,
        locationType,
        location,
        sortBy,
      };
      setLocation(locationType);

      setAssetInfo(assetInfo);
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
      return getData(`/api/getassetsbydepartment/?${queryString}`);
    },
    enabled: !!(
      assetInfo.department &&
      assetInfo.locationType &&
      assetInfo.location
    ),
  });

  const { data: departmentData = [], refetch: deptRefetch } = useQuery({
    queryKey: ["departments"],
    queryFn: () => getData("/api/getdeptdata"),
  });

  const departments = departmentData?.map((dept) => dept.department);

  const handleDeptChange = (value) => {
    setLocations([])
    setlocationTypes([])
    setSelectedType('')
    setSelecteddept(value);
    const locationTypes = departmentData.find(d => d.department === value).locations.map(loc => loc.locationType)
    setlocationTypes(locationTypes)
  };

  const handleLocTypeChange = (selectedType) => {
    setSelectedType(selectedType);
    const locations = departmentData.find(d => d.department === selectedDept).locations.find(loc => loc.locationType === selectedType).location
    setLocations(locations);
  }



  return (
    <div className="mx-auto w-full flex flex-col  h-full px-4 py-2 space-y-2 bg-white">
      <form
        id=""
        onSubmit={handleDeptForm}
        className="flex print:hidden items-end gap-2"
      >
        <div className="flex items-center gap-2">
          <span className="label-text font-bold text-primary ">Department</span>
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
        </div>

        <div className="flex items-center gap-2">
          <span className="label-text font-bold text-primary">
            Location Type
          </span>

          <select
            name="locationType" // Dynamic name to ensure correct field submission
            className="select select-warning select-sm "
            required
            onChange={(e) => handleLocTypeChange(e.target.value)}
            value={selectedType}
          >
            <option value="">---Select---</option>
            {locationTypes?.map((type) => (
              <option key={type} value={type} className="capitalize">
                {type}
              </option>
            ))}
          </select>
        </div>
        {selectedType && (
          <div className="flex items-center gap-2">
            <span className="label-text font-bold text-primary">
              Select {selectedType}
            </span>

            <select
              name="location" // Dynamic name to ensure correct field submission
              className="select select-warning select-sm "
              required
            >
              <option value="">---Select---</option>
              {locations.map((location) => (
                <option key={location} value={location} className="capitalize">
                  {location}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-primary">Sort By</span>

          <select
            name="sortBy"
            defaultValue="assetUser"
            className="select select-sm select-warning"
          >
            <option value="assetUser">Asset User(Default)</option>
            <option value="assetNumber">Asset Number</option>
            <option value="assetClass">Asset Class</option>
            <option value="assetType">Asset Type</option>
          </select>
        </div>
        <div className="flex justify-end text-center">
          <button type="submit" className="btn btn-sm">
            Search
          </button>
        </div>
      </form>
      <div className="mx-auto flex  w-full flex-1 overflow-auto">
        {assetLoading ? (
          <div className="flex flex-col h-full justify-center flex-1 items-center">
            <div className="loading loading-dots text-warning loading-xl grow"></div>
          </div>
        ) : assets ? (
          <div className="print:h-fit w-full  overflow-auto  flex-1 print:text-black">
            <div className="flex justify-between px-4 py-2 items-center">
              <h2 className="text-center grow font-bold text-xl capitalize text-black">
                {`Asset list of ${assetInfo.location} ${location} of ${assetInfo.department} department.`}
              </h2>
              <button
                className="btn  btn-square  print:hidden"
                onClick={() => window.print()}
              >
                <FaPrint />
              </button>
            </div>
            <table className="table table-xs table-zebra">
              <thead className="sticky print:static">
                <tr className=" text-primary bg-gray-bright print:text-black print:bg-white sticky top-0 print:static">
                  <th className="py-4">SL</th>
                  <th className="py-4">Asset Number</th>
                  <th className="py-4">Asset Class</th>
                  <th className="py-4">Asset Type</th>
                  <th className="py-4">Asset Description</th>

                  <th className="py-4">Asset User</th>
                </tr>
              </thead>

              <tbody>
                {assets?.assetDetails.length > 0 &&
                  assets.assetDetails.map((data, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{data.assetNumber}</td>
                      <td>{data.assetClass}</td>
                      <td>{data.assetType}</td>
                      <td>{data.assetDescription}</td>
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
            {/* in print here I want to make a page brake */}
            <table className="table table-xs max-w-xs mx-auto print:break-before-page">
              <thead>
                <tr>
                  <th
                    colSpan={2}
                    className="text-center font-bold text-xl text-black"
                  >
                    Asset Summary
                  </th>
                </tr>
                <tr>
                  <th>Asset Name</th>
                  <th className="text-right">Total Assets</th>
                </tr>
              </thead>
              <tbody>
                {assets?.assetSummary.length > 0 &&
                  assets.assetSummary.map((data) => (
                    <tr key={data.assetType}>
                      <td>{data.assetType}</td>
                      <td className="text-right">{data.totalAssets}</td>
                    </tr>
                  ))}
                <tr>
                  <td></td>
                  <td className="text-right">
                    Total Assets: {assets?.assetDetails.length}
                  </td>
                </tr>
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
          </div>
        ) : (
          <div className="">
            <h2 className="text-2xl font-bold text-red-500 p-4  text-center">
              Select department, location type, location, and click on the
              search button to view assets.
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetsByDepartment;
