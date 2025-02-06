import { isTokenExpired } from '@/lib/isTokenExpired';
import { setToken } from '@/redux/authSlice';
import store from '@/redux/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({children}) {
    const {user, token} = useSelector(store=>store.auth);
    const dispatch = useDispatch();
    
    const navigate = useNavigate();
    useEffect(()=>{
        if(!user || !token || isTokenExpired(token)) {
          dispatch(setToken(null));
          navigate('/login');
        };
    },[]);
  return (
    <>{children}</>
  )
  
}
