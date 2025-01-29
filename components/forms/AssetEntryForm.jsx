"use client"

import { useEffect, useState } from 'react'
import assetGroup from '../../public/assetGroup.json';


import { useAssetContext } from '../../contexts/assetContext'
import { getData } from '../../lib/api';
import Button from '../reusable/Button';
import { useQuery } from '@tanstack/react-query';


const AssetEntryForm = ({ getFormData }) => {
    const [hasNoAssetNumber, sethasNoAssetNumber] = useState(false)
    const [group, setGroup] = useState([]);
    const [assetType, setAssetType] = useState([]);
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

    useEffect(() => {
        const groupName = assetGroup.map((g) => g.assetGroup)
        setGroup(groupName)
    }, []);





    const handleHasNoAssetNumber = (e) => {
        sethasNoAssetNumber(e.target.checked)
        document.getElementById('entryForm').reset()
        setAssetInfo({})
        setAssetError('')
    }






    const handleGroupChange = (value) => {
        setAssetType([])
        const selectedGroup = assetGroup.find(g => g.assetGroup === value);
        if (selectedGroup) {
            const assetTypeData = selectedGroup?.assetType;
            setAssetType(assetTypeData)
        }


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



    return (
        <div className='border-2 rounded-t-lg shadow-md p-4 text-sm'>

            <div className="max-w-48 flex gap-1 items-center">
                <span className="label-text">Has no asset number?</span>
                <input type="checkbox" name='hasNoAssetNumber' className="checkbox checkbox-xs checkbox-warning" onChange={(e) => handleHasNoAssetNumber(e)} />
            </div>
            <form id='entryForm' className="grid grid-cols-6 items-end gap-2 " onSubmit={handleSubmitForm}>
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
                    {hasNoAssetNumber ?
                        <select name='assetGroup' defaultValue="" onChange={(e) => handleGroupChange(e.target.value)} disabled={!hasNoAssetNumber} className="select select-sm bg-inherit  select-bordered" required>
                            <option value="" >---Select---</option>
                            {group.map((g) => <option key={g} value={g}>{g}</option>)}
                        </select> :
                        <output name='assetGroup' className="input input-sm text-sm  bg-inherit " >{assetInfo?.assetGroup ? assetInfo?.assetGroup : ''}</output>

                    }

                </label>
                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Asset Type</span>
                    </div>

                    {hasNoAssetNumber ?
                        <select name='assetType' defaultValue="" disabled={!hasNoAssetNumber} className="select select-sm select-bordered bg-inherit" required>
                            <option value="">---Select---</option>
                            {assetType.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                        :
                        <output name='assetType' className="input bg-inherit input-sm  " >{assetInfo?.assetType}</output>

                    }

                </label>
                <label className="form-control">
                    <label className="label">
                        <span className="label-text">Asset Description</span>
                    </label>
                    {hasNoAssetNumber ?
                        <input type="text" name='assetDescription' defaultValue="" disabled={!hasNoAssetNumber} placeholder="Asset Description" className="input input-bordered bg-inherit input-sm " required /> :
                        <output name='assetDescription' className="input bg-inherit input-sm  " >{assetInfo?.assetDescription}</output>

                    }
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

        </div>

    )
}

export default AssetEntryForm