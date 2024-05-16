import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_ENDPOINT = 'https://medsecapi.com/api';

// API endpoints
export const getUserEndpoint = (userId) => `${API_ENDPOINT}/users/get_patient/${userId}`;
export const getAppointmentsByUserEndpoint = (userId) => `${API_ENDPOINT}/appointments/get_all/${userId}`;
export const getFacilitiesEndpoint = `${API_ENDPOINT}/facilities/get_all`;
export const getDoctorsByUserEndpoint = (userId) => `${API_ENDPOINT}/doctors/get_by_patient_id/${userId}`;

// Login function
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/login`, {
      username,
      password
    });
    const { jwtToken, refreshToken, userId } = response.data;
    await AsyncStorage.setItem('jwtToken', jwtToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    return [jwtToken, 421];
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Refresh token function
export const refreshToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const response = await axios.post(`${API_ENDPOINT}/refresh`, {}, {
      headers: { Authorization: `Bearer ${refreshToken}` }
    });
    const { jwtToken } = response.data;
    await AsyncStorage.setItem('jwtToken', jwtToken);
    return jwtToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};
