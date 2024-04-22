import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo
import ProfileIcon from '../components/ProfileIcon';
import HomeScreen from '../screens/HomeScreen';
import MessageScreen from '../screens/MessageScreen';
import ResourceNavigator from './ResourceNavigator';
import AppointmentStack from './AppointmentStack';

const Tab = createBottomTabNavigator();

export default function TabNavigator({ route, navigation }) {
    // const userId = route.params?.userId;
    userId = '421';
    return (
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
                    headerLeft: () => (
                      <Ionicons
                        name="log-out-outline"
                        size={30}
                        color="black"
                        style={{ 
                          marginLeft: 16,
                          transform: [{ scaleX: -1 }], // Flip the icon horizontally
                          fontWeight: 'bold', }}
                        onPress={() => navigation.navigate('Login')}
                      />
                    ),
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
                        title: 'Appointments',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="calendar" size={size} color={color} />
                        ),
                    }}
                    initialParams={{ userId: userId }}
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
                    component={ResourceNavigator} 
                    options={{
                        title: 'Resources',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="book" size={size} color={color} />
                        ),
                    }}
                    initialParams={{ userId : userId}}
                />
            </Tab.Navigator>
    );
};
