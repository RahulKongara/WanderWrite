import { useState } from 'react';
import { toast } from 'react-toastify';


const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function register (e) {
        e.preventDefault();
        try {
            const response = await fetch('https://wanderwrite-backend.onrender.com/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
            });

            if (response.status === 200) {
                const data = await response.json();
                console.log(data);
                toast.success('Registration Successful!');
            }
            else {
                toast.error('Registration Failed!');
                console.log('Registration Failed');
            }
        } catch(err) {
            console.error("Error:",  err.message);
        }
    }

  return (
    <div className="register">
        <form action="" className="register-form" onSubmit={register}>
            <h1>Register</h1>
            <input 
                type="text" 
                className="username"
                placeholder='Username'
                value={username} 
                onChange={e => setUsername(e.target.value)}
            />
            <input 
                type="password"  
                className="password"
                placeholder='Password'
                value={password} 
                onChange={e => setPassword(e.target.value)}
            />
            <button className="register-btn">
                Register
            </button>
        </form>
    </div>
  )
}

export default Register