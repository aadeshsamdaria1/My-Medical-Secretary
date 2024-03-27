import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import ResourceScreen from './screens/ResourceScreen';
// import MessagePage from './pages/MessagePage';
// import ApplicationPage from './pages/ApplicationPage';
import TabNavigator from './navigation/TabNavigator';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <TabNavigator/>
  );
}