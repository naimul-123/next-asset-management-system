"use client";

import { postData } from "../../../../lib/api";
import Button from "../../../../components/reusable/Button";
import { useState } from "react";

const AddUser = () => {
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

    if (userData.name && userData.sap && userData.role) {
      const res = await postData("/api/addUser", userData);
      if (res.data.message) {
        setuserMessage(res?.data?.message);
        form.reset();
      }
      if (res.data.error) {
        setUserError(res?.data?.error);
        form.reset();
      }
    }
  };
  return (
    <div className="flex flex-col max-w-screen-lg mx-auto  min-h-full justify-center">
      <form className="bg-[#f7f7f7] p-8 rounded-xl" onSubmit={handleAddUser}>
        {userMessage && (
          <p className="font-bold text-primary text-xs">{userMessage}</p>
        )}
        {userError && (
          <p className="font-bold text-red-500 text-xs">{userError}</p>
        )}
        <div className="form-control">
          <label className="label">
            <span className="label-text">User Name</span>
          </label>
          <input
            name="name"
            type="text"
            placeholder="Name"
            className="input input-sm input-bordered rounded-full"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">SAP ID</span>
          </label>
          <input
            name="sap"
            type="text"
            placeholder="SAP ID"
            className="input input-sm input-bordered rounded-full"
            required
          />
        </div>
        <div className="form-control w-full">
          <div className="label">
            <span className="label-text">Role</span>
          </div>
          <select
            name="role"
            className="select select-bordered select-sm rounded-full"
            required
          >
            <option value="">---Select---</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="visitor">Visitor</option>
          </select>
        </div>
        <div className="form-control">
          <Button btnText="Add" />
        </div>
      </form>
    </div>
  );
};

export default AddUser;
