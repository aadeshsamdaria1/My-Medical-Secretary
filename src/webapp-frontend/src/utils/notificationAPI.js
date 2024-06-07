import axios from "axios";
import {
    getDevceTokenEndpoint,
    sendNotificationEndpoint
  } from "../api";



export const getDeviceTokenByPatientId = async (patientId) => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      const response = await axios.get(getDevceTokenEndpoint(patientId), {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      return response.data;
    } catch (error) {
      console.log("could not retreive expo token for patient")
      return null;
    }
  };
  
  export const sendNotificationToPatient = async (patientId, body) => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      const deviceToken = await getDeviceTokenByPatientId(patientId);
      if (deviceToken === null) {return;};
      const response = await axios.post(sendNotificationEndpoint, {
        deviceToken: deviceToken.deviceToken,
        title: "MMS: New Message",
        body: body
      }, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      return response.data;
    } catch (error) {
      console.log("error sending message")
    }
  };