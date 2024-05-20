import { useState, useEffect } from 'react';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendOneTimeCodeEndpoint, activateAccountByEmailEndpoint } from '../api';


export const activateAccountByEmail = async (email) => {
    try {


      const response = await fetch(activateAccountByEmailEndpoint(email), {method: 'POST'});

  
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
  
      const data = response.data;
      return data;
    } catch (error) {
      console.log(error)
      console.error('Error sending password', error.message);
      throw error;
    }
  };