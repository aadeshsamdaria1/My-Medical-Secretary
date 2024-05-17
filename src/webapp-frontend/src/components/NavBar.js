import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css'

export default function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {

    // Clear login credentials
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');

    // Redirect to the login page
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
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
        <li><button onClick={() => handleNavigation('/file_upload')}>File Upload</button></li>
        <li><button onClick={() => handleNavigation('/patients')}>Patients</button></li>
        <li><button onClick={() => handleNavigation('/doctors')}>Doctors</button></li>
        <li><button onClick={() => handleNavigation('/facilities')}>Facilities</button></li>
      </ul>
    </div>
  );
}