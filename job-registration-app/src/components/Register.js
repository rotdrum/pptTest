import React, { useState } from 'react';
import api from '../services/api';
import { useHistory } from 'react-router-dom';

const Register = () => {
  const history = useHistory();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('user'); // Default to 'user'
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/register', {
        firstName,
        lastName,
        phoneNumber,
        role
      });
      console.log(response.data); // Handle success response

      // Proceed to login after successful registration
      await loginUser();
    } catch (error) {
      if (error.response && error.response.status === 422 && error.response.data.status.errors) {
        const apiErrors = error.response.data.status.errors.reduce((acc, err) => {
          return {
            ...acc,
            [err.path]: err.msg
          };
        }, {});
        setErrors(apiErrors);
      } else {
        console.error('Failed to register:', error);
      }
    }
  };

  const loginUser = async () => {
    try {
      const response = await api.post('/login', {
        phoneNumber
      });
      if (response.data.data.role === 'user') {
        history.push('/user');
      } else if (response.data.data.role === 'admin') {
        history.push('/admin');
      }
    } catch (error) {
      console.error('Failed to login:', error);
    }
  };

  return (
    <div>
      <h2>Registration Page</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          {errors.firstName && <span className="error">{errors.firstName}</span>}
        </div>
        <div>
          <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>
        <div>
          <input type="text" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
          {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
        </div>
        <div>
          <label>
            Role:
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
