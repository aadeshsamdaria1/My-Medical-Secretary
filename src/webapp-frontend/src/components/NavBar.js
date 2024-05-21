import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHandleLogout } from '../utils/useHandleLogout';
import '../styles/Navbar.css'

export default function NavBar() {
  const navigate = useNavigate();
  const onLogout = useHandleLogout();


  const handleNavigation = (path) => {
    navigate(path);
  };


  return (
    <div className="navbar">
      <div className="navbar-logo">
        <span className="logo-text">My Medical Secretary</span>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
        <button className="admin-button" onClick={() => handleNavigation('/admin_account_management')}>
          Admin Account Management
        </button>
       
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