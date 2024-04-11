import { useState, useEffect } from 'react';
import { getAppointmentsByUserEndpoint } from '../api';

export const useUpcomingAppointments = (userId) => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    const fetchUpcomingAppointments = async () => {
      try {
        const response = await fetch(getAppointmentsByUserEndpoint(userId));
        const data = await response.json();
        setUpcomingAppointments(data);
      } catch (error) {
        console.error('Error fetching upcoming appointments:', error);
      }
    };

    if (userId) fetchUpcomingAppointments();
  }, [userId]);

  return upcomingAppointments;
};
