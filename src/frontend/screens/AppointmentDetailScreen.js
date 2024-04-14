import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  onDocumentPress,
  shareAppointmentDetails,
  addAppointmentToCalendar,
  onViewDoctorLocation,
  getFormattedTime,
} from "../utils/appointmentFunctions";

const AppointmentDetailScreen = ({ route }) => {
  const { appointmentDetails } = route.params;
  const [isConfirmed, setIsConfirmed] = React.useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="person-outline" size={24} style={styles.iconStyle} />
          <Text style={styles.sectionTitle}>
            DR. {appointmentDetails.doctor.name}
          </Text>

          {appointmentDetails.status === "UNCONFIRMED" && (
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>Unconfirmed</Text>
            </View>
          )}
          {appointmentDetails.status === "CONFIRMED" && (
            <View style={styles.confirmBadge}>
              <Text style={styles.statusBadgeText}>Confirmed</Text>
            </View>
          )}
        </View>
        <View>
          <Text style={styles.sectionContent}>
            {appointmentDetails.doctor.expertise}
          </Text>
          <TouchableOpacity
            onPress={() => {
              onViewDoctorLocation(appointmentDetails);
            }}
          >
            <Text style={styles.linkText}>
              {appointmentDetails.doctor.address}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name="calendar-outline"
            size={24}
            style={styles.iconStyle}
          />
          <Text style={styles.sectionTitle}>Appointment Time</Text>
        </View>
        <Text style={styles.sectionContent}>
          {new Date(appointmentDetails.startDate).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </Text>
        <Text style={styles.sectionContent}>
          {getFormattedTime(
            appointmentDetails.startDate,
            appointmentDetails.startTime,
            appointmentDetails.duration
          )}
        </Text>

        <TouchableOpacity
          onPress={() => addAppointmentToCalendar(appointmentDetails)}
        >
          <Text style={styles.linkText}>Add to calendar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            style={styles.iconStyle}
          />
          <Text style={styles.sectionTitle}>Additional Information</Text>
        </View>
        <Text style={styles.sectionContent}>{appointmentDetails.detail}</Text>
        <Text style={styles.sectionContent}>{appointmentDetails.reason}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name="document-outline"
            size={24}
            style={styles.iconStyle}
          />
          <Text style={styles.sectionTitle}>Related Documents</Text>
        </View>
        {appointmentDetails.documents &&
        appointmentDetails.documents.length > 0 ? (
          appointmentDetails.documents.map((document, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onDocumentPress(document.url)}
            >
              <View style={styles.documentItem}>
                <Text style={styles.linkText}>{document.name}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noDocumentsText}>No documents available.</Text>
        )}
      </View>

      <View style={styles.reminderSection}>
        {appointmentDetails.note ? (
          <View style={styles.reminderItem}>
            <Ionicons
              name="notifications-outline"
              size={20}
              style={styles.iconStyle}
            />
            <Text style={styles.reminderText}>{appointmentDetails.note}</Text>
          </View>
        ) : (
          <Text style={styles.reminderText}>You have no reminders.</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => shareAppointmentDetails(appointmentDetails)}
      >
        <Text style={styles.confirmButtonText}>Share Appointment Details</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    alignContent: "center",
  },
  section: {
    padding: 16,
    marginHorizontal: 8,
    backgroundColor: "#fff", 
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
    borderRadius: 10, 
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8, 
  },
  sectionTitle: {
    fontSize: 20, 
    fontWeight: "bold",
    color: "#000",
    marginLeft: 8,
  },
  sectionContent: {
    fontWeight: "400", 
    fontSize: 16, 
    color: "#000",
    marginBottom: 4, 
    marginLeft: 32,
  },
  linkText: {
    fontSize: 16,
    color: "#007BFF",
    textDecorationLine: "underline",
    marginLeft: 32,
    fontWeight: "500", 
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  documentText: {
    fontSize: 16,
    color: "#4894FE",
    textDecorationLine: "underline",
    marginLeft: 32,
    marginBottom: 8,
  },
  noDocumentsText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 32,
  },

  reminderSection: {
    padding: 16,
    backgroundColor: "#e6f7ff",
    borderRadius: 10,
    marginHorizontal: 16,
  },
  reminderItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  reminderText: {
    fontSize: 16, 
    marginLeft: 8,
    fontWeight: "600",
  },

  confirmButton: {
    backgroundColor: "#007aff",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    alignItems: "center",
  },
  confirmButtonText: {
    textTransform: "none",
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  statusBadge: {
    alignSelf: "flex-start", 
    backgroundColor: "orange", 
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 4,
    marginTop: 4,
    marginLeft: 8, 
  },
  statusBadgeText: {
    color: "white", 
    fontSize: 12,
    fontWeight: "bold",
  },
  confirmBadge: {
    alignSelf: "flex-start",
    backgroundColor: "green", 
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 4,
    marginTop: 4,
    marginLeft: 8,
  },

  iconStyle: {
    color: "#007aff", 
    alignSelf: "center",
  },
});

export default AppointmentDetailScreen;
