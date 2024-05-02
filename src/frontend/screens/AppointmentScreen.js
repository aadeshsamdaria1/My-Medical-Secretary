import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AppointmentCalendar from "../components/Calendar";
import AppointmentCard from "../components/AppointmentCard";
import { useUpcomingAppointments } from "../utils/useUpcomingAppointments";

const AppointmentScreen = ({route}) => {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState("");

  
  const userId = route.params.userId;
  const appointmentsFromApi = useUpcomingAppointments(userId);

  const onDaySelect = (day) => {
    setSelectedDate(day.dateString);
  };

  const displayAppointments = () => {
    const formattedAppointments = appointmentsFromApi.map((appointment) => ({
      date: appointment.startDate.split("T")[0], 
      ...appointment,
    }));

    if (selectedDate) {
      const appointmentDetails = formattedAppointments.filter(
        (appointment) => appointment.date === selectedDate
      );
      return {
        appointmentDetails,
        displayOnlyDetails: appointmentDetails.length > 0,
      };
    } else {
      const upcomingAppointments = formattedAppointments.filter(
        ({ date }) => date >= today
      );
      const pastAppointments = formattedAppointments.filter(
        ({ date }) => date < today
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
        <AppointmentCalendar
          appointmentsFromApi={appointmentsFromApi}
          onDaySelect={onDaySelect}
          testID="calendar"
        />

        {displayOnlyDetails ? (
          <>
            <Text style={styles.title}>Appointment Details</Text>
            {appointmentDetails.map((appointment, index) => (
              <AppointmentCard testID={`appointment-card-${appointment.id}`} key={index} appointment={appointment} />
            ))}
          </>
        ) : (
          <>
            <Text style={styles.title}>Upcoming Appointments</Text>
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment, index) => (
                <AppointmentCard testID={`appointment-card-${appointment.id}`} key={index} appointment={appointment} />
              ))
            ) : (
              <Text style={styles.noAppointments}>
                You have no upcoming appointments.
              </Text>
            )}

            <Text style={styles.title}>Past Appointments</Text>
            {pastAppointments.length > 0 ? (
              pastAppointments.map((appointment, index) => (
                <AppointmentCard testID={`appointment-card-${appointment.id}`} key={index} appointment={appointment} />
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
    fontSize: 16, 
    color: "#6e6e72", 
    marginVertical: 10, 
    alignSelf: "flex-start",
    marginLeft: 20, 
  },
});

export default AppointmentScreen;
