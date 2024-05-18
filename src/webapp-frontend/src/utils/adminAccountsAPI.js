import axios from "axios";
import {
    getAllAdminsEndpoint,
    createAdminEndpoint,
    deleteAdminByIdEndpoint,
    handleRequestError
} from "../api"

  export const getAllAdmins = async () => {
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      const response = await axios.get(getAllAdminsEndpoint, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      return response.data;
    } catch (error) {
      return handleRequestError(error, axios.get, getAllAdminsEndpoint);
    }
  };
  
  export const createAdmin = async (adminData) => {
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      const response = await axios.post(createAdminEndpoint, adminData, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      return response.data;
    } catch (error) {
      return handleRequestError(error, axios.post, createAdminEndpoint, adminData);
    }
  };
  


export const deleteAdminById = async (id) => {
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      const response = await axios.delete(deleteAdminByIdEndpoint(id), {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      return response.data;
    } catch (error) {
      return handleRequestError(error, axios.delete, deleteAdminByIdEndpoint(id));
    }
  };
  


  