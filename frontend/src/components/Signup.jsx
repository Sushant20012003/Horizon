import React, { useEffect, useState } from 'react';
import styles from '../componentsCss/Signup.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser, setToken } from '@/redux/authSlice';
import store from '@/redux/store';
import { isTokenExpired } from '@/lib/isTokenExpired';

export default function Signup() {
    const [userData, setUserData] = useState({ username: '', email: '', password: '' });
    const navigate= useNavigate();
    const dispatch = useDispatch();
    const {user, token} = useSelector(store=>store.auth);

    const signupHandler = async (e) => {
        e.preventDefault();
        if (!userData.username || !userData.email || !userData.password) {
            alert('Input fields are missing!');
            return;
        }
        try {
            let response = await fetch('http://localhost:8000/api/v1/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            response = await response.json();
            if (response.success) {
                console.log(response.message);
                dispatch(setAuthUser(response.user));
                dispatch(setToken(response.token));
                setUserData({ username: '', email: '', password: '' });
                navigate('/');
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(()=>{
        if(token && !isTokenExpired(token)) navigate('/');
      },[]);

    return (
        <div className={styles.flex}>
            <form className={styles.formContainer} onSubmit={signupHandler}>
                <div className={styles.header}>
                    <h1>LOGO</h1>
                    <p>Create an account to enjoy personalized features and stay updated with the latest content. Sign up today and join our community!</p>
                </div>
                <div>
                    <input
                        className={styles.inputField}
                        type="text"
                        placeholder="Username"
                        value={userData.username}
                        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                    />
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
                        Signup
                    </button>
                    
                    <span className={styles.navigate}>Already have an account?<Link to='/login' >Login</Link></span>
                </div>
            </form>
        </div>
    );
}
