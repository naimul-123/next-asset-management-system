"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { deleteData, getData, postData, updateData } from "../../../lib/api";
import Swal from "sweetalert2";


const ManageLocation = () => {
  const [selectedDept, setSelecteddept] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const [formType, setFormType] = useState(""); // "type" or "location"
  const [selectedType, setSelectedType] = useState('')
  const [locationTypes, setlocationTypes] = useState([]);
  const [newLocation, setNewLocation] = useState("")




  const { data: departmentData = [], refetch: deptRefetch } = useQuery({
    queryKey: ["departments"],
    queryFn: () => getData("/api/getdeptdata"),
  });
  const { data: unusedlocinfo = [], refetch: unusedRefetch } = useQuery({
    queryKey: ["unused"],
    queryFn: () => getData("/api/getunusedlocations"),
  });


  const departments = departmentData?.map((dept) => dept.department);

  const handleDeptChange = (value) => {

    setlocationTypes([])
    setSelectedType('')
    setSelecteddept(value);
    const locationTypes = departmentData.find(d => d.department === value)?.locations?.map(loc => loc.locationType)
    setlocationTypes(locationTypes)
  };




  const handleAdd = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!selectedDept || !selectedType) {
      alert("select a department and location type first");
      return;
    }
    const formType = form.formType.value;
    let data = { department: selectedDept, formType }
    if (formType === "type") {
      data.locationType = selectedType
    }

    if (formType === "location") {
      data.locationType = selectedType,
        data.location = newLocation
    }



    const res = await postData("/api/managelocation", data);
    if (res.data.error) {
      Swal.fire({
        text: res.data.error,
        icon: "error",
      });
    }
    if (res.data.message) {
      Swal.fire({
        text: res.data.message,
        icon: "success",
      });
      deptRefetch();
      unusedRefetch();
      setSelecteddept('')
      setSelectedType("");
      setNewLocation('');
      // here I want to run useEffect. how to possible?
    }

    e.target.reset();
  };
  const handleDeleteLocations = async (data) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteData("/api/deleteunusedlocations", data);
        console.log(res);
        if (res.message) {
          Swal.fire("Deleted!", res.message, "success");
          unusedRefetch(); // Refresh unused location data
          deptRefetch(); // Optional: refresh department info
        } else if (res.data.error) {
          Swal.fire("Error!", res.data.error, "error");
        }
      } catch (error) {
        Swal.fire("Error!", "Something went wrong while deleting.", "error");
      }
    }
  };


  if (isLoading) {
    return (
      <div className="overflow-auto min-w-full border-2 grow rounded-b-lg">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }
  return (

    <div className="flex flex-col overflow-auto  min-w-full h-[calc(100vh-148px)] space-y-6">
      {/* Form */}
      <form
        onSubmit={handleAdd}
        className="w-full max-w-5xl mx-auto p-6 bg-white shadow rounded-md space-y-6"
      >
        <h2 className="text-2xl font-semibold border-b pb-2">Add Location / Type</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 items-end">
          {/* Department */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Select Department</legend>
            <select
              value={selectedDept}
              onChange={(e) => handleDeptChange(e.target.value)}
              required
              className="select select-info select-sm capitalize w-full"
            >
              <option value="">-- Select Department --</option>
              {departments?.map((dept) => (
                <option key={dept} className="capitalize" value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </fieldset>

          {/* Radio options */}
          <div>
            <label className="block font-medium mb-1">Add New</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  className="radio radio-info radio-sm"
                  name="formType"
                  value="type"
                  onChange={(e) => {
                    setFormType(e.target.value);
                    setSelectedType("");
                  }}
                />
                Location Type
              </label>
              <label className="flex items-center gap-1">
                <input
                  name="formType"
                  type="radio"
                  className="radio radio-info radio-sm"
                  value="location"
                  onChange={(e) => setFormType(e.target.value)}
                />
                Location
              </label>
            </div>
          </div>

          {/* Location Type Input */}
          {formType === "type" && (
            <fieldset className="fieldset">
              <legend className="fieldset-legend">New Location Type</legend>
              <input
                type="text"
                className="input input-sm input-info w-full"
                placeholder="e.g. warehouse"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                required
              />
            </fieldset>
          )}

          {/* Location Input */}
          {formType === "location" && (
            <>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Select Location Type</legend>
                <select
                  className="select select-info select-sm capitalize w-full"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  required
                >
                  <option value="">-- Select Location Type --</option>
                  {locationTypes?.map((type) => (
                    <option key={type} className="capitalize" value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">New Location</legend>
                <input
                  type="text"
                  className="input input-sm input-info w-full"
                  placeholder="e.g. room 101"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  required
                />
              </fieldset>
            </>
          )}

          {/* Submit button */}
          <div className="mt-4">
            <button
              type="submit"
              className="btn btn-info btn-sm w-full hover:btn-outline"
            >
              Submit
            </button>
          </div>
        </div>
      </form>

      {/* Unused Location Types */}
      {unusedlocinfo?.unusedLocationTypes?.length > 0 && (
        <div className="w-full max-w-5xl mx-auto p-6 bg-white shadow rounded-md">
          <h2 className="text-xl font-semibold mb-4">Unused Location Types</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra table-sm">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Location Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {unusedlocinfo.unusedLocationTypes.map((type, id) => (
                  <tr key={id}>
                    <td>{type.department}</td>
                    <td>{type.locationType}</td>
                    <td>
                      <button
                        className="btn btn-error btn-xs text-white"
                        onClick={() =>
                          handleDeleteLocations({
                            department: type.department,
                            locationType: type.locationType,
                          })
                        }
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Unused Locations */}
      {unusedlocinfo?.unusedLocations?.length > 0 && (
        <div className="w-full max-w-5xl mx-auto p-6 bg-white shadow rounded-md">
          <h2 className="text-xl font-semibold mb-4">Unused Locations</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra table-sm">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Location Type</th>
                  <th>Location</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {unusedlocinfo.unusedLocations.map((type, id) => (
                  <tr key={id}>
                    <td>{type.department}</td>
                    <td>{type.locationType}</td>
                    <td>{type.location}</td>
                    <td>
                      <button
                        className="btn btn-error btn-xs text-white"
                        onClick={() =>
                          handleDeleteLocations({
                            department: type.department,
                            locationType: type.locationType,
                            location: type.location,
                          })
                        }
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>



  );
};

export default ManageLocation;
