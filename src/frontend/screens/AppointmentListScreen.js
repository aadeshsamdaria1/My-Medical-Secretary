import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
} from "react-native";
import AppointmentCard from "../components/AppointmentCard";
import { useUpcomingAppointments } from "../utils/useUpcomingAppointments";

const AppointmentListScreen = ({ route }) => {
  const userId = route.params.userId;
  const appointmentsFromApi = useUpcomingAppointments(userId);
  const [showMoreUpcoming, setShowMoreUpcoming] = useState(false);
  const [showMorePast, setShowMorePast] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const upcomingAppointments = appointmentsFromApi
    .filter((appointment) => appointment.startDate.split("T")[0] >= today)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  const pastAppointments = appointmentsFromApi
    .filter((appointment) => appointment.startDate.split("T")[0] < today)
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const renderItem = ({ item, index, section }) => {
    const isUpcoming = section.title === "Upcoming Appointments";
    const shouldShow =
      (isUpcoming && (showMoreUpcoming || index < 2)) ||
      (!isUpcoming && (showMorePast || index < 2));

    return shouldShow ? (
      <AppointmentCard
        testID={`appointment-card-${item.id}`}
        appointment={item}
      />
    ) : null;
  };

  const sections = [
    { title: "Upcoming Appointments", data: upcomingAppointments },
    { title: "Past Appointments", data: pastAppointments },
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

  const renderSectionFooter = ({ section }) => {
    if (section.data.length === 0) {
      return renderEmptyComponent({ section });
    }

    const isUpcoming = section.title === "Upcoming Appointments";
    const showMore = isUpcoming ? showMoreUpcoming : showMorePast;
    const setShowMore = isUpcoming ? setShowMoreUpcoming : setShowMorePast;

    return section.data.length > 2 ? (
      <View style={styles.showMoreButtonContainer}>
        <TouchableOpacity
          style={styles.showMoreButton}
          onPress={() => setShowMore(!showMore)}
        >
          <Text style={styles.showMoreText}>
            {showMore ? "Show Less" : "Show More"}
          </Text>
        </TouchableOpacity>
      </View>
    ) : null;
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSectionFooter}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: "#fff",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 8,
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
  showMoreButtonContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  showMoreButton: {
    backgroundColor: "#007aff",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  showMoreText: {
    fontSize: 14,
    color: "white",
  },
});

export default AppointmentListScreen;