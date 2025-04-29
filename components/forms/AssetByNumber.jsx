"use client";

import { useState } from "react";
import { getData } from "../../lib/api";

const AssetByNumber = ({ assetMutation, assetLocation, setAssetNumber }) => {
  const [assetInfo, setAssetInfo] = useState({});
  const [assetError, setAssetError] = useState("");
  const getAssetInfo = async (assetNo) => {
    setAssetInfo({});
    setAssetError("");
    if (assetNo?.length === 12) {
      const data = await getData(`/api/getAsset/?assetNo=${assetNo}`);
      if (data) {
        setAssetInfo(data);
      } else {
        setAssetError("No data found!");
      }
    }
  };

  function handleSubmitForm(e) {
    e.preventDefault();
    const form = e.target;
    const assetNumber = form.assetNumber.value;

    setAssetNumber(assetNumber);
    form.reset();
  }

  // getFormData(assetData);

  return (
    <form className="flex items-end gap-2" onSubmit={handleSubmitForm}>
      <label className="form-control flex-row items-end">
        <input
          type="text"
          name="assetNumber"
          placeholder="Asset Number"
          className="input text-sm input-sm grow bg-inherit input-bordered"
          required
        />
      </label>

      <label className="flex items-center gap-2">
        <button className="btn btn-sm btn-success text-white">Submit</button>
      </label>
    </form>
  );
};

export default AssetByNumber;
