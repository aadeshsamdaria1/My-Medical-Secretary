import axios from 'axios';


//export const API_ENDPOINT = 'http://mymedicalsecretary.uk.to:8080/api';
//export const API_ENDPOINT = 'http://wombat-mms.ap-southeast-2.elasticbeanstalk.com:8080/api';

export const API_ENDPOINT = 'https://medsecapi.com:444/api';

// API endpoints
export const loginEndpoint = `${API_ENDPOINT}/login`;
export const refreshTokenEndpoint = `${API_ENDPOINT}/refresh`;
export const deleteFacilityEndpoint = `${API_ENDPOINT}/facilities/delete`;
export const createFacilityEndpoint = `${API_ENDPOINT}/facilities/create`;
export const getAllFacilitiesEndpoint = `${API_ENDPOINT}/facilities/get_all`;
export const uploadAppointmentFileEndpoint = `${API_ENDPOINT}/files/upload/appointments`
export const uploadPatientFileEndpoint = `${API_ENDPOINT}/files/upload/patients`
export const deleteDoctorEndpoint = `${API_ENDPOINT}/doctors/delete`;
export const createDoctorEndpoint = `${API_ENDPOINT}/doctors/create`;
export const getAllDoctorsEndpoint = `${API_ENDPOINT}/doctors/get_all`;

export const getAllPatientsEndpoint = `${API_ENDPOINT}/users/get_all_patients`
export const getAllAppointmentByIdEndpoint = (userId) => `${API_ENDPOINT}/appointments/get_all/${userId}`;
export const getDoctorsByIdEndpoint = (userId) => `${API_ENDPOINT}/doctors/get/${userId}`;

// Login function
export const login = async (username, password) => {
  try {
    const response = await axios.post(loginEndpoint, {
      username,
      password
    });
    const { jwtToken, refreshToken, userId } = response.data;
    localStorage.setItem('jwtToken', jwtToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userId', userId)
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


// Function to handle API request errors
export const handleRequestError = async (error, requestFunction, ...args) => {
  // If token expired, try refreshing token and retry the request
  if (error.response && error.response.status === 401) {
    try {
      await refreshToken();
      return await requestFunction(...args);
    } catch (refreshError) {
      console.error('Failed to refresh token:', refreshError);
      throw refreshError;
    }
  } else {
    console.error('Request failed:', error);
    throw error;
  }
};
