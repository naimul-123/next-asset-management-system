"use client"
import { useAuth } from '../contexts/authContext';
import { useEffect } from 'react';


const ProtectedRoute = ({
    children,
}) => {
    const { getUser } = useAuth()


    useEffect(() => {


        getUser()


    }, [])



    return <>
        {children}
    </>
}

export default ProtectedRoute