import axios from 'axios';
import { getAllPatientsEndpoint, handleRequestError } from '../api'; //

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
  
  