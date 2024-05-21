// src/utils/useHandleLogout.js
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useHandleLogout = () => {
  const navigate = useNavigate();

  return useCallback(() => {
    // Clear login credentials
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');

    // Redirect to the login page
    navigate('/');
  }, [navigate]);
};