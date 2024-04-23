import axios from "axios";
import { deleteDoctorEndpoint, createDoctorEndpoint, getAllDoctorsEndpoint, handleRequestError } from "../api";

// Function to fetch doctors data
export const getAllDoctors = async () => {
  try {
    const jwtToken = localStorage.getItem('jwtToken');
    const response = await axios.get(getAllDoctorsEndpoint, {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });
    return response.data;
  } catch (error) {
    return handleRequestError(error, axios.get, getAllDoctorsEndpoint, {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
    });
  }
};

// Function to add a new doctor
export const addDoctor = async (newDoctor) => {
  try {
    const jwtToken = localStorage.getItem('jwtToken');
    const response = await axios.post(createDoctorEndpoint, newDoctor, {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });
    console.log("Doctor added successfully:", response.data);
    return response.data;
  } catch (error) {
    return handleRequestError(error, axios.post, createDoctorEndpoint, newDoctor, {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
    });
  }
};

// Function to delete a doctor by ID
export const deleteDoctor = async (doctorId) => {
  try {
    const jwtToken = localStorage.getItem('jwtToken');
    const response = await axios.delete(`${deleteDoctorEndpoint}/${doctorId}`, {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });
    console.log("Doctor deleted successfully");
    return response.data;
  } catch (error) {
    return handleRequestError(error, axios.delete, `${deleteDoctorEndpoint}/${doctorId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
    });
  }
};

// Function to update a doctor
export const updateDoctor = async (updatedDoctor) => {
  try {
    //await deleteDoctor(updatedDoctor.id);
    const response = await addDoctor(updatedDoctor);

    console.log("Doctor updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.log('Failed to update Doctor:', error);
    throw error;
  }
};