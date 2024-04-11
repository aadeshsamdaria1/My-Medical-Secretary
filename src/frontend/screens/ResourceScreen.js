import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { facilities } from './FacilitiesDummyData'; // Import facility data
import FacilityDetailScreen from './FacilityDetailScreen';

const ResourceScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { category } = route.params;
  const [filteredFacilities, setFilteredFacilities] = useState([]);

  useEffect(() => {
    // Filter facilities based on the selected category
    const filtered = facilities.filter(facility => facility.facilityType === category.toUpperCase());
    setFilteredFacilities(filtered);
    navigation.setOptions({ title: `${category}` });
  }, [category]);

  const handleFacilityPress = (facility) => {
    // Navigate to FacilityDetailScreen with facility details
    navigation.navigate('FacilityDetailScreen', { facility });
  };

  const renderFacilityItem = ({ item }) => (
    <TouchableOpacity style={styles.facilityItem} onPress={() => handleFacilityPress(item)}>
      <Text style={styles.facilityName}>{item.name}</Text>
      <Text>{item.address}</Text>
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
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  facilityName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ResourceScreen;