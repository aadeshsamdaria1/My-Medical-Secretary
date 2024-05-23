import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserEndpoint, getActiveJwt } from '../api';

export const useUserDetails = (userId) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      if (!userId) return;

      try {
        const token = await getActiveJwt();

        const response = await fetch(getUserEndpoint(userId), {
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
        setUserName(data.firstname);
      } catch (error) {
        console.error('Error fetching user details:', error.message);
      }
    };

    fetchUserName();
  }, [userId]);

  return userName;
};
