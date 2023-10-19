import React from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { Link } from 'react-router-dom';
import "./login.css"; 

axios.defaults.withCredentials = true;
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
    const response = await axios.post('http://localhost:3000/login',form_data);
    if (response.status === 200) {
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/profile');
    } 
    setEmail('');
    setPassword('');
    };

  useEffect(() => {
    const fetchData = async () => {
    const response = await axios.get('http://localhost:3000/login');
    const {loggedIn} = response.data;
    console.log(response.data);
    console.log(loggedIn);
    if(loggedIn === true){
      navigate('/profile');
    }};
    fetchData();
  },[]);
    

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
