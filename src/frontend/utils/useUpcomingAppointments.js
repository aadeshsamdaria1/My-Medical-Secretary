import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAppointmentsByUserEndpoint } from '../api';

export const useUpcomingAppointments = (userId) => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    const fetchUpcomingAppointments = async () => {
      console.log("fetchingApontments")
      if (!userId) return;

      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (!token) {
          console.error('JWT token not found');
          return;
        }

        const response = await fetch(getAppointmentsByUserEndpoint(userId), {
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
        setUpcomingAppointments(data);
      } catch (error) {
        console.error('Error fetching upcoming appointments:', error.message);
      }
    };

    fetchUpcomingAppointments();
  }, [userId]);
  return upcomingAppointments;
};
