import axios from "axios";
import {
  getAllPatientsEndpoint,
  handleRequestError,
  createPatientEndpoint,
  getAllAppointmentByIdEndpoint,
} from "../api";

export const getAllPatients = async () => {
  try {
    const jwtToken = localStorage.getItem("jwtToken");
    const response = await axios.get(getAllPatientsEndpoint, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    return response.data;
  } catch (error) {
    return handleRequestError(error, axios.get, getAllPatientsEndpoint, {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
    });
  }
};

export const createPatient = async (patientData) => {
  try {
    const jwtToken = localStorage.getItem("jwtToken");
    const response = await axios.post(createPatientEndpoint, patientData, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    return handleRequestError(
      error,
      axios.post,
      createPatientEndpoint,
      patientData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );
  }
};

export const updatePatient = async (patientData) => {
  // Implement the update patient API call here
}

export const getAppointmentByPatientId = async (patientId) => {
  try {
    const jwtToken = localStorage.getItem("jwtToken");
    const response = await axios.get(getAllAppointmentByIdEndpoint(patientId), {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    return response.data;
  } catch (error) {
    return handleRequestError(error, axios.get, getAllAppointmentByIdEndpoint(patientId), {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
    });
  }
};
  // Implement the get appointment by patient ID API call here



