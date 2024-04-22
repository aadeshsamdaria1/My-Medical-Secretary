import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AppointmentScreen from "../screens/AppointmentScreen";
import AppointmentDetailScreen from "../screens/AppointmentDetailScreen";

const Stack = createStackNavigator();

const AppointmentStack = ({ route }) => {
  const { userId } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AppointmentList"
        component={AppointmentScreen}
        initialParams={{ userId }}
        options={{
          title: "Calendar",
          headerTitleAlign: "center",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Stack.Screen
        name="AppointmentDetail"
        component={AppointmentDetailScreen}
        options={{
          title: "Appointment Detail",
          headerTitleAlign: "center",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
    </Stack.Navigator>
  );
};

export default AppointmentStack;
