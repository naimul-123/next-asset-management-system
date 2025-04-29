import React from "react";

const ManageRole = () => {
  return (
    <div>
      <div>
        <form className="border p-4 max-w-sm    gap-4 shadow-sm ">
          <div className="max-w-sm flex items-center gap-4 shadow-sm ">
            <span>Add New Role</span>
            <input
              type="text"
              className="input input-sm input-bordered grow"
              placeholder="role name"
            />
            <button type="submit" className="btn btn-sm btn-secondary">
              Add
            </button>
          </div>
        </form>
        <div className="max-w-sm flex items-center gap-4 shadow-sm ">
          <span>Select A Role</span>
          <select defaultValue="" className="select select-ghost">
            <option value="">---Select---</option>
            <option value="deadstock">Dead Stock</option>
            <option value="bps">BPS</option>
            <option value="ict">ICT</option>
          </select>
          <button type="submit" className="btn btn-sm btn-secondary">
            Add
          </button>
        </div>
        <form className="border p-4 gap-4 shadow-sm "></form>
      </div>
    </div>
  );
};

export default ManageRole;
