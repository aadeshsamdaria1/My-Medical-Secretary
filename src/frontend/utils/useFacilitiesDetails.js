import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFacilitiesEndpoint } from '../api';

const useFacilitiesDetails = () => {
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    const fetchAllFacilities = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (!token) {
          console.error('JWT token not found');
          return;
        }

        const response = await fetch(getFacilitiesEndpoint, {
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
        setFacilities(data);
      } catch (error) {
        console.error('Error fetching facilities:', error.message);
      }
    };

    fetchAllFacilities();
  }, []);

  return facilities;
};

export default useFacilitiesDetails;
