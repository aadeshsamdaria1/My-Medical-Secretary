import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AppointmentScreen from "../screens/AppointmentScreen";
import AppointmentDetailScreen from "../screens/AppointmentDetailScreen";

const Stack = createStackNavigator();

const AppointmentStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AppointmentList"
        component={AppointmentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AppointmentDetail"
        component={AppointmentDetailScreen}
        options={{ title: "Appointment Details" }}
      />
    </Stack.Navigator>
  );
};

export default AppointmentStack;
