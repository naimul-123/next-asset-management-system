"use client"


import { postData } from '../lib/api';
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'
import Swal from 'sweetalert2';




const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isOpenModal, setIsOpemModal] = useState(false)
    const router = useRouter()
    const queryClient = useQueryClient();


    const logout = async () => {
        try {
            await axios.post('/api/logout');
            queryClient.clear();
            router.push('/login');
            setIsOpemModal(false)
            setUser(null)

        }
        catch (error) {
            console.error('Logout failed:', error)
        }
    }
    const getUser = async () => {
        const res = await fetch("/api/getUser")
        if (res.ok) {
            const data = await res.json();
            setUser(data.payload)
        }
        else window.location.href = ('/login')
    }
    const profileMutation = useMutation({
        mutationFn: async (data) => postData('/api/updateUser', data),
        onSuccess: async (result) => {
            if (result.data) {
                getUser()
                console.log(result.data);

                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "User info have been updated successfully.",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        },
        onError: (error) => {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: error.message,
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
    const authInfo = { user, setUser, getUser, isOpenModal, setIsOpemModal, logout, profileMutation }


    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {

    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("UseAuthcontext must be used with an auth provider")
    }
    return context;
}