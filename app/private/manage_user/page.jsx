"use client";
import { useQuery } from "@tanstack/react-query";
import UserTable from "../../../components/UserTable";
import React from "react";
import { deleteData, getData } from "../../../lib/api";
import Swal from "sweetalert2";
import { CiSearch } from "react-icons/ci";
const ManageUser = () => {
  const {
    data: usersData = [],
    isLoading,
    refetch: userRefetch,
  } = useQuery({
    queryKey: ["userinfo"],
    queryFn: () => getData("/api/getUserData"),
  });
  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: () => getData("/api/getroles"),
  });
  const handleDelete = (sap) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await deleteData(`/api/deleteUser?sap=${sap}`);
        if (res?.message) {
          userRefetch();
          Swal.fire({
            title: "Deleted!",
            text: res.message,
            icon: "success",
          });
        }
      }
    });
  };
  console.log(roles);

  if (isLoading) {
    return (
      <div className="overflow-auto min-w-full border-2 grow rounded-b-lg">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  const handleRoleChange = (data) => {
    Swal.fire({
      title: "Do you want to change role?",
      showDenyButton: true,
      confirmButtonText: "Change",
      denyButtonText: `Don't change`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        console.log(data);
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };
  const handleDeletUser = (sap) => {
    Swal.fire({
      title: "Do you want to delete this user?",
      showDenyButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't delete`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const res = await deleteData(`/api/deleteUser?sap=${sap}`);
        if (res?.message) {
          userRefetch();
          Swal.fire({
            title: "Deleted!",
            text: res.message,
            icon: "success",
          });
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  return (
    <div className="">
      <table className="table table-md table-zebra ">
        <thead>
          <tr className="text-center">
            <th>SL</th>
            <td>Name</td>
            <td>SAP</td>
            <td>Change Access Area</td>
            <td colSpan={2} className="text-center">
              Actions
            </td>
          </tr>
        </thead>
        <tbody>
          {usersData?.map((user, idx) => (
            <tr key={user.sap}>
              <th>{idx + 1}</th>
              <td>{user.name}</td>
              <td>{user.sap}</td>
              <td>
                <select
                  defaultValue={user.role}
                  className="select select-xs uppercase"
                  onChange={(e) => {
                    const role = e.target.value;
                    const sap = user.sap;
                    const data = { role, sap };
                    return handleRoleChange(data);
                  }}
                >
                  <option key="" value="" className="uppercase">
                    ---Select---
                  </option>
                  <option key="admin" value="admin" className="uppercase">
                    Admin
                  </option>
                  {roles?.map((ctrl, index) => (
                    <option key={ctrl} value={ctrl} className="uppercase">
                      {ctrl}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <div className="flex flex-wrap gap-3">
                  <button className="btn btn-xs btn-warning ">
                    Reset Password
                  </button>
                  <button
                    onClick={() => handleDeletUser(user.sap)}
                    className="btn btn-xs btn-error text-white"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUser;
