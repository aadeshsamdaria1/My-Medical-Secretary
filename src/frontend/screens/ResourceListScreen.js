import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import hospitalIcon from '../assets/hospital.png'
import radiologyIcon from '../assets/radiology.png';
import pathologyIcon from '../assets/pathology.png';
import doctorsIcon from '../assets/doctor.png';
import additionalLinksIcon from '../assets/links.png';

const categories = [
  { name: "Hospitals", icon: hospitalIcon },
  { name: "Radiology", icon: radiologyIcon },
  { name: "Pathology", icon: pathologyIcon },
  { name: "Doctors", icon: doctorsIcon },
  { name: "Additional Links", icon: additionalLinksIcon },
];

const ResourceListScreen = () => {
  const navigation = useNavigation();

  const handleCategoryPress = (category) => {
    navigation.navigate('ResourceDetail', {
      category: category.name,
      // Set options for the ResourceDetail screen
      options: { headerTitle: category.name }
    });
  };

  return (
    <View style={styles.container}>
      {categories.map((category, index) => (
        <TouchableOpacity key={index} onPress={() => handleCategoryPress(category)} style={styles.card}>
          <View style={styles.iconWrapper}>
            <Image source={category.icon} style={styles.iconImage} />
          </View>
          <View style={styles.details}>
            <Text style={styles.title}>{category.name}</Text>
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
  details: {
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20 ,
    marginBottom: 4,
  },
  iconWrapper: {
    backgroundColor: '#4F8EF7',
    borderRadius: 25,
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    overflow: 'hidden', 
  },
  iconImage: {
    width: '70%',
    height: '70%',
    resizeMode: 'contain', 
    tintColor: '#FFFFFF'
  },
});