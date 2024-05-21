import axios from "axios";
import {
  sendMessageToPatientEndpoint,
  getAllMessagesByPatient,
  deleteMessageByIdEndpoint,
  handleRequestError,
} from "../api";

export const sendMessage = async (newMessage) => {
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      const response = await axios.post(sendMessageToPatientEndpoint, newMessage, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      console.log("Message added successfully:", response.data);
      return response.data;
    } catch (error) {
      return handleRequestError(error, axios.post, sendMessageToPatientEndpoint, newMessage);
    }
  };
  
  export const getMesssages = async (patientId) => {
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      const response = await axios.get(getAllMessagesByPatient(patientId), {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      console.log("Messages received successfully:", response.data);
      return response.data;
    } catch (error) {
      return handleRequestError(error, axios.post, getAllMessagesByPatient(patientId));
    }
  };
  
  export const deleteMessage = async (messageId) => {
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      const response = await axios.delete(deleteMessageByIdEndpoint(messageId), {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      console.log("Message deleted successfully");
      return response.data;
    } catch (error) {
      return handleRequestError(error, axios.delete, deleteMessageByIdEndpoint(messageId));
    }
  };