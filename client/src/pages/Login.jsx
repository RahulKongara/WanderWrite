import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../UserContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext);
    async function login(e) {
        e.preventDefault();
        const response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({username, password}),
            credentials: 'include',
        });

        if (response.ok) {
            toast('Login Successful');
            response.json().then(userInfo => {
                setUserInfo(userInfo);
                setRedirect(true);
            });
        } else {
            toast('Wrong credentials');
            alert('Wrong Credentials');
        }
    }

    if (redirect) { return <Navigate to={'/'} />}
  return (
    <main>
        <div className='login' onSubmit={login}>
            <form action="" className="login-form">
                <h1>Login</h1>
                <input 
                    type="text" 
                    name="username" 
                    id="username" 
                    className="username" 
                    placeholder='Username'
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input 
                    type="password" 
                    name="password" 
                    id="pwd" 
                    className="password" 
                    placeholder='Password' 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button className="login-btn">
                    Login
                </button>
            </form>
        </div>
    </main>
  )
}

export default Login