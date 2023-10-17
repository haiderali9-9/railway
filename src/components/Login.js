import React from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import './login.css'; 
import { Link } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form_data = {
      email,
      password
    };

    const response = await axios.post('http://localhost:3000/',form_data);
    if (response.status === 200) {
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/profile');
    } 
    setEmail('');
    setPassword('');
    };


  return (
    <form className='login-form' onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button type="submit">Login</button>
      <button type="button"><Link to='/signup'>Create New Account</Link></button>
    </form>
  );
};

export default Login;
