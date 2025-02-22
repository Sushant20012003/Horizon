import React, { useEffect, useState } from 'react';
import styles from '../componentsCss/Signup.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser, setToken} from '@/redux/authSlice';
import store from '@/redux/store';
import { isTokenExpired } from '@/lib/isTokenExpired';
import { BASE_URL } from '@/config/apiConfig';

export default function Login() {
  const [userData, setUserData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user, token} = useSelector(store=>store.auth);

  const loginHandler = async (e) => {
    e.preventDefault();
    if (!userData.email || !userData.password) {
      alert('Input fields are missing!');
      return;
    }
    try {
      let response = await fetch(`${BASE_URL}/api/v1/user/login`, {
        method:"POST",
        headers:{
          'Content-Type': 'application/json',
        },
        credentials:'include',
        body: JSON.stringify(userData),
      });

      response = await response.json();
      
      if (response.success) {
        console.log(response.message);
        setUserData({ email: '', password: '' });
        dispatch(setAuthUser(response.user));
        dispatch(setToken(response.token));
        navigate('/')
      }
      else {
        alert(response.message);
      }

    } catch (error) {
      console.log(error);
    }
  };


  useEffect(()=>{
    if(token) navigate('/');
  },[]);


  return (
    <div className={styles.flex}>
      <form className={styles.formContainer} onSubmit={loginHandler}>
        <div className={styles.header}>
          <h1 className='font-mono font-bold'>Horizon</h1>
          <p>Welcome back! We're happy to see you again. Log in to continue your journey</p>
        </div>
        <div>
          <input
            className={styles.inputField}
            type="email"
            placeholder="Email id"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          />
          <input
            className={styles.inputField}
            type="password"
            placeholder="Password"
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          />
          <button className={styles.button} type="submit">
            Login
          </button>
          <span className={styles.navigate}>Doesn't have an account?<Link to='/signup' >Signup</Link></span>

        </div>
      </form>
    </div>
  );
}
