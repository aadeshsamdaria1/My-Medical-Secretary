import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


//export const API_ENDPOINT = 'http://mymedicalsecretary.uk.to:8080/api';
//export const API_ENDPOINT = 'https://wombat-mms.ap-southeast-2.elasticbeanstalk.com:8080/api';



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
    return [jwtToken, userId];
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
