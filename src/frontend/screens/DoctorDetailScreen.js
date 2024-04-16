import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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
});

export default DoctorDetailScreen;