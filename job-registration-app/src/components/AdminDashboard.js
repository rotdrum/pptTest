import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useHistory } from 'react-router-dom';

const AdminDashboard = () => {
  const history = useHistory();
  const [registrations, setRegistrations] = useState([]);
  const [remainingPositions, setRemainingPositions] = useState(0);
  const [totalPositions, setTotalPositions] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Number of items per page
  const [sortConfig, setSortConfig] = useState({ key: 'firstName', direction: 'ascending' });
  const [pendingUpdates, setPendingUpdates] = useState({});
  const [timeoutId, setTimeoutId] = useState(null);
  const [inputErrors, setInputErrors] = useState({});
  const [userDetails, setUserDetails] = useState({});

  const fetchRegistrations = async () => {
    try {
      const response = await api.get('/users');
      setRegistrations(response.data.data); // Assuming response.data.data is an array
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRemainingPositions = async () => {
    try {
      const response = await api.get('/remaining-positions');
      setRemainingPositions(response.data.data.remainingPositions); // Assuming response.data.remainingPositions is a number
      setTotalPositions(response.data.data.totalPositions); // Assuming response.data.totalPositions is a number
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    if (!auth || auth.role !== 'admin') {
        history.push('/');
    } else {
        setUserDetails(auth);
        fetchRegistrations();
        fetchRemainingPositions();
    }
  }, []);

  const handleLogout = async () => {
    try {
      window.location.href = '/'; // Redirect to login page
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

  const handlePositionChange = (phoneNumber, newPosition) => {
    // Clear previous timeout if it exists
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Validate newPosition
    const isValid = validatePosition(newPosition);

    // Update inputErrors state based on validation
    setInputErrors((prevErrors) => ({
      ...prevErrors,
      [phoneNumber]: isValid ? null : 'Invalid position number',
    }));

    // If not valid, return without setting timeout
    if (!isValid) {
      return;
    }

    // Update pending updates state
    setPendingUpdates((prevUpdates) => ({
      ...prevUpdates,
      [phoneNumber]: newPosition,
    }));

    // Set a new timeout for 500ms (adjust as needed)
    const id = setTimeout(async () => {
      try {
        await api.put(`/users/${phoneNumber}/position`, { newPosition: Number(newPosition) });
        fetchRegistrations(); // Refresh the data
      } catch (error) {
        console.error('Failed to update position:', error);
        if (error.response && error.response.status === 500 && error.response.data === "Position_No is Duplicate") {
          setInputErrors((prevErrors) => ({
            ...prevErrors,
            [phoneNumber]: 'Position number is duplicate',
          }));
        } else {
          setInputErrors((prevErrors) => ({
            ...prevErrors,
            [phoneNumber]: 'Failed to update position',
          }));
        }
      } finally {
        // Clear the pending update for the phoneNumber
        setPendingUpdates((prevUpdates) => {
          const updatedState = { ...prevUpdates };
          delete updatedState[phoneNumber];
          return updatedState;
        });
      }
    }, 500); // Adjust delay duration as needed

    // Store the timeout id
    setTimeoutId(id);
  };

  const validatePosition = (position) => {
    // Simple validation: Ensure position is a number and greater than zero
    return !isNaN(position) && Number(position) > 0;
  };

  const handleTotalPositionsChange = async (newTotalPositions) => {
    try {
      await api.put('/total-positions', { totalPositions: Number(newTotalPositions) });
      setTotalPositions(Number(newTotalPositions)); // Update local state
      fetchRemainingPositions(); // Refresh the remaining positions
    } catch (error) {
      console.error('Failed to update total positions:', error);
    }
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
      <h2>Admin Dashboard</h2>
      <div>
        <label>
          Total Positions:
          <input
            type="number"
            value={totalPositions}
            onChange={(e) => setTotalPositions(e.target.value)}
          />
        </label>
        <button onClick={() => handleTotalPositionsChange(totalPositions)}>Save</button>
      </div>
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
            registration.userId && (
              <tr key={registration.userId}>
                <td>
                  <input
                    type="number"
                    value={pendingUpdates[registration.phoneNumber] !== undefined ? pendingUpdates[registration.phoneNumber] : registration.userId}
                    onChange={(e) => handlePositionChange(registration.phoneNumber, e.target.value)}
                  />
                  {inputErrors[registration.phoneNumber] && (
                    <span style={{ color: 'red' }}>{inputErrors[registration.phoneNumber]}</span>
                  )}
                </td>
                <td>{registration.firstName}</td>
                <td>{registration.lastName}</td>
                <td>{registration.phoneNumber}</td>
              </tr>
            )
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

export default AdminDashboard;
