"use client"
import { getData } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import React, { createContext, useContext, useState } from 'react'

const authContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [sap, setSap] = useState('');
    const { data: user = {}, isLoading: userLoading } = useQuery({
        queryKey: ['user', sap],
        queryFn: () => getData(`/login/api/?sap=${sap}`)
    })
    let isLogIn = false;
    if (user?.sap) {
        isLogIn = true;
    }
    else {
        isLogIn = false;
    }
    console.log(isLogIn);
    const authInfo = { user, sap, setSap, isLogIn, userLoading }

    console.log(user);
    return (
        <authContext.Provider value={authInfo}>
            {children}
        </authContext.Provider>
    )
}

export const useAuthContext = () => {

    const context = useContext(authContext)
    if (!context) {
        throw new Error("UseAuthcontext must be used with an auth provider")
    }
    return context;
}