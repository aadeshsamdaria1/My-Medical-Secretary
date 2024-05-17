import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {

    // Clear login credentials
    localStorage.setItem('jwtToken', null);
    localStorage.setItem('refreshToken', null);
    localStorage.setItem('userId', null)

    // Redirect to the login page
    navigate('/');
  };

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
        <span className="logo-text">My Medical Secretary</span>
      </div>
      <ul className="navbar-menu">
        <li><a href="/file_upload">File Upload</a></li>
        <li><a href="/patients">Patients</a></li>
        <li><a href="/doctors">Doctors</a></li>
        <li><a href="/facilities">Facilities</a></li>
      </ul>
    </div>
  );
}