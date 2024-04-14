import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Doctors } from './DummyDoctors';


const getDoctorsByUserId = (userId) => {
      return Doctors;
}

const DoctorsScreen = ( ) => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params;
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Fetch doctors for the user using the userId
    const fetchDoctors = async () => {
      try {
        const doctorsData = await getDoctorsByUserId(userId);
        setDoctors(doctorsData);
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
      style={styles.facilityItem}
      onPress={() => handleDoctorPress(item)}
    >
      <Text style={styles.facilityName}>{item.name}</Text>
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
  facilityItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  facilityName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
});


export default DoctorsScreen;
