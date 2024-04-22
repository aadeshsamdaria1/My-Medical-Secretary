import { useState, useEffect } from 'react';
import { getUserEndpoint } from '../api';

export const useUserDetails = (userId) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch(getUserEndpoint(userId));
        const data = await response.json();
        setUserName(data.firstname);
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    if (userId) fetchUserName();
  }, [userId]);

  return userName;
};
