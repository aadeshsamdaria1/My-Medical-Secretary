import axios from "axios";
import {
  getAllResourcesEndpoint,
  createResourceEndpoint,
  deleteResourceEndpoint,
  addPatientToResourceEndpoint,
  removePatientFromResourceEndpoint,
  handleRequestError
} from "../api";

export const getAllResources = async () => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      const response = await axios.get(getAllResourcesEndpoint, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      return response.data;
    } catch (error) {
      return handleRequestError(error, axios.get, getAllResourcesEndpoint);
    }
};

export const addResource = async (newResource) => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      const response = await axios.post(createResourceEndpoint, newResource, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      console.log("Resource added successfully:", response.data);
      return response.data;
    } catch (error) {
      return handleRequestError(error, axios.post, createResourceEndpoint, newResource);
    }
};
  
  export const deleteResource = async (resourceId) => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      const response = await axios.delete(`${deleteResourceEndpoint}/${resourceId}`, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      console.log("Resource deleted successfully");
      return response.data;
    } catch (error) {
      return handleRequestError(error, axios.delete, `${deleteResourceEndpoint}/${resourceId}`);
    }
  };

export const addPatientToResource = async (resourceId, patientId) => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      const response = await axios.post(addPatientToResourceEndpoint, {
        resourceId: resourceId,
        patientId: patientId
      }, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      console.log("Patient added to resource successfully");
      return response.data;
    } catch (error) {
      return handleRequestError(error, axios.post, addPatientToResourceEndpoint, {
        resourceId: resourceId,
        patientId: patientId
      });
    }
  };
  
export const removePatientFromResource = async (resourceId, patientId) => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      const response = await axios.post(removePatientFromResourceEndpoint, {
        resourceId: resourceId,
        patientId: patientId
      }, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      console.log("Patient removed from resource successfully");
      return response.data;
    } catch (error) {
      return handleRequestError(error, axios.post, removePatientFromResourceEndpoint, {
        resourceId: resourceId,
        patientId: patientId
      });
    }
  };