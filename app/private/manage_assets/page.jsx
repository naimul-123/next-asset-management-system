"use client";

import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import DeptForm from "../../../components/forms/DeptForm";
import DataTable from "../../../components/DataTable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteData, getData, postData } from "../../../lib/api";
import { FaPrint } from "react-icons/fa";
import AssetEntryByNumber from "../../../components/forms/AssetEntryByNumber";
import PickAssetFromDatabase from "../../../components/forms/PickAssetFromDatabase";
import { useAuth } from "../../../contexts/authContext";
const ManageAssets = () => {
  const [isOpenModal, setIsOpenModal] = useState(null);
  const [assetLocation, setassetLocation] = useState(null);
  const [searchType, setSearchType] = useState("");
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const handleDeptForm = async (e) => {
    setassetLocation(null);
    e.preventDefault();
    const form = e.target;
    const department = form.department.value;
    const loctype = form.loctype.value;
    const selectedLocation = form[loctype]?.value || "";
    if (!department || !selectedLocation || !loctype) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Please select department and location first!.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    } else {
      const assetLocation = {
        department,
        loctype,
        location: selectedLocation,
      };
      setassetLocation(assetLocation);
    }
  };
  const {
    data: assets,
    isLoading: assetLoading,
    refetch: assetRefetch,
  } = useQuery({
    queryKey: ["assets", assetLocation],
    queryFn: () => {
      if (searchType === "assetLocation") {
        return assetLocation
          ? getData(
              `/api/getassetsbytype/?department=${assetLocation.department}&loctype=${assetLocation.loctype}&location=${assetLocation.location}`
            )
          : Promise.resolve([]);
      } else if (searchType === "assetNumber") {
        return getData(`/api/getAsset/?assetNo=${assetNo}`);
      }
    },
    enabled: !!assetLocation,
  });

  console.log(searchType);

  const assetMutation = useMutation({
    mutationFn: async (data) => postData("/api/postAssets", data),
    onSuccess: async (result) => {
      if (result.data.success) {
        queryClient.invalidateQueries(["selectedType", "assetLocation"]);
        Swal.fire({
          position: "top-end",
          title: result.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: result.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
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

  const handlePrint = () => {
    window.print();
  };

  const handleRemoveAsset = (assetData) => {
    const assetInfo = {
      assetNumber: assetData?.assetNumber,
      assetUser: assetData?.assetUser,
      department: assetLocation?.department,
      loctype: assetLocation?.loctype,
      location: assetLocation?.location,
    };
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
        const res = await deleteData("/api/removeAssetLocation", assetInfo);
        if (res.result.deletedCount) {
          queryClient.invalidateQueries([
            "assets",
            "selectedType",
            "assetLocation",
          ]);
          Swal.fire({
            title: "Deleted!",
            icon: "success",
          });
        }
      }
    });
  };
  const updateAssets = useMutation({
    mutationFn: async (data) => postData("/api/updateAssets", data),
    queryKey: ["updateAssets"],
    onSuccess: async (result) => {
      console.log(result);
      if (result.data.success) {
        queryClient.invalidateQueries(["selectedType", "assetLocation"]);
        Swal.fire({
          position: "top-end",
          title: result.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: result.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
  });
  const updateAssetsUser = useMutation({
    mutationFn: async (data) => postData("/api/updateAssetsUser", data),
    queryKey: ["updateAssetsUser"],
    onSuccess: async (result) => {
      console.log(result);
      if (result.data.success) {
        queryClient.invalidateQueries([
          "assets",
          "selectedType",
          "assetLocation",
        ]);
        Swal.fire({
          position: "top-end",
          title: result.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: result.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
  });

  return (
    <div className="print:h-full overflow-auto h-full print:overflow-visible  flex w-full ">
      <div className="grow flex px-4 py-2 flex-col w-full">
        {assetLocation && (
          <div className=" space-y-2 print:hidden">
            <div className="flex gap-2 items-center">
              <button
                className="btn btn-sm btn-success text-white  hover:text-white"
                onClick={() =>
                  setIsOpenModal(isOpenModal === "number" ? null : "number")
                }
              >
                Add asset by Number
              </button>
              <button
                className="btn btn-sm btn-success text-white  hover:text-white"
                onClick={() =>
                  setIsOpenModal(isOpenModal === "database" ? null : "database")
                }
              >
                Pick Asset from Database
              </button>
            </div>
            <div>
              <AssetEntryByNumber
                isOpenModal={isOpenModal === "number"}
                setIsOpenModal={setIsOpenModal}
                assetMutation={assetMutation}
                assetLocation={assetLocation}
              />
              <PickAssetFromDatabase
                assetMutation={assetMutation}
                isOpenModal={isOpenModal === "database"}
                setIsOpenModal={setIsOpenModal}
                assetLocation={assetLocation}
              />
            </div>
          </div>
        )}
        {assets && (
          <div className="flex items-start py-2 border-b-2">
            <h2 className="text-center grow font-bold text-lg print:text-black capitalize ">
              {" "}
              Asset list of{" "}
              {`${assetLocation?.location} ${assetLocation?.loctype} of ${assetLocation?.department} department.`}{" "}
            </h2>
            <button className="btn  z-10 print:hidden" onClick={handlePrint}>
              <FaPrint />
            </button>
          </div>
        )}
        <DataTable
          tableData={assets}
          isEdit={user?.role === "admin" || user?.role === "moderator"}
          assetLoading={assetLoading}
          updateAssets={updateAssets}
          handleRemoveAsset={handleRemoveAsset}
          updateAssetsUser={updateAssetsUser}
        />
      </div>
      <div className="max-w-xs  w-full  grow min-h-full overflow-auto p-4 border-l print:hidden">
        <div>
          <label className="form-control gap-1 ">
            <div className="label">
              <span className="label-text font-bold text-primary ">
                Search Asset By
              </span>
            </div>
            <select
              className="select select-sm  select-warning"
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="">---Select---</option>
              <option value="assetNumber">Asset Number</option>
              <option value="assetLocation">Asset Location</option>
              <option value="assetClass">Asset Class</option>
            </select>
          </label>

          {searchType === "assetLocation" ? (
            <DeptForm
              handleSubmit={handleDeptForm}
              btnText="Search"
              isAdmin={user?.role === "admin"}
              isEditUser
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ManageAssets;
