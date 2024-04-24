import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import hospitalIcon from '../assets/hospital.png'
import radiologyIcon from '../assets/radiology.png';
import pathologyIcon from '../assets/pathology.png';
import doctorsIcon from '../assets/doctor.png';
import useFacilitiesDetails from '../utils/useFacilitiesDetails';
import useDoctorsByUser from '../utils/useDoctorsByUser';

const categories = [
  { name: "Hospitals", icon: hospitalIcon , identifier: "HOSPITAL"},
  { name: "Radiology", icon: radiologyIcon, identifier: "RADIOLOGY" },
  { name: "Pathology", icon: pathologyIcon, identifier: "PATHOLOGY" },
  { name: "Doctors", icon: doctorsIcon, identifier: "DOCTOR" },
];

const ResourceListScreen = ( {route} ) => {
  const navigation = useNavigation();
  const facilities = useFacilitiesDetails();
  const userId = route.params?.userId;
  const doctors = useDoctorsByUser(userId);

  const handleCategoryPress = (category) => {
    if (category.name == "Doctors") {
      navigation.navigate('DoctorsScreen', {
        userId:userId,
        doctors:doctors
      });
    } else {
      navigation.navigate('ResourceDetail', {
        category: category.identifier,
        options: { headerTitle: category.name },
        facilities: facilities
      });
    }

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