'use client'
import { getData, postData } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import Swal from "sweetalert2";


const ManageRole = () => {
  // const [controls, setControls] = useState([]);

  const [rolename, setRoleName] = useState("");
  const [permissions, setPermissions] = useState([]);

  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: () => getData('/api/assetClass')
  })

  const controlMutation = useMutation({
    mutationFn: async (data) => postData('/api/addcontrol', data),
    onSuccess: async (result) => {
      if (result.data.success) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Role has been saved successfully.",
          showConfirmButton: false,
          timer: 1500
        });
        setPermissions([]);
        setRoleName('')
        controlRefetch();
      }
    },
    onError: (error) => {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: error.message,
        showConfirmButton: false,
        timer: 1500
      });
    }
  })




  const { data: controls = [], refetch: controlRefetch } = useQuery({
    queryKey: ['controls'],
    queryFn: () => getData('/api/getcontrols'),

  })



  const handleAddControl = () => {
    if (!rolename || !permissions.length) return;
    const newControl = { rolename, permissions };
    controlMutation.mutate(newControl)


  };

  const handlePermissionToggle = (perm) => {
    setPermissions((prev) =>
      prev.includes(perm)
        ? prev.filter((p) => p !== perm)
        : [...prev, perm]
    );
  };

  const handleDelete = (id) => {
    setControls((prev) => prev.filter((ctrl) => ctrl.id !== id));
  };
  return (

    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">User Access Control</h1>

      {/* Add New Control */}
      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <h2 className="text-lg font-semibold">Create New Control</h2>
        <input

          type="text"
          placeholder="Role Name"
          className="w-full border px-3 py-2 rounded"
          value={rolename}
          onChange={(e) => setRoleName(e.target.value)}
        />
        <label className="label">
          <span>Select controls</span>
        </label>

        <div className="flex flex-wrap gap-3">

          {classes?.map((cls) => (
            <label key={cls.assetClass} className="flex items-center gap-2">

              <input

                type="checkbox"
                checked={permissions.includes(cls.assetClass)}
                onChange={() => handlePermissionToggle(cls.assetClass)}
              />
              {cls.assetClass}
            </label>
          ))}
        </div>
        <button
          onClick={handleAddControl}
          className="bg-blue text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create
        </button>
      </div>

      {/* Manage Controls */}
      <div className="overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Permissions</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {controls?.map((ctrl) => (
              <tr key={ctrl.id} className="border-t">
                <td className="p-2 border">{ctrl.rolename}</td>
                <td className="p-2 border">
                  {ctrl?.permissions?.join(", ")}
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleDelete(ctrl.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!controls.length && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No controls added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

  );
};

export default ManageRole;
