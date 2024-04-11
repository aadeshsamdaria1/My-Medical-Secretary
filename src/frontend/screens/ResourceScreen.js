import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const ResourceScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { category } = route.params;

  useEffect(() => {
    navigation.setOptions({ headerTitle: category });
  }, [category, navigation]);

  return (
    <View>
      <Text>{category}</Text>
    </View>
  );
};

export default ResourceScreen;
