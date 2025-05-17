import { getData } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaCaretSquareDown, FaCaretSquareUp } from "react-icons/fa";

const AssetLocationInput = ({ rowData, assetTypes, handleLocationInfo }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [location, setLocation] = useState("");
    const [selectedType, setSelectedType] = useState('')
    const [locationTypes, setlocationTypes] = useState([]);
    const [locations, setLocations] = useState([])
    const [selectedDept, setSelecteddept] = useState("");
    const { data: departmentData = [], refetch: deptRefetch } = useQuery({
        queryKey: ["departments"],
        queryFn: () => getData("/api/getdeptdata"),
    });

    const departments = departmentData?.map((dept) => dept.department);
    console.log(departments);
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
        <div className="">


            <form onSubmit={handleLocationInfo} className="flex justify-between gap-2 ">
                <input type="hidden" name="assetNumber" value={rowData?.assetNumber} />

                <select
                    name="department"
                    className={`select select-xs ${rowData?.locationInfo?.department ? 'select-success' : 'select-error'}  `}
                    required
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
                    className={`select select-xs ${rowData?.locationInfo?.locationType ? 'select-success' : 'select-error'}  `}
                    onChange={(e) => handleLocTypeChange(e.target.value)}
                    value={rowData?.locationInfo?.locationType || selectedType}
                    required
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
                    defaultValue={rowData?.locationInfo?.location || ''}// Dynamic name to ensure correct field submission
                    className={`select select-xs ${rowData?.locationInfo?.department ? 'select-success' : 'select-error'}  `}
                    required
                >
                    <option value="">---Select---</option>
                    {locations.map((opt) => (
                        <option key={opt} value={opt} className="capitalize">
                            {opt}
                        </option>
                    ))}

                </select>

                <input name="assetUser" defaultValue={rowData?.locationInfo?.assetUser || ''} className={`input input-xs ${rowData?.locationInfo?.department ? 'input-success' : 'input-error'}  `} required />

                <button
                    type="submit"
                    className="btn btn-warning btn-xs"

                >
                    Update
                </button>


            </form>


        </div>
    );
};
export default AssetLocationInput