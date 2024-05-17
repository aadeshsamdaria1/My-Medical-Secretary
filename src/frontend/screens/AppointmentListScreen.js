import React from "react";
import { View, Text, StyleSheet, SectionList } from "react-native";
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
    <AppointmentCard
      testID={`appointment-card-${item.id}`}
      key={index}
      appointment={item}
    />
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const renderItem = ({ item, index }) => (
    <AppointmentCard
      testID={`appointment-card-${item.id}`}
      key={index}
      appointment={item}
    />
  );

  const sections = [
    {
      title: "Upcoming Appointments",
      data: upcomingAppointments,
    },
    {
      title: "Past Appointments",
      data: pastAppointments,
    },
  ];

  const renderEmptyComponent = ({ section }) => {
    if (section.title === "Upcoming Appointments") {
      return (
        <Text style={styles.emptyText}>You have no upcoming appointments.</Text>
      );
    } else if (section.title === "Past Appointments") {
      return <Text style={styles.emptyText}>You have no past appointments.</Text>;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={({ section }) =>
          section.data.length === 0 && renderEmptyComponent({ section })
        }
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#f2f2f2",
    padding: 8,
    paddingLeft: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  listContainer: {
    flex: 1,
  },
});

export default AppointmentListScreen;
