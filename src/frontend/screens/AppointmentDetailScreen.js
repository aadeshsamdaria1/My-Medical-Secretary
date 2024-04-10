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
import doctorImage from "../assets/anonymous-doctor.jpg";
import {
  onDocumentPress,
  shareAppointmentDetails,
  addAppointmentToCalendar,
  onViewDoctorLocation,
} from "../utils/appointmentFunctions";
import moment from "moment";

const AppointmentDetailScreen = ({ route }) => {
  const { appointmentDetails } = route.params;
  const [isConfirmed, setIsConfirmed] = React.useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="person-outline" size={24} style={styles.iconStyle} />
          <Text style={styles.sectionTitle}>Doctor Information</Text>
        </View>
        <View style={styles.doctorInfoContainer}>
          <Image source={doctorImage} style={styles.doctorImage} />
          <View>
            <Text style={styles.doctorName}>
              {appointmentDetails.doctorName}
            </Text>
            <Text style={styles.doctorDetail}>
              {appointmentDetails.doctorSpecialty}
            </Text>
            <TouchableOpacity
              onPress={() => {
                onViewDoctorLocation(appointmentDetails);
              }}
            >
              <Text style={styles.doctorLocation}>View Doctor Location</Text>
            </TouchableOpacity>
          </View>
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
          {new Date(appointmentDetails.date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </Text>
        <Text style={styles.sectionContent}>
          {new Date(
            `${appointmentDetails.date}T${appointmentDetails.time}`
          ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{" "}
          to{" "}
          {new Date(
            new Date(
              `${appointmentDetails.date}T${appointmentDetails.time}`
            ).getTime() +
              appointmentDetails.duration * 60000
          ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
        <View style={styles.reminderItem}>
          <Ionicons
            name="notifications-outline"
            size={20}
            style={styles.iconStyle}
          />
          <Text style={styles.reminderText}>{appointmentDetails.note}</Text>
        </View>
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
    marginHorizontal: 16,
    backgroundColor: "#fff", // consider using a different shade here if you change the background
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
    borderRadius: 10, // rounded corners for the sections
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
    marginBottom: 8, // More space to set apart the section header from its content
  },
  sectionTitle: {
    fontSize: 22, // Larger font size for section headers, following iOS design
    fontWeight: "bold",
    color: "#000",
    marginLeft: 8,
  },
  sectionContent: {
    fontWeight: "400", // iOS tends to use lighter font weights for content
    fontSize: 18, // Increase the font size for better readability
    color: "#000",
    marginBottom: 4, // Reduce the bottom margin
    marginLeft: 32, // Indent the content to align with the section header
  },
  linkText: {
    fontSize: 18,
    color: "#007BFF",
    textDecorationLine: "underline",
    marginLeft: 32,
    fontWeight: "500", // Make links bold for emphasis
  },
  doctorInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    resizeMode: "cover",
  },
  doctorName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  doctorDetail: {
    fontSize: 18,
    color: "#555",
    marginBottom: 4,
  },
  doctorLocation: {
    fontSize: 18,
    color: "#007BFF",
    textDecorationLine: "underline",
    fontWeight: "500", // Make links bold for emphasis
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
    fontSize: 18, // Reduced size for subtlety
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
    fontSize: 18,
    fontWeight: "600",
  },

  iconStyle: {
    color: "#007aff", // Sky blue color
    alignSelf: "center",
  },
});

export default AppointmentDetailScreen;
