import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import CalendarScreen from "../components/Calendar";
import AppointmentCard from "../components/AppointmentCard";

const AppointmentScreen = () => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState("");

  const appointments = {
    "2024-03-13": {
      initials: "AA",
      title: "Chemothrapy",
      date: "Wednesday, 13th March",
      time: "10:00 AM",
    },
    "2024-02-16": {
      initials: "BB",
      title: "Chemotherapy",
      date: "Friday, 16th February",
      time: "10:00 PM",
    },
    "2024-04-20": {
      initials: "CC",
      title: "Chemothrapy",
      date: "Monday, 20th April",
      time: "10:00 AM",
    },
    // Add more appointments here
  };

  const onDaySelect = (day) => {
    setSelectedDate(day.dateString);
  };

  // Determine what to display based on the selected date
  const displayAppointments = () => {
    if (selectedDate && appointments[selectedDate]) {
      // If a specific date with an appointment is selected, prepare to display only that appointment
      return {
        appointmentDetails: [appointments[selectedDate]],
        displayOnlyDetails: true,
      };
    } else {
      // If no specific date is selected or the selected date has no appointments, show upcoming and past appointments
      const upcomingAppointments = Object.entries(appointments).filter(([date, _]) => date >= today);
      const pastAppointments = Object.entries(appointments).filter(([date, _]) => date < today);
      return {
        upcomingAppointments,
        pastAppointments,
        displayOnlyDetails: false,
      };
    }
  };

  const { appointmentDetails, upcomingAppointments, pastAppointments, displayOnlyDetails } = displayAppointments();

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Calendar</Text>
        <CalendarScreen markedDates={appointments} onDaySelect={onDaySelect} />

        {/* Display only the Appointment Details section if a date with an appointment is selected */}
        {displayOnlyDetails ? (
          <>
            <Text style={styles.title}>Appointment Details</Text>
            {appointmentDetails.map((appointment, index) => (
              <AppointmentCard key={index} appointment={appointment} />
            ))}
          </>
        ) : (
          <>
            {/* Upcoming Appointments Section */}
            <Text style={styles.title}>Upcoming Appointments</Text>
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map(([date, appointment]) => (
                <AppointmentCard key={date} appointment={appointment} />
              ))
            ) : (
              <Text style={styles.noAppointments}>You have no upcoming appointments.</Text>
            )}

            {/* Past Appointments Section */}
            <Text style={styles.title}>Past Appointments</Text>
            {pastAppointments.length > 0 ? (
              pastAppointments.map(([date, appointment]) => (
                <AppointmentCard key={date} appointment={appointment} />
              ))
            ) : (
              <Text style={styles.noAppointments}>You have no past appointments.</Text>
            )}
          </>
        )}
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
    paddingTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    alignSelf: "flex-start",
    marginLeft: 16,
  },
  noAppointments: {
    fontSize: 16,
    color: "gray",
    marginVertical: 16,
    alignSelf: "flex-start",
    marginLeft: 16,
  },
});




