import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
  Platform,
  Share,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import doctorImage from "../assets/anonymous-doctor.jpg";
import * as Calendar from "expo-calendar";

const AppointmentDetailScreen = ({ route }) => {
  const { appointmentDetails } = route.params;
  const [isConfirmed, setIsConfirmed] = React.useState(false);

  const onDocumentPress = (url) => {
    Linking.openURL(url).catch((err) => {
      console.error("Failed to open the URL:", url, err);
    });
  };

  const shareAppointmentDetails = async (appointmentDetails) => {
    try {
      const message = `
        Appointment Details:
        Doctor: ${appointmentDetails.doctorName}
        Specialty: ${appointmentDetails.doctorSpecialty}
        Date: ${appointmentDetails.date}
        Time: ${appointmentDetails.time}
        Clinic: ${appointmentDetails.clinicName}
        Address: ${appointmentDetails.clinicAddress}
      `;

      const result = await Share.share({
        message: message.trim(),
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const addAppointmentToCalendar = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissions required",
        "We need calendar permissions to add this event."
      );
      return;
    }

    const defaultCalendarSource =
      Platform.OS === "ios"
        ? await getDefaultCalendarSource()
        : { isLocalAccount: true, name: "Expo Calendar" };

    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT
    );
    const defaultCalendar =
      calendars.find((calendar) => calendar.allowsModifications) ||
      calendars[0];

    try {
      const eventDetails = {
        title: appointmentDetails.doctorName,
        startDate: new Date(appointmentDetails.date).toISOString(),
        endDate: new Date(
          new Date(appointmentDetails.date).getTime() + 60 * 60 * 1000
        ).toISOString(), // Assuming the appointment is 1 hour long
        timeZone: "UTC",
        location: appointmentDetails.clinicAddress,
        notes:
          "Appointment with " +
          appointmentDetails.doctorName +
          " at " +
          appointmentDetails.clinicName,
      };

      await Calendar.createEventAsync(defaultCalendar.id, eventDetails);
      Alert.alert("Success", "Appointment added to your calendar");
    } catch (error) {
      console.error("Error adding event to calendar:", error);
      Alert.alert(
        "Error",
        "There was an error adding the appointment to your calendar."
      );
    }
  };

  const getDefaultCalendarSource = async () => {
    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT
    );
    const defaultCalendars = calendars.filter(
      (each) => each.source && each.source.name === "Default"
    );
    return defaultCalendars.length ? defaultCalendars[0].source : null;
  };

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
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.doctorLocation}>View Doctor Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="home-outline" size={24} style={styles.iconStyle} />
          <Text style={styles.sectionTitle}>Clinic Information</Text>
        </View>
        <Text style={styles.sectionContent}>
          {appointmentDetails.clinicName}
        </Text>
        <Text style={styles.sectionContent}>
          {appointmentDetails.clinicAddress}
        </Text>
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
          {appointmentDetails.dateString}
        </Text>
        <Text style={styles.sectionContent}>{appointmentDetails.time}</Text>
        <TouchableOpacity onPress={addAppointmentToCalendar}>
          <Text style={styles.linkText}>Add to calendar</Text>
        </TouchableOpacity>
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
            name="alert-circle-outline"
            size={20}
            style={styles.iconStyle}
          />
          <Text style={styles.reminderText}>{appointmentDetails.task}</Text>
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
    fontSize: 16, // Reduced size for subtlety
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
