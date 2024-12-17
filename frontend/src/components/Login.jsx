import React, { useState } from 'react';
import styles from '../componentsCss/Signup.module.css';
import { Link } from 'react-router-dom';

export default function Login() {
  const [userData, setUserData] = useState({ email: '', password: '' });

  const loginHandler = async (e) => {
    e.preventDefault();
    if (!userData.email || !userData.password) {
      alert('Input fields are missing!');
    }
    try {
      let response = await fetch('http://localhost:8000/api/v1/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      response = await response.json();
      if (response.success) {
        console.log(response.message);
        setUserData({ email: '', password: '' });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.flex}>
      <form className={styles.formContainer} onSubmit={loginHandler}>
        <div className={styles.header}>
          <h1>LOGO</h1>
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
