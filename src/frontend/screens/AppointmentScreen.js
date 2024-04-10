import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import CalendarScreen from "../components/Calendar";
import AppointmentCard from "../components/AppointmentCard";

const AppointmentScreen = () => {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState("");

  const appointments = {
    "2024-03-13": {
      initials: "AA",
      doctorName: "Dr. AaaAaa",
      doctorSpecialty: "Oncologist",
      detail: "Routine checkup",
      reason: "General health.",
      note: "No specific notes",

      time: "10:30:00",
      date: "2024-03-13",
      duration: 60,
      documents: [
        {
          name: "Pre-Treatment Guidelines",
          url: "https://www.google.com/",
        },
        {
          name: "Medication List",
          url: "https://www.google.com/",
        },
      ],
    },
    "2024-04-20": {
      initials: "BB",
      doctorName: "Dr. BbbBbb",
      doctorSpecialty: "Oncologist",
      detail: "Routine checkup",
      reason: "General health.",
      note: "No specific notes",

      time: "10:30:00",
      date: "2024-04-15",
      duration: 60,
      documents: [
        {
          name: "Pre-Treatment Guidelines",
          url: "https://www.google.com/",
        },
        {
          name: "Medication List",
          url: "https://www.google.com/",
        },
      ],
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
      const upcomingAppointments = Object.entries(appointments).filter(
        ([date, _]) => date >= today
      );
      const pastAppointments = Object.entries(appointments).filter(
        ([date, _]) => date < today
      );
      return {
        upcomingAppointments,
        pastAppointments,
        displayOnlyDetails: false,
      };
    }
  };

  const {
    appointmentDetails,
    upcomingAppointments,
    pastAppointments,
    displayOnlyDetails,
  } = displayAppointments();

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
              <Text style={styles.noAppointments}>
                You have no upcoming appointments.
              </Text>
            )}

            {/* Past Appointments Section */}
            <Text style={styles.title}>Past Appointments</Text>
            {pastAppointments.length > 0 ? (
              pastAppointments.map(([date, appointment]) => (
                <AppointmentCard key={date} appointment={appointment} />
              ))
            ) : (
              <Text style={styles.noAppointments}>
                You have no past appointments.
              </Text>
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
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  noAppointments: {
    fontSize: 18, // Larger font for legibility
    color: "#6e6e72", // Subtle gray color used in iOS for informational text
    marginVertical: 20, // More vertical spacing
    alignSelf: "flex-start",
    marginLeft: 20, // Consistent margin with titles
  },
});
