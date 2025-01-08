import store from '@/redux/store'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function ProtectedRoute({children}) {
    const {user} = useSelector(store=>store.auth);
    const token = Cookies.get('token');
    console.log(token);
    
    const navigate = useNavigate();
    useEffect(()=>{
        if(!user ) navigate('/login');
    },[]);
  return (
    <>{children}</>
  )
  
}
