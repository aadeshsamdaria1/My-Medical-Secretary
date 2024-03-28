import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabNavigator from './navigation/TabNavigator';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <TabNavigator/>
  );
}