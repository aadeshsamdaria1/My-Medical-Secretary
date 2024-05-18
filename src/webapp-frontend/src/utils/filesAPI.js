import axios from 'axios';
import { handleRequestError, uploadAppointmentFileEndpoint, uploadPatientFileEndpoint } from '../api'; //

export const uploadAppointmentFile = async (file) => {
  try {
    const jwtToken = localStorage.getItem('jwtToken');
    const formData = new FormData(); 
    formData.append('file', file);

    const response = await axios.post(uploadAppointmentFileEndpoint, formData, {
      headers: { Authorization: `Bearer ${jwtToken}`, 'Content-Type': 'multipart/form-data' }
    });

    return response.data;
  } catch (error) {
    const formData = new FormData(); 
    formData.append('file', file);
    return handleRequestError(error, axios.post, uploadAppointmentFileEndpoint, formData, {
      headers: {'Content-Type': 'multipart/form-data' }
    });
  }
};

export const uploadPatientFile = async (file) => {
  try {
    const jwtToken = localStorage.getItem('jwtToken');
    const formData = new FormData(); 
    formData.append('file', file);

    const response = await axios.post(uploadPatientFileEndpoint, formData, {
      headers: { Authorization: `Bearer ${jwtToken}`, 'Content-Type': 'multipart/form-data' }
    });

    return response.data;
  } catch (error) {
    const formData = new FormData(); 
    formData.append('file', file);
    return handleRequestError(error, axios.post, uploadPatientFileEndpoint, formData, {
      headers: {'Content-Type': 'multipart/form-data' }
    });
  }
};
