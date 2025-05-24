import { useEffect, useState } from "react";

const AssetLocationInput = ({
  rowData,
  departmentData,
  handleLocationInfo,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [location, setLocation] = useState("");
  const [assetUser, setAssetUser] = useState("");
  const [locationTypes, setLocationTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const departments = departmentData.map((dept) => dept.department);

  // Update locationTypes when selectedDept changes
  useEffect(() => {
    if (selectedDept) {
      const deptData = departmentData.find(
        (dept) => dept.department === selectedDept
      );
      if (deptData) {
        const types = deptData.locations.map((l) => l.locationType);
        setLocationTypes(types);

        // Reset selectedType if it's not valid anymore
        if (!types.includes(selectedType)) {
          setSelectedType("");
        }
      } else {
        setLocationTypes([]);
        setSelectedType("");
      }
    } else {
      setLocationTypes([]);
      setSelectedType("");
    }
  }, [selectedDept]);

  // Update locations when selectedType or selectedDept changes
  useEffect(() => {
    if (selectedDept && selectedType) {
      const deptData = departmentData.find(
        (dept) => dept.department === selectedDept
      );
      if (deptData) {
        const typeData = deptData.locations.find(
          (l) => l.locationType === selectedType
        );
        if (typeData) {
          setLocations(typeData.location);

          // Reset location if it's not valid anymore
          if (!typeData.location.includes(location)) {
            setLocation("");
          }
        } else {
          setLocations([]);
          setLocation("");
        }
      }
    } else {
      setLocations([]);
      setLocation("");
    }
  }, [selectedType, selectedDept]);

  const handleDeptChange = (value) => {
    setSelectedDept(value);
    setLocation("");
  };

  const handleLocTypeChange = (value) => {
    setSelectedType(value);
    setLocation("");
  };

  const handleSubmit = () => {
    const assetLocation = {
      department: selectedDept,
      locationType: selectedType,
      location,
      assetUser,
    };
    const data = {
      assetNumber: rowData.assetNumber,
      assetLocation,
    };
    handleLocationInfo(data);
    setIsEdit(false);
  };

  const handleEdit = () => {
    const dept =
      rowData?.assetLocation?.department || rowData?.department || "";
    const type =
      rowData?.assetLocation?.locationType || rowData?.locationType || "";
    const loc = rowData?.assetLocation?.location || rowData?.location || "";
    const user = rowData?.assetLocation?.assetUser || rowData?.assetUser || "";

    setSelectedDept(dept);
    setSelectedType(type);
    setLocation(loc);
    setAssetUser(user);
    setIsEdit(true);
  };

  return (
    <>
      <td>
        {isEdit ? (
          <select
            name="department"
            onChange={(e) => handleDeptChange(e.target.value)}
            className={`select select-xs ${
              selectedDept ? "select-success" : "select-ghost"
            }`}
            value={selectedDept}
            required
          >
            <option value="">---Select---</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept.toUpperCase()}
              </option>
            ))}
          </select>
        ) : (
          <span>
            {rowData?.assetLocation?.department || rowData?.department}
          </span>
        )}
      </td>

      <td>
        {isEdit ? (
          <select
            name="locationType"
            onChange={(e) => handleLocTypeChange(e.target.value)}
            className={`select select-xs ${
              selectedType ? "select-success" : "select-ghost"
            }`}
            value={selectedType}
            required
          >
            <option value="">---Select---</option>
            {locationTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        ) : (
          <span>
            {rowData?.assetLocation?.locationType || rowData?.locationType}
          </span>
        )}
      </td>

      <td>
        {isEdit ? (
          <select
            name="location"
            onChange={(e) => setLocation(e.target.value)}
            className={`select select-xs ${
              location ? "select-success" : "select-ghost"
            }`}
            value={location}
            required
          >
            <option value="">---Select---</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        ) : (
          <span>{rowData?.assetLocation?.location || rowData?.location}</span>
        )}
      </td>

      <td>
        {isEdit ? (
          <input
            name="assetUser"
            onBlur={(e) => setAssetUser(e.target.value)}
            className={`input input-xs ${
              assetUser ? "input-success" : "input-ghost"
            }`}
            defaultValue={
              rowData?.assetLocation?.assetUser || rowData?.assetUser
            }
            required
          />
        ) : (
          <span>{rowData?.assetLocation?.assetUser || rowData?.assetUser}</span>
        )}
      </td>

      <td>
        {isEdit ? (
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-success btn-xs btn-outline w-full"
          >
            Update
          </button>
        ) : (
          <button
            type="button"
            onClick={handleEdit}
            className="btn btn-warning btn-xs btn-outline text-xs w-full"
          >
            Edit
          </button>
        )}
      </td>
    </>
  );
};

export default AssetLocationInput;
