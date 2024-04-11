import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FacilityDetailScreen = ({ route }) => {
  const { facility } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: '' });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{facility.name}</Text>
      <Text style={styles.detail}>{facility.address}</Text>
      <Text style={styles.detail}>Contact: {facility.contact}</Text>
      {facility.fax && <Text style={styles.detail}>Fax: {facility.fax}</Text>}
      <Text style={styles.detail}>Website: {facility.website}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#007bff', // Blue color
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default FacilityDetailScreen;
