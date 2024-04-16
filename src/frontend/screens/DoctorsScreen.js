import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Doctors } from './DummyDoctors';
import { getDoctorsByUserEndpoint } from '../api';


const DoctorsScreen = ( ) => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params;
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Fetch doctors for the user using the userId
    const fetchDoctors = async () => {
      try {
        const response = await fetch(getDoctorsByUserEndpoint(userId));
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, [userId]);

  const handleDoctorPress = (doctor) => {
    // Navigate to DoctorDetailScreen with doctor details
    navigation.navigate('DoctorDetailScreen', { doctor });
  };

  const renderDoctorItem = ({ item }) => (
    <TouchableOpacity
      style={styles.doctorItem}
      onPress={() => handleDoctorPress(item)}
    >
      <Text style={styles.doctorName}>{item.name}</Text>
      <Text style={styles.doctorExpertise}>{item.expertise}</Text>
      
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderDoctorItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  doctorItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  doctorName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  doctorExpertise: {
    fontSize: 16,
    marginBottom: 5
  }
});


export default DoctorsScreen;
