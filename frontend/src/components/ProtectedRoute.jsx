import { isTokenExpired } from '@/lib/isTokenExpired';
import store from '@/redux/store'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({children}) {
    const {user, token} = useSelector(store=>store.auth);
    
    const navigate = useNavigate();
    useEffect(()=>{
        if(!user || !token || isTokenExpired(token)) navigate('/login');
    },[]);
  return (
    <>{children}</>
  )
  
}
