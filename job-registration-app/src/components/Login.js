import React, { useState } from 'react';
import api from '../services/api';
import { useHistory, Link } from 'react-router-dom';

const Login = () => {
  const history = useHistory();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { phoneNumber });
      if (response.status === 200) {
        const { role } = response.data.data;
        localStorage.setItem('auth', JSON.stringify(response.data.data));
        
        if (role === 'user') {
          history.push('/user');
        } else if (role === 'admin') {
          history.push('/admin');
        }
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      if (error.response && error.response.status === 422 && error.response.data.status.errors) {
        const apiErrors = error.response.data.status.errors.reduce((acc, err) => {
          return {
            ...acc,
            [err.path]: err.msg
          };
        }, {});
        setErrors(apiErrors);
      } else if (error.response && error.response.status === 404) {
        setErrors({ phoneNumber: 'Login failed' });
      } else {
        console.error('Failed to login:', error);
      }
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
        {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
      <p>Have you registered for the event yet? <Link to="/register">Register</Link></p>
    </div>
  );
};

export default Login;
