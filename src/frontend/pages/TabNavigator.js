import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo
import { TouchableOpacity, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import AppointmentScreen from '../screens/AppointmentScreen';
import MessageScreen from '../screens/MessageScreen';
import ResourceScreen from '../screens/ResourceScreen';

const Tab = createBottomTabNavigator();

const LogoutButton = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    // Perform logout logic here
    navigation.navigate('Login');
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.headerLeft}>
      <Ionicons name="log-out" size={32} color="grey" style={styles.flipIcon} />
    </TouchableOpacity>
  );
};

export default function TabNavigator() {
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
        headerLeft: () => <LogoutButton />,
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
      />
      <Tab.Screen
        name="AppointmentScreen"
        component={AppointmentScreen}
        options={{
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
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    marginLeft: 16,
  },
  flipIcon: {
    transform: [{ scaleX: -1 }],
  },
});
