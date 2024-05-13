import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getResourceByUserEndpoint } from '../api';

export const useResource= (userId) => {
  const [resource, setResource] = useState([]);

  useEffect(() => {
    const fetchResources = async () => {
      if (!userId) return;

      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (!token) {
          console.error('JWT token not found');
          return;
        }

        const response = await fetch(getResourceByUserEndpoint(userId), {
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
        setResource(data);
      } catch (error) {
        console.error('Error fetching upcoming appointments:', error.message);
      }
    };

    fetchResources();
  }, [userId]);

  return resource;
};
