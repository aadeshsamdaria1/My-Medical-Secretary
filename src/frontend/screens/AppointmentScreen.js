import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import CalendarScreen from "../components/Calendar";
import AppointmentCard from "../components/AppointmentCard";

const AppointmentScreen = () => {
  const [selectedDate, setSelectedDate] = useState("");

  const appointments = {
    "2024-03-13": {
      initials: "JD",
      title: "Dentist Appointment",
      date: "Wednesday, 13th March",
      time: "10:00 AM",
    },
    "2024-03-15": {
      initials: "JD",
      title: "Chemotherapy",
      date: "Friday, 15th March",
      time: "14:00 PM",
    },
    // Add more appointments here
  };

  const onDaySelect = (day) => {
    setSelectedDate(day.dateString);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Calendar</Text>
        <CalendarScreen markedDates={appointments} onDaySelect={onDaySelect} />
        <Text style={styles.title}>Upcoming Appointments</Text>
        {appointments[selectedDate] && (
          <AppointmentCard appointment={appointments[selectedDate]} />
        )}
        {/* Render other appointments cards based on the selectedDate */}
      </View>
    </ScrollView>
  );
};

export default AppointmentScreen;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10, // Adjust the padding to create space at the top
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    alignSelf: "flex-start",
    marginLeft: 16,
  },
});
