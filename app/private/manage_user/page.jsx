"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { deleteData, getData, postData, updateData } from "../../../lib/api";
import Swal from "sweetalert2";
import { CiSearch } from "react-icons/ci";
import Button from "@/components/reusable/Button";
const ManageUser = () => {
  const [userMessage, setuserMessage] = useState("");
  const [userError, setUserError] = useState("");

  const handleAddUser = async (e) => {
    e.preventDefault();
    setUserError("");
    setuserMessage("");
    const form = e.target;
    const userData = {
      name: form.name.value,
      sap: form.sap.value,
      role: form.role.value,
    };
    console.log(userData);

    if (userData.name && userData.sap && userData.role) {
      const res = await postData("/api/addUser", userData);
      if (res.data.message) {
        Swal.fire(res?.data?.message);
        form.reset();
        userRefetch();
      }
      if (res.data.error) {
        Swal.fire(res?.data?.error);
        form.reset();
      }
    }
  };
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

  const handleRoleChange = (data) => {
    Swal.fire({
      title: "Do you want to change role?",
      showDenyButton: true,
      confirmButtonText: "Change",
      denyButtonText: `Don't change`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const res = await updateData(`/api/updaterole`, data);
        if (res?.message) {
          userRefetch();
          Swal.fire({
            text: res.message,
            icon: "success",
          });
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };
  const handleResetPassword = (sap) => {
    Swal.fire({
      title: "Do you want to reset password?",
      showDenyButton: true,
      confirmButtonText: "Reset",
      denyButtonText: `Don't reset`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const res = await updateData(`/api/resetpassword`, { sap });
        if (res?.message) {
          userRefetch();
          Swal.fire({
            text: res.message,
            icon: "success",
          });
        }
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
  if (isLoading) {
    return (
      <div className="overflow-auto min-w-full border-2 grow rounded-b-lg">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }
  return (
    <div className="space-y-6 min-w-full">
      <form
        className="bg-[#f7f7f7] p-4 rounded-xl space-y-4"
        onSubmit={handleAddUser}
      >
        <div>
          <h2 className="font-bold text-3xl">Add New User</h2>
          {userMessage && (
            <p className="font-bold text-primary text-xs">{userMessage}</p>
          )}
          {userError && (
            <p className="font-bold text-red-500 text-xs">{userError}</p>
          )}
        </div>

        <div className="w-full flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="label-text">User Name</span>
            <input
              name="name"
              type="text"
              placeholder="Name"
              className="input input-sm input-bordered"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="label-text">SAP ID</span>
            <input
              name="sap"
              type="text"
              placeholder="SAP ID"
              className="input input-sm input-bordered"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="label-text">Role</span>

            <select
              name="role"
              className="select select-bordered select-sm uppercase"
              required
            >
              <option value="" className="uppercase">
                ---Select---
              </option>
              {roles?.map((ctrl) => (
                <option key={ctrl} value={ctrl} className="uppercase">
                  {ctrl}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Button btnText="Add" />
          </div>
        </div>
      </form>
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
          {usersData ? (
            usersData.map((user, idx) => (
              <tr key={user.sap}>
                <th>{idx + 1}</th>
                <td>{user.name}</td>
                <td>{user.sap}</td>
                <td>
                  <select
                    value={user.role}
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
                    {roles?.map((ctrl) => (
                      <option key={ctrl} value={ctrl} className="uppercase">
                        {ctrl}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <div className="flex flex-wrap gap-3">
                    <button
                      className="btn btn-xs btn-outline btn-secondary"
                      onClick={() => handleResetPassword(user.sap)}
                    >
                      Reset Password
                    </button>
                    <button
                      onClick={() => handleDeletUser(user.sap)}
                      className="btn btn-xs btn-error btn-outline text-white"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">
                <div className="overflow-auto min-w-full border-2 grow rounded-b-lg">
                  <span className="loading loading-spinner text-primary"></span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUser;
