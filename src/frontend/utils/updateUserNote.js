import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, StyleSheet } from "react-native";
import { updateUserNoteEndpoint } from "../api";

export const updateUserNote = async (appointmentId, note) => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        console.error('JWT token not found');
        return;
      }

  
      const response = await fetch(updateUserNoteEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': "application/json"
        },
        body: JSON.stringify({ appointmentId: appointmentId, note: note })
      });

  
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
  
      const data = await response;
      
      //console.log('User note updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error updating user note:', error.message);
      throw error;
    }
  };