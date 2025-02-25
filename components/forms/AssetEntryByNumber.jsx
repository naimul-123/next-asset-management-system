"use client"

import { useState } from 'react'
import { getData } from '../../lib/api';
import { IoCloseCircleSharp } from "react-icons/io5";


const AssetEntryByNumber = ({ assetMutation, assetLocation, isOpenModal, setIsOpenModal }) => {

    const [assetInfo, setAssetInfo] = useState({})
    const [assetError, setAssetError] = useState('')
    const getAssetInfo = async (assetNo) => {
        setAssetInfo({});
        setAssetError('')
        if (assetNo?.length === 12) {
            const data = await getData(`/api/getAsset/?assetNo=${assetNo}`);
            if (data) {
                setAssetInfo(data);
            }
            else {
                setAssetError('No data found!')
            }
        }
    };


    function handleSubmitForm(e) {
        e.preventDefault();
        if (assetError) {
            alert('something wrong');
            return
        }
        const form = e.target;
        const assetNumber = form.assetNumber.value;

        const assetUser = form.assetUser.value;
        const assetData = {
            assetNumber, assetUser, ...assetLocation
        }
        if (assetData) {
            assetMutation.mutate(assetData)
        }




        // getFormData(assetData);
        form.reset()
        setAssetInfo({})

    }



    return (

        <div className={`${!isOpenModal ? "h-0 opacity-0" : "h-fit max-h-60 opacity-100"} transition-all duration-1000 ease-in-out  w-full rounded-lg  mx-auto relative`}>
            <button className="btn absolute right-0 z-20 -top-10   btn-circle btn-ghost text-red-500  text-4xl " onClick={() => setIsOpenModal(null)}><IoCloseCircleSharp /></button>
            <div className="flex flex-col bg-white-100 mx-auto">
                <div className="overflow-x-auto">
                    <table className="table table-xs">
                        {/* head */}
                        <thead>
                            <tr>
                                <th className='grid grid-cols-6 gap-2 bg-base-300'>
                                    <div className="label-text">Asset Numbar</div>
                                    <div className="label-text">Asset Class</div>
                                    <div className="label-text">Asset Type</div>
                                    <div className="label-text">Asset Description</div>
                                    <div className="label-text">Asset User</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* row 1 */}
                            <tr className=''>
                                <td>
                                    <form className="grid grid-cols-6 items-end gap-2 my-2 py-2  " onSubmit={handleSubmitForm}>
                                        <input type="text" name='assetNumber' placeholder="Asset Number" onBlur={(e) => getAssetInfo(e.target.value)} className="input text-sm input-sm grow bg-inherit input-bordered" required />
                                        <output name='assetClass' className="input input-sm text-sm  bg-inherit " >{assetInfo?.assetClass ? assetInfo?.assetClass : ''}</output>
                                        <output name='assetType' className="input bg-inherit input-sm  " >{assetInfo?.assetType}</output>
                                        <output name='assetDescription' className="input bg-inherit input-sm  " >{assetInfo?.assetDescription}</output>
                                        <input type="text" name='assetUser' placeholder="Asset user name or section" className="input input-bordered bg-inherit  input-sm " required />

                                        <button className='btn btn-success text-white btn-sm text-white hover:text-white'>Add</button>

                                        {

                                            <span className="text-red-500 col-span-full">{assetError}</span>

                                        }

                                    </form>
                                </td>
                            </tr>
                            {/* row 2 */}

                        </tbody>
                    </table>
                </div>


            </div>
        </div>



    )
}

export default AssetEntryByNumber