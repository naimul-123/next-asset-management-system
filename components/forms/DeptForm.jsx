import React, { useEffect, useState } from "react";
import Button from "../reusable/Button";
import { useQuery } from "@tanstack/react-query";
import { getData, postData } from "../../lib/api";
import Swal from "sweetalert2";
const DeptForm = ({ handleSubmit, btnText, isAdmin, isChangeLocation }) => {
  const [options, setOptions] = useState([]);
  const [locationType, setlocationType] = useState("");
  const [selectedDept, setSelecteddept] = useState("");
  const { data: departmentData = [], refetch: deptRefetch } = useQuery({
    queryKey: ["departments"],
    queryFn: () => getData("/api/getdeptdata"),
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

  const handleAddNewLocationType = async (e) => {
    e.preventDefault();
    const locationType = e.target.locationType.value.toLowerCase();
    if (!locationType) {
      alert("Input a location type");
      return;
    }
    const res = await postData("/api/locationType", { locationType });
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
      locationTypeRefetch();
      setlocationType("");
      setOptions([]);
      // here I want to run useEffect. how to possible?
    }

    e.target.reset();
  };
  const handleAddNewLocation = async (e) => {
    e.preventDefault();
    const locName = e.target.locname.value;
    if (!selectedDept || !locationType) {
      alert("select a department and location type first");
      return;
    }
    const data = {
      deptName: selectedDept,
      locationType: locationType,
      locName,
    };
    const res = await postData("/api/addLocation", data);
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
      setlocationType("");
      setOptions([]);
      // here I want to run useEffect. how to possible?
    }

    e.target.reset();
  };

  return (
    <form id="" onSubmit={handleSubmit} className="flex items-end gap-2">
      <label className="form-control gap-1 ">
        <div className="label">
          <span className="label-text font-bold text-primary ">Department</span>
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
      </label>
      <label className="form-control">
        <div className="label">
          <span className="label-text font-bold text-primary">
            Location Type
          </span>
        </div>
        <select
          name="locationType" // Dynamic name to ensure correct field submission
          className="select select-warning select-sm "
          required
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
      </label>
      {locationType && (
        <label className="form-control">
          <div className="label">
            <span className="label-text font-bold text-primary">
              Select {locationType}
            </span>
          </div>
          <select
            name={locationType} // Dynamic name to ensure correct field submission
            className="select select-warning select-sm "
            required
          >
            <option value="">---Select---</option>
            {options.map((opt) => (
              <option key={opt} value={opt} className="capitalize">
                {opt}
              </option>
            ))}
          </select>
        </label>
      )}
      <div className="flex justify-end text-center">
        <Button btnText={btnText} />
      </div>
    </form>
    /* {
                isAdmin &&
                <div className=''>

                    <div className="collapse static  collapse-plus">
                        <input type="radio" name="my-accordion-1" />
                        <summary className="collapse-title after:py-0   text-sm  font-bold">Add Location Type</summary>
                        <div className='collapse-content my-0'>
                            <form onSubmit={handleAddNewLocationType} className=''>
                                <div className='form-control'>
                                    <input name='locationType' type="text" placeholder="Location Type" className="input  input-sm" required />
                                    <Button btnText="Add" />
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="collapse static collapse-plus">
                        <input type="radio" name="my-accordion-1" />
                        <summary className="collapse-title text-sm text-primary   font-bold">Add Location</summary>

                        <form onSubmit={handleAddNewLocation} className='collapse-content'>
                            <div className='form-control'>
                                <input name='locname' type="text" placeholder="Location Name" className="input input-sm" required />
                                <Button btnText="Add" />
                            </div>
                        </form>
                    </div>
                </div>
            } */
  );
};

export default DeptForm;
