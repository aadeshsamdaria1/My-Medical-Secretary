import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { onViewDoctorLocation } from '../utils/appointmentFunctions';

const DoctorDetailScreen = ({ route }) => {
  const { doctor } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: '' });
  }, [navigation]);

  const { id, name, expertise, ...otherDetails } = doctor; 

  return (
    <View style={styles.container}>
      <Text style={styles.doctorName}>{name}</Text>
      <Text style={styles.sectionTitle}>Expertise: {expertise}</Text>
      <View style={styles.detailsContainer}>
        {Object.entries(otherDetails).map(([key, value]) => (
          <View key={key} style={styles.detailItem}>
            <Text style={[styles.detailLabel, styles.bold]}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </Text>
            <Text style={styles.detailValue}>{value}</Text>
          </View>
        ))}
        {doctor.address && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => onViewDoctorLocation(doctor.address)}
        >
          <Text style={styles.buttonText}>View Location</Text>
        </TouchableOpacity>
      )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  doctorName: {
    fontWeight: 'bold',
    fontSize: 30, 
    color: '#007bff', 
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 22, 
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  detailsContainer: {
    width: '100%',
  },
  detailItem: {
    marginBottom: 8, 
  },
  detailLabel: {
    fontSize: 18, 
  },
  detailValue: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007aff",
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    textTransform: "none",
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DoctorDetailScreen;