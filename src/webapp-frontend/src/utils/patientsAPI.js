import axios from 'axios';
import { getAllPatientsEndpoint, handleRequestError, getAppointmentsbyUserIdEndpoint } from '../api'; //

// Function to get all patients
export const getAllPatients = async () => {
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      const response = await axios.get(getAllPatientsEndpoint, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      return response.data;
    } catch (error) {
      return handleRequestError(error, axios.get, getAllPatientsEndpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
      });
    }
  };
  

// Function to get all appointments by patient ID
export const getPatientAppointments = async (patientId) => {
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      const response = await axios.get(`${getAppointmentsbyUserIdEndpoint}/${patientId}`, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      return response.data;
    } catch (error) {
      return handleRequestError(error, axios.get, `${getAppointmentsbyUserIdEndpoint}/${patientId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
      });
    }
  };
  

  