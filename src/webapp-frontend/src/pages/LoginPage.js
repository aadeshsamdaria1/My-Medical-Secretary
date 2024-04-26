import React from 'react';
import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // Import CSS file

const LoginPage = () => {
    const navigate = useNavigate();

    // Callback function to navigate to the home page after successful login
    const handleLoginSuccess = () => {
      navigate('/home');
    };

    return (
      <div className="login-container">
        <header className="header">
          <h1 className="header-title">My Medical Secretary</h1>
        </header>
        <div className="login-content">
          <h2 className="login-title">Admin Login</h2>
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
      </div>
    );
  };

  export default LoginPage;