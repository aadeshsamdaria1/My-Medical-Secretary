import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ResourceListScreen from '../screens/ResourceListScreen';
import ResourceScreen from '../screens/ResourceScreen';
import FacilityDetailScreen from '../screens/FacilityDetailScreen';
import DoctorDetailScreen from '../screens/DoctorDetailScreen';
import DoctorsScreen from '../screens/DoctorsScreen';


const Stack = createStackNavigator();

const ResourceNavigator = ( {route} ) => {
    const userId = route.params?.userId;
    return (
        <Stack.Navigator>
            <Stack.Screen name="ResourceListScreen" component={ResourceListScreen} options={{headerShown: false}} initialParams={{ userId: userId }}/>
            <Stack.Screen name="ResourceDetail" component={ResourceScreen}/>
            <Stack.Screen name="FacilityDetailScreen" component={FacilityDetailScreen} />
            <Stack.Screen name="DoctorsScreen" component={DoctorsScreen} options={{ title: 'Doctors' }}/>
            <Stack.Screen name="DoctorDetailScreen" component={DoctorDetailScreen} />
        </Stack.Navigator>
    )
};

export default ResourceNavigator;
