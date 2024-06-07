import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Base64 } from 'js-base64';

export const API_ENDPOINT = 'https://medsecapi.com:444/api';

// API endpoints
export const getUserEndpoint = (userId) => `${API_ENDPOINT}/users/get_patient/${userId}`;
export const getAppointmentsByUserEndpoint = (userId) => `${API_ENDPOINT}/appointments/get_all/${userId}`;
export const getFacilitiesEndpoint = `${API_ENDPOINT}/facilities/get_all`;
export const getDoctorsByUserEndpoint = (userId) => `${API_ENDPOINT}/doctors/get_by_patient_id/${userId}`;
export const updateUserNoteEndpoint = `${API_ENDPOINT}/appointments/user_note/update`;
export const getResourceByUserEndpoint = (userId) => `${API_ENDPOINT}/resources/get_all_by_id/${userId}`;
export const getMessageByUserEndpoint = (userId) => `${API_ENDPOINT}/messages/getMessages/${userId}`;
export const activateAccountByEmailEndpoint = (email) => `${API_ENDPOINT}/enter_email/${email}`;
export const sendOneTimeCodeEndpoint = `${API_ENDPOINT}/activate`;
export const registerDeviceTokenEndpoint = `${API_ENDPOINT}/notifications/registerDeviceToken`;

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/login`, {
      username,
      password
    });
    const { jwtToken, refreshToken, userId } = response.data;
    await AsyncStorage.setItem('jwtToken', jwtToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    await AsyncStorage.setItem('userId', String(userId));
    return [jwtToken, userId];
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const getActiveJwt = async () => {
  try {
    const jwtToken = await AsyncStorage.getItem("jwtToken");
    const decoded = JSON.parse(Base64.decode(jwtToken.split('.')[1]));
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime + 10) {
      return refreshToken();
    } else {
      return jwtToken;
    }
  } catch (error) {
    throw error;
  }
};

const refreshToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const userId = await AsyncStorage.getItem('userId');
    const response = await axios.post(`${API_ENDPOINT}/refresh`, {
      patientId: userId,
      token: refreshToken
    });
    const { token } = response.data;
    await AsyncStorage.setItem('jwtToken', token);
    return token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};
