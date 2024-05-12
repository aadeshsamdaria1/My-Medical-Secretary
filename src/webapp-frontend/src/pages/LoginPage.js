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

  // Get the current year
  const currentYear = new Date().getFullYear();

  return (
    <div className="login-page-container">
      <header className="header">
        <h1 className="header-title">My Medical Secretary</h1>
      </header>
      <main className="login-content">
        <section className="login-section">
          <h2 className="login-title">Admin Login</h2>
          <div className="login-form-container">
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          </div>
        </section>
      </main>
      <footer className="footer">
        <p className="footer-text">My Medical Secretary. All rights reserved © {currentYear}</p>
      </footer>
    </div>
  );
};

export default LoginPage;