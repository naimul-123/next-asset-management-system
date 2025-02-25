"use client"
import AssetEntryForm from '../../components/forms/AssetEntryForm'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import DeptForm from '../../components/forms/DeptForm';
import DataTable from '../../components/DataTable';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getData, postData } from '../../lib/api';
import { FaPrint } from 'react-icons/fa';

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

  // console.log(deptAssets);
  return (

    <div className='mx-auto flex h-full'>
      <div className=' grow mx-auto flex flex-col px-4'>
        {deptInfo[location] &&
          <div className='flex justify-between px-4 py-2 items-center'>
            <h2 className='text-center grow font-bold text-xl capitalize print:text-black '> Asset list of {`${deptInfo[location]} ${location} of ${deptInfo.department} department.`} </h2>
            <button className='btn  btn-square  print:hidden' onClick={() => window.print()}><FaPrint /></button>
          </div>}
        <DataTable tableData={deptAssets} />
      </div>

      <DeptForm handleSubmit={handleDeptForm} btnText="Search" />


    </div>


  )
}



export default SectionAsset