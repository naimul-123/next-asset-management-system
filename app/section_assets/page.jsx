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

  const handleDeptForm = async (e) => {
    e.preventDefault();
    const form = e.target;
    const department = form.department.value;
    const section = form.section.value;
    if (!department || !section) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Please select department and section first!.",
        showConfirmButton: false,
        timer: 1500
      });
      return
    }

    else {
      setDeptInfo({ department, section })
      const data = await getData(`/api/sectionAsset/?department=${department}&section=${section}`)
      if (data) {
        setDeptAssets(data)
      }
    }


  }


  return (

    <div className='mx-auto h-[calc(100vh-220px)] flex gap-2 '>
      <div className=' grow mx-auto flex flex-col'>
        <div className='border-2 rounded-t-lg shadow-md p-4 text-xl font-bold'>
          <h2>Department: {deptInfo?.department}</h2>
          <h2>Section: {deptInfo?.section}</h2>
        </div>
        <DataTable tableData={deptAssets} />
      </div>
      <div className='max-w-60 w-full   p-2 border shadow-md rounded-md'>
        <DeptForm handleSubmit={handleDeptForm} btnText="Search" />
      </div>

    </div>


  )
}



export default SectionAsset