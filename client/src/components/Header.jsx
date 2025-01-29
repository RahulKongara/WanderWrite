import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';
import img from '../assets/Logo.png';

const Header = () => {
  const {setUserInfo, userInfo} = useContext(UserContext);
  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch('http://localhost:4000/logout',  {
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