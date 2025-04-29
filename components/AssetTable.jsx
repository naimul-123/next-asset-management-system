import React, { useEffect, useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";

const AssetTable = ({
  tableData,
  assetLoading,
  handleRemoveAsset,
  updateAssetsUser,
  updateAssets,
  isEdit,
}) => {
  const [selectedItems, setSelectedItmes] = useState([]);
  const [options, setOptions] = useState([]);
  const [loctype, setLoctype] = useState("");
  const [selectedDept, setSelecteddept] = useState("");
  const [action, setAction] = useState(null);

  const { data: departmentData = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: () => getData("/api/getdeptdata"),
  });
  const { data: loctypes = [] } = useQuery({
    queryKey: ["loctypes"],
    queryFn: () => getData("/api/loctype"),
  });

  const departments = departmentData?.map((dept) => dept.name);

  const handleDeptChange = (value) => {
    setSelecteddept(value);
    setLoctype("");
    setOptions([]);
  };
  useEffect(() => {
    if (!selectedDept || !loctype) {
      setOptions([]);
      return;
    }
    const options =
      (selectedDept &&
        loctype &&
        departmentData
          ?.find((d) => d.name === selectedDept)
          [loctype]?.sort((a, b) => a.localeCompare(b))) ||
      [];
    setOptions(options);
  }, [selectedDept, loctype]);

  const handleAction = (e) => {
    e.preventDefault();
    const form = e.target;

    const assetUser = form.assetUser.value;
    if (action === "changeUser") {
      const data = { assetUser, assetNumbers: selectedItems };
      updateAssetsUser.mutate(data, {
        onSuccess: () => {
          form.reset();
          setSelectedItmes([]);
          setSelecteddept("");
          setLoctype("");
        },
      });
    }

    if (action === "changeLocation") {
      const department = form.department.value;
      const loctype = form.loctype.value;
      const location = form.location.value;
      const data = {
        department,
        location,
        loctype,
        assetUser,
        assetNumbers: selectedItems,
      };
      updateAssets.mutate(data, {
        onSuccess: () => {
          form.reset();
          setSelectedItmes([]);
          setSelecteddept("");
          setLoctype("");
        },
      });
    }
  };

  const handleSelectAll = (isSelect) => {
    if (isSelect) {
      const selected = tableData?.assetDetails?.map((data) => data.assetNumber);
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
  if (assetLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <span className="loading loading-bars grow  loading-sm"></span>
      </div>
    );
  }
  return (
    <div className="print:h-fit w-full   overflow-auto print:overflow-visible print:text-black">
      {tableData?.assetDetails?.length > 0 ? (
        <>
          <table className="table table-xs table-zebra">
            <thead className="sticky print:static">
              <tr className=" text-primary bg-gray-bright print:text-black print:bg-white sticky top-0 print:static">
                <th className="py-4">SL</th>
                <th className="py-4">Asset Number</th>
                <th className="py-4">Asset Class</th>
                <th className="py-4">Asset Type</th>
                <th className="py-4">Asset Description</th>

                <th className="py-4">Asset User</th>
                {isEdit && <th className="py-4 print:hidden">Actions</th>}
              </tr>
              {isEdit && (
                <tr className="print:hidden text-deepBlue">
                  <th colSpan={7} className="py-4">
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
                              name="loctype"
                              className="select select-warning select-bordered select-xs"
                              required
                              onChange={(e) => setLoctype(e.target.value)}
                              value={loctype}
                            >
                              <option value="">---Select---</option>
                              {loctypes?.map((type) => (
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
                          {loctype && (
                            <label className="form-control">
                              <div className="label">
                                <span className="label-text font-bold ">
                                  Select {loctype}
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
                </tr>
              )}
            </thead>

            <tbody>
              {tableData?.assetDetails.length > 0 &&
                tableData.assetDetails.map((data, idx) => (
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

                    <td>{data?.assetUser}</td>
                    {isEdit && (
                      <td className="print:hidden">
                        <button
                          className="btn btn-ghost btn-square btn-xs"
                          onClick={() => handleRemoveAsset(data)}
                        >
                          <MdDeleteForever className="text-danger text-xl" />
                        </button>
                      </td>
                    )}
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
              {tableData?.assetSummary.length > 0 &&
                tableData.assetSummary.map((data) => (
                  <tr key={data.assetType}>
                    <td>{data.assetType}</td>
                    <td className="text-right">{data.totalAssets}</td>
                  </tr>
                ))}
              <tr>
                <td></td>
                <td className="text-right">
                  Total Assets: {tableData?.assetDetails.length}
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
        </>
      ) : (
        <h2 className="text-2xl font-bold text-red-500 p-4  text-center">
          Select department, location type, location, and click on the search
          button to view assets.
        </h2>
      )}
    </div>
  );
};

export default AssetTable;
