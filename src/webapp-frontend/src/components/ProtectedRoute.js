import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {

    return localStorage.getItem('jwtToken') !== null;;
}

const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" />;
};

export default ProtectedRoute;