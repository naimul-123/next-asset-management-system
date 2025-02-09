"use client"

import { useEffect, useState } from 'react'
import { getData } from '../../lib/api';
import Button from '../reusable/Button';
import { useQuery } from '@tanstack/react-query';
import { FaPlus } from 'react-icons/fa';

const AssetEntryForm = ({ getFormData }) => {
    const [hasNoassetNumber, sethasNoassetNumber] = useState(false)
    const [remainingAssets, setRemainingAssets] = useState([])
    const [assetType, setAssetType] = useState([]);
    const [assetInfo, setAssetInfo] = useState({})
    const [assetError, setAssetError] = useState('')

    useEffect(() => {
        setRemainingAssets([])
    }, [assetType])

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

    const { data: assetClasses = [] } = useQuery({
        queryKey: ['assetClasses'],
        queryFn: () => getData('/api/assetClass')
    })


    const Class = assetClasses?.map((g) => g.assetClass).sort((a, b) => a.localeCompare(b))

    const handleHasNoassetNumber = (e) => {
        sethasNoassetNumber(e.target.checked)
        document.getElementById('entryForm').reset()
        setAssetInfo({})
        setAssetError('')
    }






    const handleClassChange = async (assetClass) => {
        setAssetType([])
        const assetTypeData = await getData(`/api/getAssetType?assetClass=${assetClass}`)
        setAssetType(assetTypeData)
    }


    function handleSubmitForm(e) {
        e.preventDefault();
        if (assetError) {
            alert('something wrong');
            return
        }
        const form = e.target;
        const assetNumber = form.assetNumber.value;
        const assetClass = form.assetClass.value;
        const assetType = form.assetType.value;
        const assetDescription = form.assetDescription.value;
        const assetUser = form.assetUser.value;

        const assetData = {
            assetNumber, assetClass, assetType, assetDescription, assetUser
        }

        getFormData(assetData);
        form.reset()
        setAssetInfo({})

    }

    const handleAssetTypeChange = async (assetType) => {
        setRemainingAssets([]);
        const remainingAssets = await getData(`/api/assetInfo?assetType=${assetType}`)
        setRemainingAssets(remainingAssets)
    }



    hasNoassetNumber && document.getElementById('my_modal_4').showModal()

    return (
        <div className='border-2 rounded-t-lg shadow-md  text-sm'>
            <div className='flex p-4 items-center '>
                <label className='label coursor-pointer'>
                    <span className="text-primary font-bold text-2xl" >Has no asset number?</span>
                    <input type="checkbox" name='hasNoassetNumber' className="toggle toggle-warning toggle-lg" onChange={(e) => handleHasNoassetNumber(e)} checked={hasNoassetNumber} />
                </label>
            </div>
            <dialog id="my_modal_4" className="modal">
                <div className="modal-box w-11/12 flex flex-col  z-[99]   max-w-5xl h-full">
                    <div className='flex'>
                        <h2 className='text-center grow text-2xl font-bold'>Pick Asset from database</h2>
                        <form method="dialog" className='flex justify-end' >
                            <button className="btn " onClick={() => sethasNoassetNumber(false)}>Close</button>
                        </form>
                    </div>

                    <form className='grid grid-cols-4 gap-2 my-2'>


                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Asset Class</span>
                            </div>
                            <select name='assetClass' defaultValue="" onChange={(e) => handleClassChange(e.target.value)} className="select select-sm bg-inherit  select-bordered" required>
                                <option value="" >---Select---</option>
                                {Class.map((g) => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </label>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Asset Type</span>
                            </div>
                            <select name='assetType' defaultValue="" className="select select-sm select-bordered bg-inherit" required onChange={(e) => handleAssetTypeChange(e.target.value)} >
                                <option value="">---Select---</option>
                                {assetType.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </label>

                    </form>
                    <div className="overflow-auto min-w-full border-2 grow rounded-b-lg">

                        <table className="table static table-md ">
                            <thead className=' '>
                                <tr className='text-primary bg-secondary sticky top-0  gird grid-cols-3 font-extrabold shadow-md '>
                                    <th>SL</th>
                                    <th className='text-center'>Asset info</th>
                                    <th className='flex justify-between max-w-xs'><span>Asset User</span> <span>Total Assets= {remainingAssets.length}</span>  </th>
                                </tr>
                            </thead>
                            <tbody>
                                {remainingAssets?.map((data, idx) => <tr key={idx} className={`even:bg-[#fdf7f4]  hover:bg-secondary`}>
                                    <th>{idx + 1}</th>
                                    <td >
                                        <div className="grid grid-cols-3  gap-3">
                                            <div>
                                                <div className="font-bold">Number: {data.assetNumber}</div>
                                                <div className="font-bold">Class: {data.assetClass}</div>
                                            </div>
                                            <div>
                                                <div className="font-bold">Type: {data.assetType}</div>
                                                <div className="font-bold">Name: {data.assetType}</div>
                                            </div>
                                            <div>
                                                <div className="font-bold">Acquis. Val: {data.acquisVal}</div>
                                                <div className="font-bold">Cap. Date: {data.capDate}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className=''>
                                        <form id='entryForm' className="flex items-center gap-2" onSubmit={handleSubmitForm}>
                                            <div className="form-control">
                                                <input value={data.assetNumber} type="hidden" name='assetNumber' />
                                                <input value={data.assetClass} name='assetClass' type='hidden' />
                                                <input value={data.assetType} name='assetType' type='hidden' />
                                                <input value={data.assetDescription} name='assetDescription' type='hidden' />
                                                <input value={data.assetUser} type="text" name='assetUser' placeholder="Asset user name or section" className="input input-ghost  input-success" required />

                                            </div>
                                            <button type='submit' className=' btn btn-circle btn-ghost hover:bg-secondary text-primary text-lg'><FaPlus /></button>

                                        </form>

                                    </td>

                                </tr>)}

                            </tbody>
                        </table>
                    </div>
                </div>
            </dialog>
            {!hasNoassetNumber && <form id='entryForm' className="grid grid-cols-6 items-end gap-2 my-2 border-b  p-4 " onSubmit={handleSubmitForm}>
                <div className="form-control">
                    <label className="label label-sm">
                        <span className="label-text">Asset Numbar</span>
                    </label>
                    <input type="text" name='assetNumber' placeholder="Asset Number" onBlur={(e) => getAssetInfo(e.target.value)} disabled={hasNoassetNumber} className="input text-sm input-sm bg-inherit input-bordered" required />
                </div>
                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Asset Class</span>
                    </div>

                    <output name='assetClass' className="input input-sm text-sm  bg-inherit " >{assetInfo?.assetClass ? assetInfo?.assetClass : ''}</output>

                </label>
                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Asset Type</span>
                    </div>
                    <output name='assetType' className="input bg-inherit input-sm  " >{assetInfo?.assetType}</output>
                </label>
                <label className="form-control">
                    <label className="label">
                        <span className="label-text">Asset Description</span>
                    </label>

                    <output name='assetDescription' className="input bg-inherit input-sm  " >{assetInfo?.assetDescription}</output>


                </label>
                <label className="form-control bg-inherit">
                    <label className="label text-sm ">
                        <span className="label-text">Asset User</span>
                    </label>

                    <input type="text" name='assetUser' placeholder="Asset user name or section" className="input input-bordered bg-inherit  input-sm " required />
                </label>
                <div className="form-control mt-6">
                    <Button btnText="Add" />
                </div>
                {
                    <div className="form-control">
                        <span className="text-red-500">{assetError}</span>
                    </div>
                }

            </form>
            }
        </div>

    )
}

export default AssetEntryForm