import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDoctorsByUserEndpoint } from '../api';

const useDoctorsByUser = (userId) => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctorsByUser = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (!token) {
          console.error('JWT token not found');
          return;
        }

        const response = await fetch(getDoctorsByUserEndpoint(userId), {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error.message);
      }
    };

    fetchDoctorsByUser();
  }, [userId]);

  return doctors;
};

export default useDoctorsByUser;
