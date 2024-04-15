import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
// import { facilities } from './FacilitiesDummyData'; // Import facility data TO DELETE
import { getFacilitiesEndpoint } from '../api';

const ResourceScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { category } = route.params;
  const [facilities, setFacilities] = useState([]);
  const [filteredFacilities, setFilteredFacilities] = useState([]);
  

  const fetchAllFacilities = async () => {
    try {
      const response = await fetch(getFacilitiesEndpoint);
      const data = await response.json();
      setFacilities(data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    }
  };
  
  useEffect(() => {
    fetchAllFacilities();
  }, []);

  useEffect(() => {
    // Filter facilities based on the selected category
    const filtered = facilities.filter(facility => facility.facilityType === category.toUpperCase());
    setFilteredFacilities(filtered);
    // Update navigation header title dynamically
    navigation.setOptions({ title: `${category}` });
  }, [category, navigation, facilities]);

  const handleFacilityPress = (facility) => {
    // Navigate to FacilityDetailScreen with facility details
    navigation.navigate('FacilityDetailScreen', { facility });
  };

  const renderFacilityItem = ({ item }) => (
    <TouchableOpacity
      style={styles.facilityItem}
      onPress={() => handleFacilityPress(item)}
    >
      <Text style={styles.facilityName}>{item.name}</Text>
      <Text style={styles.facilityAddress}>{item.address}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredFacilities}
        keyExtractor={(item) => item.name}
        renderItem={renderFacilityItem}
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
    elevation: 2, // Add shadow
  },
  facilityName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  facilityAddress: {
    color: '#666',
  },
});

export default ResourceScreen;
