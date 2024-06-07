import axios from 'axios';



//export const API_ENDPOINT = 'http://mymedicalsecretary.uk.to:8080/api';
//export const API_ENDPOINT = 'http://wombat-mms.ap-southeast-2.elasticbeanstalk.com:8080/api';

export const API_ENDPOINT = 'https://medsecapi.com:444/api';


// API endpoints
export const loginEndpoint = `${API_ENDPOINT}/login`;
export const refreshTokenEndpoint = `${API_ENDPOINT}/refresh`;

export const uploadAppointmentFileEndpoint = `${API_ENDPOINT}/files/upload/appointments`
export const uploadPatientFileEndpoint = `${API_ENDPOINT}/files/upload/patients`

export const deleteFacilityEndpoint = `${API_ENDPOINT}/facilities/delete`;
export const createFacilityEndpoint = `${API_ENDPOINT}/facilities/create`;
export const getAllFacilitiesEndpoint = `${API_ENDPOINT}/facilities/get_all`;

export const deleteDoctorEndpoint = `${API_ENDPOINT}/doctors/delete`;
export const createDoctorEndpoint = `${API_ENDPOINT}/doctors/create`;
export const getAllDoctorsEndpoint = `${API_ENDPOINT}/doctors/get_all`;
export const getDoctorsByIdEndpoint = (userId) => `${API_ENDPOINT}/doctors/get/${userId}`;

export const getAllPatientsEndpoint = `${API_ENDPOINT}/users/get_all_patients`
export const getAllAppointmentByIdEndpoint = (userId) => `${API_ENDPOINT}/appointments/get_all/${userId}`;

export const getAllAdminsEndpoint = `${API_ENDPOINT}/users/get_all_admins`;
export const createAdminEndpoint = `${API_ENDPOINT}/users/create_admin`;
export const deleteAdminByIdEndpoint = (adminId) => `${API_ENDPOINT}/users/delete_admin/${adminId}`;


export const getAllResourcesEndpoint = `${API_ENDPOINT}/resources/get_all`;
export const createResourceEndpoint = `${API_ENDPOINT}/resources/create`;
export const deleteResourceEndpoint = `${API_ENDPOINT}/resources/delete`;
export const addPatientToResourceEndpoint = `${API_ENDPOINT}/resources/add_patient_to_resource`;
export const removePatientFromResourceEndpoint = `${API_ENDPOINT}/resources/remove_patient_from_resource`;

export const sendMessageToPatientEndpoint = `${API_ENDPOINT}/messages/sendMessage`;
export const getAllMessagesByPatient = (patientId) => `${API_ENDPOINT}/messages/getMessages/${patientId}`;
export const deleteMessageByIdEndpoint = (messageId) => `${API_ENDPOINT}/messages/delete/${messageId}`;

export const getDevceTokenEndpoint = (patientId) =>`${API_ENDPOINT}/notifications/deviceToken/${patientId}`;
export const sendNotificationEndpoint = `${API_ENDPOINT}/notifications/send`;

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

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axios.post(refreshTokenEndpoint, {token:refreshToken, patientId:1});
    const { token } = response.data;
    localStorage.setItem('jwtToken', token);
    return token;
  } catch (error) {
    // should logout patient
    console.error('Token refresh failed:', error);
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');

    throw error;
  }
};



export const handleRequestError = async (error, requestFunction, endpoint, ...args) => {
  // If token expired, try refreshing token and retry the request
  if (error.response && error.response.status === 401) {
    try {
      console.log("401 error (token expired), fetching new token")
      const  newToken = await refreshToken();
      let toReturn;
      if (args.length === 0) {
        toReturn = await requestFunction(endpoint, {headers: { Authorization: `Bearer ${newToken}` }});
      } else {
        toReturn = await requestFunction(endpoint, args[0], {headers: { Authorization: `Bearer ${newToken}` }});
      }
      return toReturn.data
    } catch (refreshError) {
      console.error('Failed to refresh token:', refreshError);
      throw refreshError;
    }
  } else {
    console.error('Request failed:', error);
    throw error;
  }
};
