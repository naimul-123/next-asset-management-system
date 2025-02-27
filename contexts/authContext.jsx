"use client"



import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react'
import Swal from 'sweetalert2';




const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [remainingTime, setRemainingTime] = useState(null);
    const router = useRouter()
    const queryClient = useQueryClient();


    const logout = async () => {
        try {
            await axios.post('/api/logout');
            queryClient.clear();
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "expiredTime=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            router.push('/login');
            setUser(null)
        }
        catch (error) {
            console.error('Logout failed:', error)
        }

    }



    const getUser = async () => {
        try {
            const res = await fetch("/api/getUser")
            if (res.ok) {
                const data = await res.json();
                setUser(data.payload)
            }
            else {
                setUser(null);
                logout();
            }
        } catch (error) {
            console.error("Auth Error:", error)
        }
        finally {
            setLoading(false)
        }

    }

    const checkSessionExpiry = () => {
        const expiredTime = document.cookie.split("; ")
            .find(row => row.startsWith('expiredTime='))
            ?.split('=')[1];
        if (!expiredTime) return;
        const now = Date.now();
        const reminigMs = Number(expiredTime) - now
        if (reminigMs <= 0) {
            console.log('Session expired! Logging Out');
            logout();
        }
        else {
            setRemainingTime(reminigMs)
        }

    }

    const setupAxiosInterceptors = () => {
        axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error?.response?.status === 401) {
                    console.log("Session expired, logging out...");
                    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    await logout();
                }
                return Promise.reject(error)
            }
        )
    }

    useEffect(() => {
        getUser();
        setupAxiosInterceptors();
        const interval = setInterval(checkSessionExpiry, 1000); // Check 

        return () => clearInterval(interval);

    }, [])


    const formatRemainingTime = () => {
        if (remainingTime === null) return ""
        const minutes = Math.floor(remainingTime / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000)
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
    }


    const authInfo = { user, getUser, logout, loading, remainingTime: formatRemainingTime() }


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