import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AppointmentDetailScreen = ({ route }) => {
  // Destructure the appointment details from the route params
  const { appointmentDetails } = route.params;

  // Now you can use appointmentDetails to display the information
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{appointmentDetails.title}</Text>
      <Text style={styles.details}>Date: {appointmentDetails.date}</Text>
      <Text style={styles.details}>Time: {appointmentDetails.time}</Text>
      <Text style={styles.details}>Initials: {appointmentDetails.initials}</Text>
      {/* Add more details as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  details: {
    fontSize: 18,
    marginBottom: 5,
  },
  // Add more styles as needed
});

export default AppointmentDetailScreen;

