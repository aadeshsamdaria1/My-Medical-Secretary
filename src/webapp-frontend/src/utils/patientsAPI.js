import axios from "axios";
import {
  getAllPatientsEndpoint,
  handleRequestError,
  getAllAppointmentByIdEndpoint,
  // getDoctorsByIdEndpoint
} from "../api";

export const getAllPatients = async () => {
  try {
    const jwtToken = localStorage.getItem("jwtToken");
    const response = await axios.get(getAllPatientsEndpoint, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    return response.data;
  } catch (error) {
    return handleRequestError(error, axios.get, getAllPatientsEndpoint);
  }
};

export const getAppointmentByPatientId = async (patientId) => {
  try {
    const jwtToken = localStorage.getItem("jwtToken");
    const response = await axios.get(getAllAppointmentByIdEndpoint(patientId), {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    return response.data;
  } catch (error) {
    return handleRequestError(error, axios.get, getAllAppointmentByIdEndpoint(patientId));
  }
};

