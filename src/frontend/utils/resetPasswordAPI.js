import { useState, useEffect } from 'react';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendOneTimeCodeEndpoint, activateAccountByEmailEndpoint } from '../api';
import axios from 'axios';

export const activateAccountByEmail = async (email) => {
    try {
    const response = await axios.post(activateAccountByEmailEndpoint(email));
      return response.data;
    } catch (error) {
      console.error('Error sending email', error);
      throw error;
    }
  };

export const sendOneTimeCode = async (email, oneTimeCode, password) => {
    try {
      const response = await axios.post(sendOneTimeCodeEndpoint, {
        email,
        oneTimeCode,
        password
      });
  
      const data = response.data;
      return data;
    } catch (error) {
      console.error('Error resetting code', error.message);
      throw error;
    }
  };
