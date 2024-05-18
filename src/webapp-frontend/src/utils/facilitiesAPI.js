import { deleteFacilityEndpoint, createFacilityEndpoint, getAllFacilitiesEndpoint, handleRequestError } from "../api";
import axios from "axios";

// Hacky solution to update a facility
export const updateFacility = async (id, updatedFacilityData) => {
  try {
    // First, delete the old facility
    await deleteFacilityById(id);
    // Then, create a new facility with the updated data
    const response = await createFacility(updatedFacilityData);
    console.log("Facility updated successfully");
    return response.data;
  } catch (error) {
    console.error('Failed to update facility:', error);
    throw error;
  }
};
// Function to delete facility by ID
export const deleteFacilityById = async (id) => {
  try {
    const jwtToken = localStorage.getItem('jwtToken');
    const response = await axios.delete(`${deleteFacilityEndpoint}/${id}`, {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });
    return response.data;
  } catch (error) {
    return handleRequestError(error, axios.delete, `${deleteFacilityEndpoint}/${id}`);
  }
};

// Function to create a facility
export const createFacility = async (facilityData) => {
  try {
    const jwtToken = localStorage.getItem('jwtToken');
    const response = await axios.post(createFacilityEndpoint, facilityData, {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });
    console.log(response)
    return response.data;
  } catch (error) {
    return handleRequestError(error, axios.post, createFacilityEndpoint, facilityData);
  }
};

// Function to get all facilities
export const getAllFacilities = async () => {
  try {
    const jwtToken = localStorage.getItem('jwtToken');
    const response = await axios.get(getAllFacilitiesEndpoint, {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });
    return response.data;
  } catch (error) {
    return handleRequestError(error, axios.get, getAllFacilitiesEndpoint);
  }
};

