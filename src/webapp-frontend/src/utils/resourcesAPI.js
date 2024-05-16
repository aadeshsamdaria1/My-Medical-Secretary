import axios from "axios";
import {
  getAllResourcesEndpoint,
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
      return handleRequestError(error, axios.get, getAllResourcesEndpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
      });
    }
  };