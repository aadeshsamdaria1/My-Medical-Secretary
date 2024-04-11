import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ResourceScreen from './ResourceScreen';
import { TouchableOpacity } from 'react-native';

const categories = ["Hospitals", "Radiology", "Pathology", "Doctors", "Additional Links"];

const ResourceListScreen = () => {
  const navigation = useNavigation();

  const handleCategoryPress = (category) => {
    navigation.navigate('ResourceDetail', {
      category,
      // Set options for the ResourceDetail screen
      options: { headerTitle: category }
    });
  };

  return (
    <View style={styles.container}>
      {categories.map((category, index) => (
        <TouchableOpacity key={index} onPress={() => handleCategoryPress(category)} style={styles.card}>
          <View style={styles.iconWrapper}>
            <Text style={styles.iconText}>{category.charAt(0)}</Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.title}>{category}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ResourceListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3, 
  },
  iconWrapper: {
    backgroundColor: '#4F8EF7',
    borderRadius: 25, 
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  iconText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  details: {
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
});