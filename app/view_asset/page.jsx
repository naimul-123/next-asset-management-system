"use client"
import AssetEntryForm from '../../components/forms/AssetEntryForm'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import DeptForm from '../../components/forms/DeptForm';
import DataTable from '../../components/DataTable';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getData, postData } from '../../lib/api';

const SectionAsset = () => {

  const [deptInfo, setDeptInfo] = useState({})
  const [deptAssets, setDeptAssets] = useState([])
  const [location, setLocation] = useState('')


  const handleDeptForm = async (e) => {
    e.preventDefault();
    const form = e.target;
    const department = form.department.value;
    const loctype = form.loctype.value;
    const selectedLocation = form[loctype]?.value || '';

    if (!department || !selectedLocation || !loctype) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Please select department and location first!.",
        showConfirmButton: false,
        timer: 1500
      });
      return
    }

    else {

      const deptInfo = {
        department,
        [loctype]: selectedLocation,
      }
      setLocation(loctype)

      setDeptInfo(deptInfo)

      const data = await getData(`/api/getassetsbytype/?department=${department}&loctype=${loctype}&location=${selectedLocation}`);
      if (data) {
        setDeptAssets(data)
      }
    }


  }

  console.log(deptAssets);
  return (

    <div className='mx-auto h-[calc(100vh-220px)] flex gap-2 '>
      <div className=' grow mx-auto flex flex-col'>
        {deptInfo[location] && <div className=' rounded-t-lg text-center py-4 border-2 my-2 shadow-lg  text-2xl font-bold'>
          <h2> Asset list of {`${deptInfo[location]} ${location} of ${deptInfo.department} department.`} </h2>

        </div>}
        <DataTable tableData={deptAssets} />
      </div>
      <div className='max-w-xs w-full   p-2 border shadow-md rounded-md'>
        <DeptForm handleSubmit={handleDeptForm} btnText="Search" />
      </div>

    </div>


  )
}



export default SectionAsset