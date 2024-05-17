import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import AppointmentCard from "../components/AppointmentCard";
import { useUpcomingAppointments } from "../utils/useUpcomingAppointments";


const AppointmentListScreen = ({ route }) => {
  const userId = route.params.userId;
  const appointmentsFromApi = useUpcomingAppointments(userId);

  const today = new Date().toISOString().split("T")[0];

  const upcomingAppointments = appointmentsFromApi
    .filter((appointment) => appointment.startDate.split("T")[0] >= today)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  const pastAppointments = appointmentsFromApi
    .filter((appointment) => appointment.startDate.split("T")[0] < today)
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  const renderAppointmentCard = ({ item, index }) => (
    <AppointmentCard testID={`appointment-card-${item.id}`} key={index} appointment={item} />
  );

  const renderEmptyUpcomingAppointments = () => (
    <Text style={styles.emptyText}>You have no upcoming appointments.</Text>
  );

  const renderEmptyPastAppointments = () => (
    <Text style={styles.emptyText}>You have no past appointments.</Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Appointments</Text>
      {upcomingAppointments.length > 0 ? (
        <FlatList
          data={upcomingAppointments}
          renderItem={renderAppointmentCard}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        renderEmptyUpcomingAppointments()
      )}

      <Text style={styles.title}>Past Appointments</Text>
      {pastAppointments.length > 0 ? (
        <FlatList
          data={pastAppointments}
          renderItem={renderAppointmentCard}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        renderEmptyPastAppointments()
      )}
    </View>
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
    marginBottom: 8,
    marginLeft: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 16,
  },
});

export default AppointmentListScreen;