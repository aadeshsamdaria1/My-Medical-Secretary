import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DoctorDetailScreen = ({ route }) => {
  const { doctor } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: '' });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {Object.entries(doctor).map(([key, value]) => (
        <Text key={key} style={styles.detail}>
          {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default DoctorDetailScreen;