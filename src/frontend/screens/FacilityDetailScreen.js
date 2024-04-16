import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FacilityDetailScreen = ({ route }) => {
  const { facility } = route.params;
  const navigation = useNavigation();
  const {id, name, ...otherDetails} = facility;

  useEffect(() => {
    navigation.setOptions({ title: '' });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      {Object.entries(otherDetails).map(([key, value]) => {
        if (value !== null) {
          return (
            <View key={key} style={styles.detailContainer}>
              <Text style={styles.fieldName}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
              <Text style={styles.detail}>{value}</Text>
            </View>
          );
        }
        return null;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    //justifyContent: 'center',
    //alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#007bff', 
    marginBottom: 10,
  },
  detailContainer: {
    marginBottom: 5,
  },
  fieldName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  detail: {
    fontSize: 16,
  },
});
export default FacilityDetailScreen;
