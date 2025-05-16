import React, { useState } from 'react'
import { FaDownload } from 'react-icons/fa';

const DeptChangeForm = ({ handleAction, departmentData, selectedItems, action, handleSelectAll, setAction }) => {
    const [selectedType, setSelectedType] = useState('')
    const [locationTypes, setlocationTypes] = useState([]);
    const [locations, setLocations] = useState([])
    const [selectedDept, setSelecteddept] = useState("");
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
    //
    return (
        <form
            className="flex flex-1 gap-2 flex-wrap "
            onSubmit={handleAction}
        >
            <div className="flex items-center gap-2 ">
                <input
                    type="checkbox"
                    className="checkbox checkbox-warning"
                    onClick={(e) => handleSelectAll(e.target.checked)}
                />
                <span className="label-text font-bold ">
                    Select All ({selectedItems.length})
                </span>
            </div>

            <div className="flex items-center gap-2">

                <span className="label-text font-bold ">
                    Select Action
                </span>

                <select
                    name="action"
                    defaultValue={action}
                    className="select select-warning select-xs"
                    onChange={(e) => setAction(e.target.value)}
                    disabled={selectedItems.length <= 0}
                >
                    <option value="">---Select---</option>
                    <option value="changeLocation">
                        Change Location
                    </option>
                    <option value="changeUser">Change User</option>
                </select>
            </div>

            {action === "changeLocation" && (
                <>
                    <div className="flex items-center gap-2">

                        <span className="label-text font-bold ">
                            Department
                        </span>

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
                                    {dept}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2 ">

                        <span className="label-text font-bold ">
                            Location Type
                        </span>

                        <select
                            name="locationType"
                            className="select select-warning select-bordered select-xs"
                            required
                            onChange={(e) => handleLocTypeChange(e.target.value)}
                            value={selectedType}
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
                    </div>
                    {selectedType && (
                        <div className="flex items-center gap-2">

                            <span className="label-text font-bold ">
                                Select {selectedType}
                            </span>

                            <select
                                name="location"
                                className="select select-warning select-bordered select-xs"
                                required
                            >
                                <option value="">---Select---</option>
                                {locations?.map((opt) => (
                                    <option
                                        key={opt}
                                        value={opt}
                                        className="capitalize"
                                    >
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </>
            )}

            {["changeUser", "changeLocation"].includes(action) && (
                <div className="flex items-center gap-2">

                    <span className="label-text font-bold ">
                        Asset User Name
                    </span>

                    <input
                        name="assetUser"
                        type="text"
                        className="input input-xs input-warning"
                    />
                </div>
            )}

            <div className="flex items-center gap-2">
                <button type="submit" className="btn btn-xs w-full btn-success text-white" disabled={selectedItems.length <= 0}>
                    Submit
                </button>
            </div>

        </form>
    )
}

export default DeptChangeForm