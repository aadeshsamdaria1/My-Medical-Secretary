import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ResourceListScreen from '../screens/ResourceListScreen';
import ResourceScreen from '../screens/ResourceScreen';
import FacilityDetailScreen from '../screens/FacilityDetailScreen';


const Stack = createStackNavigator();

const ResourceNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ResourceListScreen" component={ResourceListScreen} options={{headerShown: false}}/>
            <Stack.Screen name="ResourceDetail" component={ResourceScreen}/>
            <Stack.Screen name="FacilityDetailScreen" component={FacilityDetailScreen} />
        </Stack.Navigator>
    )
};

export default ResourceNavigator;
