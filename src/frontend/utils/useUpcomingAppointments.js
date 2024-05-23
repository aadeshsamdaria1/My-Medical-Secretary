import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAppointmentsByUserEndpoint, getActiveJwt } from '../api';

export const useUpcomingAppointments = (userId) => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    const fetchUpcomingAppointments = async () => {
      if (!userId) return;

      try {
        const token = await getActiveJwt();

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

        const currentDate = new Date();
        const upcomingAppointments = data.filter((appointment) => {
          const appointmentDate = new Date(appointment.startDate);
          return appointmentDate >= currentDate;
        });

        upcomingAppointments.sort((a, b) => {
          const aDate = new Date(a.startDate);
          const bDate = new Date(b.startDate);
          return aDate.getTime() - bDate.getTime();
        });

        setUpcomingAppointments(upcomingAppointments);
      } catch (error) {
        console.error('Error fetching upcoming appointments:', error.message);
      }
    };

    fetchUpcomingAppointments();
  }, [userId]);
  return upcomingAppointments;
};


export const useAllAppointments = (userId) => {
  const [AllAppointments, setAllAppointments] = useState([]);

  useEffect(() => {
    const fetchAllAppointments = async () => {
      if (!userId) return;

      try {
        const token = await getActiveJwt();

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

        setAllAppointments(data);
      } catch (error) {
        console.error('Error fetching upcoming appointments:', error.message);
      }
    };

    fetchAllAppointments();
  }, [userId]);

  return AllAppointments;
};
