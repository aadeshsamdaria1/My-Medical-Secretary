import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo
import ProfileIcon from '../components/ProfileIcon';
import HomeScreen from '../screens/HomeScreen';
import AppointmentScreen from '../screens/AppointmentScreen';
import MessageScreen from '../screens/MessageScreen';
import ResourceScreen from '../screens/ResourceScreen';
import AppointmentStack from './AppointmentStack';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    const userId = 3; // or any other user ID you want to fetch
    return (
        <NavigationContainer>
            <Tab.Navigator 
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: 'white', // Set tab bar background color
                    },
                    headerStyle: {
                        backgroundColor: 'white', // Set header background color
                    },
                    headerTintColor: 'black', // Set header text color
                    headerRight: () => <ProfileIcon />, // Add the HeaderRight component to the header
                }}
            >
                <Tab.Screen 
                    name="HomeScreen"
                    component={HomeScreen} 
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="home" size={size} color={color} />
                        ),
                    }}
                    initialParams={{ userId: userId }}
                />
                <Tab.Screen 
                    name="AppointmentScreen" 
                    component={AppointmentStack} 
                    options={{
                        headerShown: false,
                        title: 'Appointments',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="calendar" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen 
                    name="MessageScreen" 
                    component={MessageScreen} 
                    options={{
                        title: 'Notifications',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="notifications" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen 
                    name="ResourceScreen" 
                    component={ResourceScreen} 
                    options={{
                        title: 'Resources',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="book" size={size} color={color} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};
