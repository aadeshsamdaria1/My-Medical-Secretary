import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import useFacilitiesDetails from '../utils/useFacilitiesDetails'; // Correct the import statement

const ResourceScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { category } = route.params;
  const facilities = useFacilitiesDetails(); // This hook will fetch and provide the facilities data
  const [filteredFacilities, setFilteredFacilities] = useState([]);

  useEffect(() => {
    // Filter facilities based on the selected category
    const filtered = facilities.filter(facility => facility.facilityType === category.toUpperCase());
    setFilteredFacilities(filtered);
    // Update navigation header title
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
        keyExtractor={(item) => item.id.toString()} // Assuming each facility has a unique 'id'
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
    elevation: 2,
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
