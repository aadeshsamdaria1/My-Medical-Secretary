import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getResourceByUserEndpoint, getActiveJwt } from '../api';

export const useResource= (userId) => {
  const [resource, setResource] = useState([]);

  useEffect(() => {
    const fetchResources = async () => {
      if (!userId) return;

      try {
        const token = await getActiveJwt();
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
        console.error('Error fetching Resource by user:', error.message);
      }
    };

    fetchResources();
  }, [userId]);

  return resource;
};
