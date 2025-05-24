import { useState } from "react";

const AssetLocationInput = ({ rowData, departmentData, handleLocationInfo }) => {
  const [isEdit, setIsEdit] = useState(true);
  const [selectedDept, setSelectedDept] = useState(() => rowData?.assetLocation?.department || rowData?.department || "");
  const [selectedType, setSelectedType] = useState(() => rowData?.assetLocation?.locationType || rowData?.locationType || "");
  const [location, setLocation] = useState(() => rowData?.assetLocation?.location || rowData?.location || "");
  const [assetUser, setAssetUser] = useState(() => rowData?.assetLocation?.assetUser || rowData?.assetUser || "");

  // Derived data
  const departments = departmentData?.map((dept) => dept.department) || [];

  const locationTypes = departmentData.find(d => d.department === selectedDept)?.locations.map(loc => loc.locationType) || [];

  const locations = departmentData
    .find(d => d.department === selectedDept)
    ?.locations.find(loc => loc.locationType === selectedType)?.location || [];

  const handleDeptChange = (value) => {
    setSelectedDept(value);
    setSelectedType("");
    setLocation("");
  };

  const handleLocTypeChange = (value) => {
    setSelectedType(value);
    setLocation("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLocationInfo(e);
    setIsEdit(false);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-5 justify-between gap-2"
      >
        <input type="hidden" name="assetNumber" value={rowData?.assetNumber} />

        {/* Department */}
        <select
          name="department"
          value={selectedDept}
          onChange={(e) => handleDeptChange(e.target.value)}
          disabled={!isEdit}
          className={`select select-xs ${selectedDept ? "select-success" : "select-ghost"}`}
          required
        >
          <option value="">---Select---</option>
          {departments.map((dept) => (
            <option key={dept} value={dept} className="capitalize">
              {dept.toUpperCase()}
            </option>
          ))}
        </select>

        {/* Location Type */}
        <select
          name="locationType"
          value={selectedType}
          onChange={(e) => handleLocTypeChange(e.target.value)}
          disabled={!isEdit}
          className={`select select-xs ${selectedType ? "select-success" : "select-ghost"}`}
          required
        >
          <option value="">---Select---</option>
          {locationTypes.map((type) => (
            <option key={type} value={type} className="capitalize">
              {type}
            </option>
          ))}
        </select>

        {/* Location */}
        <select
          name="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          disabled={!isEdit}
          className={`select select-xs ${location ? "select-success" : "select-ghost"}`}
          required
        >
          <option value="">---Select---</option>
          {locations.map((loc) => (
            <option key={loc} value={loc} className="capitalize">
              {loc}
            </option>
          ))}
        </select>

        {/* Asset User */}
        <input
          name="assetUser"
          value={assetUser}
          onBlur={(e) => setAssetUser(e.target.value)}
          disabled={!isEdit}
          required
          className={`input input-xs ${assetUser ? "input-success" : "input-ghost"}`}
        />

        {/* Submit / Edit Button */}
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
