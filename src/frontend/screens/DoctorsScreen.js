import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const DoctorsScreen = () => {
  console.log("doctor")
  const route = useRoute();
  const navigation = useNavigation();
  const doctors = route.params.doctors;
  console.log(doctors)

  const handleDoctorPress = (doctor) => {
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
