'use client'
import { getData, postData } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import Swal from "sweetalert2";

const ManageRole = () => {


  const handleSubmitAddRole = async (e) => {
    e.preventDefault();
    const rolename = e.target.rolename.value;
    try {
      const res = await postData('/api/addrole', { rolename });
      // console.log(res);
      if (res.data.message) {

        Swal.fire(res.data.message);
        roleRefetch();
      }

      if (res.data.error) {
        Swal.fire(res.data.error);
      }

    } catch (error) {
      console.log(error);
      if (error.response && error.response.data?.error) {
        // console.log(error.response);
        Swal.fire(error.response.data.error);
      } else {
        Swal.fire("An unexpected error occurred.");
        console.error(error); // Optional: log for debugging
      }
    }
    finally {
      e.target.reset();
    }


  }

  const { data: roles = [], refetch: roleRefetch } = useQuery({
    queryKey: ['roles'],
    queryFn: () => getData('/api/getrole')
  })

  console.log(roles);

  return (
    <div>
      <div>
        <form className="border p-4 max-w-sm    gap-4 shadow-sm " onSubmit={handleSubmitAddRole}>
          <div className="max-w-sm flex items-center gap-4 shadow-sm ">
            <span>Add New Role</span>
            <input
              type="text"
              className="input input-sm input-bordered grow"
              placeholder="role name"
              name="rolename"
            />
            <button type="submit" className="btn btn-sm btn-secondary">
              Add
            </button>
          </div>
        </form>
        <div className="max-w-sm flex items-center gap-4 shadow-sm ">
          <span>Select A Role</span>
          <select defaultValue="" name="rolename" className="select select-ghost uppercase" onChange={(e) => console.log(e.target.value)}>
            <option value="">---Select---</option>
            {roles?.map((role) => <option key={role} value={role} className="uppercase">{role}</option>)}
          </select>
          <button type="submit" className="btn btn-sm btn-secondary">
            Add
          </button>
        </div>
        <form className="border p-4 gap-4 shadow-sm "></form>
      </div>
    </div >
  );
};

export default ManageRole;
