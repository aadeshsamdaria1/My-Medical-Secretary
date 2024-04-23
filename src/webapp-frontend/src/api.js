import axios from 'axios';

export const API_ENDPOINT = 'http://mymedicalsecretary.uk.to:8080/api';

// API endpoints

export const loginEndpoint = `${API_ENDPOINT}/login`;
export const refreshTokenEndpoint = `${API_ENDPOINT}/refresh`;

// Login function
export const login = async (username, password) => {
  try {
    const response = await axios.post(loginEndpoint, {
      username,
      password
    });
    const { jwtToken, refreshToken } = response.data;
    localStorage.setItem('jwtToken', jwtToken);
    localStorage.setItem('refreshToken', refreshToken);
    return jwtToken;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Refresh token function
export const refreshToken = async () => {
  try {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const response = await axios.post(refreshTokenEndpoint, {}, {
      headers: { Authorization: `Bearer ${storedRefreshToken}` }
    });
    const { jwtToken } = response.data;
    localStorage.setItem('jwtToken', jwtToken);
    return jwtToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};
