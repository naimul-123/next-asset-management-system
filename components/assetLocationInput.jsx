import { getData } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { FaCaretSquareDown, FaCaretSquareUp } from "react-icons/fa";
const AssetLocationInput = ({
  rowData,
  departmentData,
  handleLocationInfo,
}) => {
  const [isEdit, setIsEdit] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [location, setLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [locationTypes, setlocationTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedDept, setSelecteddept] = useState("");

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

  const handleAction = (e) => {
    e.preventDefault();
    handleLocationInfo(e);
    setIsEdit(false);
  };

  return (
    <div className="">
      <form
        onSubmit={handleAction}
        className="grid grid-cols-5 justify-between gap-2 "
      >
        <input
          type="hidden"
          disabled
          name="assetNumber"
          value={rowData?.assetNumber}
        />

        <select
          name="department"
          className={`select  select-xs ${
            rowData?.locationInfo?.department
              ? "select-success"
              : "select-ghost"
          }  `}
          required
          disabled={!isEdit}
          onChange={(e) => handleDeptChange(e.target.value)}
          value={rowData?.locationInfo?.department || selectedDept}
        >
          <option value="">---Select---</option>
          {departments &&
            departments?.map((dept) => (
              <option key={dept} className="capitalize" value={dept}>
                {dept.toUpperCase()}
              </option>
            ))}
        </select>

        <select
          name="locationType" // Dynamic name to ensure correct field submission
          className={`select select-neutral select-xs ${
            rowData?.locationInfo?.locationType
              ? "select-success"
              : "select-ghost"
          }  `}
          onChange={(e) => handleLocTypeChange(e.target.value)}
          value={rowData?.locationInfo?.locationType || selectedType}
          required
          disabled={!isEdit}
        >
          <option value="">---Select---</option>
          {locationTypes?.map((type) => (
            <option key={type} value={type} className="capitalize">
              {type}
            </option>
          ))}
        </select>

        <select
          name="location"
          defaultValue={rowData?.locationInfo?.location || ""} // Dynamic name to ensure correct field submission
          className={`select select-xs ${
            rowData?.locationInfo?.department
              ? "select-success"
              : "select-ghost"
          }  `}
          required
          disabled={!isEdit}
        >
          <option value="">---Select---</option>
          {locations.map((opt) => (
            <option key={opt} value={opt} className="capitalize">
              {opt}
            </option>
          ))}
        </select>

        <input
          name="assetUser"
          defaultValue={rowData?.locationInfo?.assetUser || ""}
          className={`input input-xs ${
            rowData?.locationInfo?.department ? "input-success" : "input-ghost"
          }  `}
          required
          disabled={!isEdit}
        />
        {isEdit ? (
          <button
            type="submit"
            className="btn btn-success btn-xs btn-soft btn-outline"
          >
            Update
          </button>
        ) : (
          <span
            className="btn btn-warning btn-xs btn-soft btn-outline"
            onClick={() => setIsEdit(true)}
          >
            Edit
          </span>
        )}
      </form>
    </div>
  );
};
export default AssetLocationInput;
