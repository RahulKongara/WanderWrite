import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';
import img from '../assets/logo.png';

const Header = () => {
  const {setUserInfo, userInfo} = useContext(UserContext);
  useEffect(() => {
    fetch('https://wanderwrite-backend.onrender.com/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch('https://wanderwrite-backend.onrender.com/logout',  {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;
  return (
    <header>
        <Link to="/" className='logo'>
            <img src={img} className='logo-image'/>
            {/* MyBlog */}
        </Link>
        {/* <input type="text" name="Search-bar" id="searchBar" className='search-bar' placeholder='Search blogs' /> */}
        <nav>
            {username && (
              <>
                <Link to="/write">Write</Link>
                {/* <a onClick={logout}>Log Out</a> */}
                <Link onClick={logout}>Logout</Link>
              </>
            )}
            {!username && (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
        </nav>
    </header>
  )
}

export default Header