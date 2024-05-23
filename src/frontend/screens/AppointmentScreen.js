import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AppointmentCalendar from "../components/Calendar";
import AppointmentCard from "../components/AppointmentCard";
import AppointmentListScreen from "./AppointmentListScreen";
import { useUpcomingAppointments } from "../utils/useUpcomingAppointments";

const Tab = createMaterialTopTabNavigator();

const AppointmentScreen = ({ route }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const userId = route.params.userId;
  const [selectedMonth, setSelectedMonth] = useState( new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  

  const onDaySelect = (day) => {
    setSelectedDate(day.dateString);
  };

  const onMonthChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };


  const CalendarTab = () => {
    const appointmentsFromApi = useUpcomingAppointments(userId);
    const selectedAppointments = appointmentsFromApi.filter(
      (appointment) => appointment.startDate.split("T")[0] === selectedDate
    );

    const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : '';
  
    return (
      <View style={styles.container}>
        <AppointmentCalendar
          appointmentsFromApi={appointmentsFromApi}
          onDaySelect={onDaySelect}
          onMonthChange={onMonthChange}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          testID="calendar"
        />
        {selectedDate ? (
          <>
            <Text style={styles.title}>{formattedDate}.</Text>
            {selectedAppointments.length > 0 ? (
              selectedAppointments.map((appointment, index) => (
                <AppointmentCard
                  testID={`appointment-card-${appointment.id}`}
                  key={index}
                  appointment={appointment}
                />
              ))
            ) : (
              <Text style={styles.defaultText}>You have no appointments 🥰.</Text>
            )}
          </>
        ) : (
          <Text style={styles.defaultText}>Tap a date to view appointments ☺️!</Text>
        )}
      </View>
    );
  
  };

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Calendar"
        component={CalendarTab}
        options={{ title: "Calendar" }}
      />
      <Tab.Screen
        name="List"
        component={AppointmentListScreen}
        initialParams={{ userId }}
        options={{ title: "List" }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 16,
  },
  defaultText: {
    fontSize: 18,
    marginTop: 24,
    marginHorizontal: 16,
    textAlign: "center",
  },
});

export default AppointmentScreen;