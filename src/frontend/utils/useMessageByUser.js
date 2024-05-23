import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMessageByUserEndpoint, getActiveJwt } from '../api';

export const useMessage= (userId) => {
  const [message, setMessage] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId) return;

      try {
        const token = await getActiveJwt();
        const response = await fetch(getMessageByUserEndpoint(userId), {
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
        setMessage(data);
      } catch (error) {
        console.error('Error fetching Resource by user:', error.message);
      }
    };

    fetchMessages();
  }, [userId]);

  return message;
};
