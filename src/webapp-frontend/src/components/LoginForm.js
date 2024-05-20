import React, { useState } from 'react';
import { login } from '../api'
import '../styles/Login.css';


const LoginForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username === '' || password === '') {
      return
    }

    try {
        const response = await login(username, password);
        onLoginSuccess();
    } catch (error) {

        if (error.response && error.response.data && error.response.status === 401) {
          console.error('Login error:', error.response.data);
          setErrorMessage(error.response.data)
        }
        
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className='input-field'
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className='input-field'
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div>
        {errorMessage &&
          <div className='error-message-login'>{errorMessage}</div>
        }
      </div>
      <button className="login-button" type="submit">Login</button>
    </form>
  );
};

export default LoginForm;