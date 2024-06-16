import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useHistory } from 'react-router-dom';

const UserDashboard = () => {
  const history = useHistory();
  const [registrations, setRegistrations] = useState([]);
  const [remainingPositions, setRemainingPositions] = useState(0);
  const [totalPositions, setTotalPositions] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Number of items per page
  const [sortConfig, setSortConfig] = useState({ key: 'firstName', direction: 'ascending' });
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    if (!auth || auth.role !== 'user') {
      history.push('/');
    } else {
      fetchUserDetails();
      fetchRegistrations();
      fetchRemainingPositions();
    }
  }, []);

  const fetchUserDetails = async () => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    setUserDetails(auth);
  };

  const fetchRegistrations = async () => {
    try {
      const response = await api.get('/users');
      setRegistrations(response.data.data); // Assuming response.data.data is an array of registrations
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    }
  };

  const fetchRemainingPositions = async () => {
    try {
      const response = await api.get('/remaining-positions');
      setRemainingPositions(response.data.data.remainingPositions); // Assuming response.data.data.remainingPositions is a number
      setTotalPositions(response.data.data.totalPositions); // Assuming response.data.data.totalPositions is a number
    } catch (error) {
      console.error('Failed to fetch remaining positions:', error);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('auth');
      history.push('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedRegistrations = [...registrations].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredRegistrations = sortedRegistrations.filter((registration) =>
    registration.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registration.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedRegistrations = filteredRegistrations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredRegistrations.length / pageSize);

  return (
    <div>
      <p>
        Name: {userDetails.firstName} {userDetails.lastName} | Type: {userDetails.role} | Position No: {userDetails.userId}
        <button onClick={handleLogout}>Logout</button>
      </p>
      <h2>
        User Dashboard, 
      </h2>
      <p>Total Positions: {totalPositions}</p>
      <p>Remaining Positions: {remainingPositions}</p>
      <div>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('userId')}>
              Position No {sortConfig.key === 'userId' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => handleSort('firstName')}>
              First Name {sortConfig.key === 'firstName' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => handleSort('lastName')}>
              Last Name {sortConfig.key === 'lastName' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => handleSort('phoneNumber')}>
              Phone Number {sortConfig.key === 'phoneNumber' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedRegistrations.map((registration) => (
            <tr key={registration.userId}>
              <td>{registration.userId}</td>
              <td>{registration.firstName}</td>
              <td>{registration.lastName}</td>
              <td>{registration.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span> Page {currentPage} of {totalPages} </span>
        <button
          onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
