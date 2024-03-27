import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen'
import AppointmentScreen from '../screens/AppointmentScreen'
import MessageScreen from '../screens/MessageScreen'
import ResourceScreen from '../screens/ResourceScreen'

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false}}/>
                <Tab.Screen name= "AppointmentScreen" component={AppointmentScreen} options={{headerShown: false}}/>
                <Tab.Screen name="MessageScreen" component={MessageScreen} options={{headerShown: false}}/>
                <Tab.Screen name="ResourceScreen" component={ResourceScreen} options={{headerShown: false}}/>
            </Tab.Navigator>
        </NavigationContainer>
    )
};


