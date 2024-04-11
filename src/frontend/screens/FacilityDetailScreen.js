import React from 'react';
import { View, Text } from 'react-native';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';


const FacilityDetailScreen = ({ route }) => {
  const { facility } = route.params;
  const navigation = useNavigation();


  useEffect (() => {
    navigation.setOptions({ title: '' });
  })

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{facility.name}</Text>
      <Text>{facility.address}</Text>
      <Text>Contact: {facility.contact}</Text>
      {facility.fax && <Text>Fax: {facility.fax}</Text>}
      <Text>Website: {facility.website}</Text>
    </View>
  );
};

export default FacilityDetailScreen;
