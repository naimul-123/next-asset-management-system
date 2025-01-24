"use client"

import { postData } from '../lib/api';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
import Swal from 'sweetalert2';




const AssetContext = createContext(null);

export const AssetProvider = ({ children }) => {
    const [assetData, setAssetData] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);


    const form = null

    const getAssetData = async () => {
        const assetNo = form.getValues('assetNumber');
        console.log(assetNo);
        if (assetNo?.length === 12) {
            const res = await axios.get(`/api/getAsset/?assetNo=${assetNo}`);
            if (res.data) {
                form.setValue("categoryName", res.data.categoryName || "");
                form.setValue("assetName", res.data.assetDescription || "");
                form.setValue("subCategoryName", res.data.subCategoryName || ""); // Set subCategoryName here
            }
        }
    };






    const assetInfo = {

        assetData,
        setAssetData,
        form,
        setSelectedDepartment,
        selectedDepartment,
        setSelectedSection,
        selectedSection,
        getAssetData,

    };

    return (
        <AssetContext.Provider value={assetInfo}>
            {children}
        </AssetContext.Provider>
    );
};

export const useAssetContext = () => {
    const context = useContext(AssetContext);
    if (!context) {
        throw new Error("useAssetContext must be used within an AssetProvider");
    }
    return context;
};
