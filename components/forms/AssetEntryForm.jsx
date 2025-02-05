"use client"

import { useEffect, useState } from 'react'
import { getData } from '../../lib/api';
import Button from '../reusable/Button';
import { useQuery } from '@tanstack/react-query';

const AssetEntryForm = ({ getFormData }) => {
    const [hasNoAssetNumber, sethasNoAssetNumber] = useState(false)
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


    const group = assetClasses?.map((g) => g.assetGroup).sort((a, b) => a.localeCompare(b))


    console.log(remainingAssets);



    const handleHasNoAssetNumber = (e) => {
        sethasNoAssetNumber(e.target.checked)
        document.getElementById('entryForm').reset()
        setAssetInfo({})
        setAssetError('')
    }






    const handleGroupChange = async (assetGroup) => {
        setAssetType([])
        const assetTypeData = await getData(`/api/getAssetType?assetGroup=${assetGroup}`)
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
        const assetGroup = form.assetGroup.value;
        const assetType = form.assetType.value;
        const assetDescription = form.assetDescription.value;
        const assetUser = form.assetUser.value;

        const assetData = {
            assetNumber, assetGroup, assetType, assetDescription, assetUser
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



    hasNoAssetNumber && document.getElementById('my_modal_4').showModal()
    return (
        <div className='border-2 rounded-t-lg shadow-md  text-sm'>
            <div className='flex p-4 items-center '>
                <label className='label coursor-pointer'>
                    <span className="text-primary font-bold text-2xl" >Has no asset number?</span>
                    <input type="checkbox" name='hasNoAssetNumber' className="toggle toggle-warning toggle-lg" onChange={(e) => handleHasNoAssetNumber(e)} checked={hasNoAssetNumber} />
                </label>
            </div>
            <dialog id="my_modal_4" className="modal">
                <div className="modal-box w-10/12 flex flex-col  z-[99]   max-w-5xl h-full">
                    <div className='flex'>
                        <h2 className='text-center grow text-2xl font-bold'>Pick Asset from database</h2>
                        <form method="dialog" className='flex justify-end' >
                            <button className="btn " onClick={() => sethasNoAssetNumber(false)}>Close</button>
                        </form>
                    </div>

                    <form className='grid grid-cols-4 gap-2 my-2'>


                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Asset Group</span>
                            </div>

                            <select name='assetGroup' defaultValue="" onChange={(e) => handleGroupChange(e.target.value)} className="select select-sm bg-inherit  select-bordered" required>
                                <option value="" >---Select---</option>
                                {group.map((g) => <option key={g} value={g}>{g}</option>)}
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
                        <table className="table table-zebra static  table-md">
                            <thead className=' '>
                                <tr className='bg-[#d3efe1] text-[#007f40] sticky top-0   shadow-md py-7 '>
                                    <th>SL</th>
                                    <th>Asset Number</th>
                                    <th>Asset Group</th>
                                    <th>Asset Type</th>
                                    <th>Asset Description</th>
                                    <th>Asset User</th>

                                </tr>
                            </thead>
                            <tbody>
                                {remainingAssets?.map((data, idx) => <tr key={idx}>
                                    <th>{idx + 1}</th>
                                    <td>{data.assetNumber || data.AssetNumber}</td>
                                    <td>{data.assetGroup}</td>
                                    <td>{data.assetType}</td>
                                    <td>{data.assetDescription}</td>
                                    <td className=''>
                                        <form id='entryForm' className="flex items-center gap-2" onSubmit={handleSubmitForm}>
                                            <div className="form-control">
                                                <input value={data.assetNumber || data.AssetNumber} type="hidden" name='assetNumber' />
                                                <input value={data.assetGroup} name='assetGroup' type='hidden' />
                                                <input value={data.assetType} name='assetType' type='hidden' />
                                                <input value={data.assetDescription} name='assetDescription' type='hidden' />
                                                <input value={data.assetUser} type="text" name='assetUser' placeholder="Asset user name or section" className="input input-sm input-success " required />

                                            </div>
                                            <button type='submit' className='btn btn-sm text-primary bg-secondary hover:bg-[#c8ecda]'>Add</button>

                                        </form>

                                    </td>
                                </tr>)}

                            </tbody>
                        </table>
                    </div>
                </div>
            </dialog>
            {!hasNoAssetNumber && <form id='entryForm' className="grid grid-cols-6 items-end gap-2 my-2 border-b  p-4 " onSubmit={handleSubmitForm}>
                <div className="form-control">
                    <label className="label label-sm">
                        <span className="label-text">Asset Numbar</span>
                    </label>
                    <input type="text" name='assetNumber' placeholder="Asset Number" onBlur={(e) => getAssetInfo(e.target.value)} disabled={hasNoAssetNumber} className="input text-sm input-sm bg-inherit input-bordered" required />
                </div>
                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Asset Group</span>
                    </div>

                    <output name='assetGroup' className="input input-sm text-sm  bg-inherit " >{assetInfo?.assetGroup ? assetInfo?.assetGroup : ''}</output>

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