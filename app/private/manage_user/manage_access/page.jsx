"use client";

import { deleteData, getData, postData, updateData } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import Swal from "sweetalert2";

const ManageRole = () => {
  const { data: session, status } = useSession();
  const [rolename, setRoleName] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [editId, setEditId] = useState(null); // NEW: store editing ID
  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: () => getData(`/api/assetClass?role=${session?.user.role}`),
  });

  const controlMutation = useMutation({
    mutationFn: async (data) => postData("/api/addcontrol", data),
    onSuccess: async (result) => {
      console.log(result);
      if (result.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Role has been saved successfully.",
          showConfirmButton: false,
          timer: 1500,
        });
        setPermissions([]);
        setRoleName("");
        controlRefetch();
      }
    },
    onError: (error) => {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: error.message,
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedData) => updateData("/api/updatecontrol", updatedData),
    onSuccess: (result) => {
      console.log(result);
      if (result?.data?.success) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: result?.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        setRoleName("");
        setPermissions([]);
        setEditId(null);
        controlRefetch();
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: result?.data?.error,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: error?.data?.error,
      });
    },
  });

  const { data: controls = [], refetch: controlRefetch } = useQuery({
    queryKey: ["controls"],
    queryFn: () => getData("/api/getcontrols"),
  });

  const handleAddControl = () => {
    if (!rolename || !permissions.length) return;
    const controlData = { rolename, permissions };

    if (editId) {
      updateMutation.mutate({ ...controlData, _id: editId });
    } else {
      controlMutation.mutate(controlData);
    }
  };

  const handleEdit = (control) => {
    setEditId(control._id);
    setRoleName(control.rolename);
    setPermissions(control.permissions);
  };

  const handlePermissionToggle = (perm) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteData("/api/deletecontrol", { id }),
    onSuccess: (result) => {
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Deleted successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        controlRefetch();
      }
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Do you want to delete the control?",
      showDenyButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't delete`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  return (
    <div className="space-y-6 min-w-full max-h-full">
      {/* Add New Control */}
      <div className="bg-[#f7f7f7] p-4 rounded-xl space-y-4">
        <h2 className="text-3xl font-bold text-info">
          {" "}
          {editId ? "Edit control" : "Create New Control"}
        </h2>
        <input
          type="text"
          placeholder="Role Name"
          className="border px-3 py-2 rounded"
          value={rolename}
          onChange={(e) => setRoleName(e.target.value)}
        />
        <div className="border shadow rounded-xl px-4 py-3 space-y-3">
          <h2 className="font-bold font-work-sans text-2xl text-info">
            Select controls
          </h2>
          <div className="flex flex-wrap  gap-3">
            {classes?.map((cls) => (
              <label key={cls} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={permissions.includes(cls)}
                  onChange={() => handlePermissionToggle(cls)}
                />
                {cls}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-white">
          <button
            onClick={handleAddControl}
            className={` btn btn-soft btn-sm ${
              editId ? "btn-success" : "btn-info"
            }`}
          >
            {editId ? "Update" : "Create"}
          </button>

          {editId && (
            <button
              onClick={() => {
                setEditId(null);
                setRoleName("");
                setPermissions([]);
              }}
              className="btn btn-sm btn-soft btn-error"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Manage Controls */}
      <div className="bg-[#f7f7f7] p-4 rounded-xl space-y-4">
        <h2 className="text-3xl font-bold text-info">Existing Controls</h2>

        <table className="table table-sm table-pin-rows">
          <thead>
            <tr className="font-bold text-primary">
              <th className="">Role Name</th>
              <th className="">Permissions</th>
              <th className="">Actions</th>
            </tr>
          </thead>
          <tbody>
            {controls?.map((ctrl) => (
              <tr key={ctrl._id} className="">
                <td className="">{ctrl.rolename}</td>
                <td className="">{ctrl?.permissions?.join(", ")}</td>
                <td className="flex gap-3 w-full">
                  <button
                    onClick={() => handleDelete(ctrl._id)}
                    className=" btn  btn-sm btn-soft  btn-error"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEdit(ctrl)}
                    className="btn btn-sm  btn-info btn-soft"
                  >
                    Edit
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
