import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import doctorImage from "../assets/anonymous-doctor.jpg";

const AppointmentDetailScreen = ({ route }) => {
  // Assuming `route.params` contains the necessary data
  const { appointmentDetails } = route.params;

  const onDocumentPress = (url) => {
    // Implement logic to handle document opening, for example:
    Linking.openURL(url).catch((err) => {
      console.error("Failed to open the URL:", url, err);
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.doctorProfileContainer}>
        <Image source={doctorImage} style={styles.doctorImage} />
        <View style={styles.doctorDetails}>
          <Text style={styles.doctorName}>{appointmentDetails.doctorName}</Text>
          <Text style={styles.doctorSpecialty}>
            {appointmentDetails.doctorSpecialty}
          </Text>
          <Text style={styles.doctorSpecialty}>
            {appointmentDetails.hospital}
          </Text>
        </View>
      </View>

      <View style={styles.appointmentInfo}>
        <Text style={styles.appointmentTitle}>Scheduled Appointment</Text>
        <View style={styles.detailRow}>
          <Ionicons
            name="calendar-outline"
            size={20}
            color="#666"
            style={styles.iconStyle}
          />
          <Text style={styles.appointmentDetail}>
            {appointmentDetails.date}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons
            name="time-outline"
            size={20}
            color="#666"
            style={styles.iconStyle}
          />
          <Text style={styles.appointmentDetail}>
            {appointmentDetails.time}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons
            name="location"
            size={20}
            color="#666"
            style={styles.iconStyle}
          />
          <Text style={styles.appointmentDetail}>
            {appointmentDetails.location}
          </Text>
        </View>

        <View style={styles.reminderSection}>
          <Text style={styles.reminderTitle}>Pre-Appointment Reminders</Text>
          <View style={styles.reminderItem}>
            <Ionicons name="alert-circle-outline" size={20} color="#4894FE" />
            <Text style={styles.reminderText}>{appointmentDetails.task}</Text>
          </View>
        </View>

        {/* Documents Section */}
        <View style={styles.documentsSection}>
          <Text style={styles.documentsTitle}>Related Documents</Text>
          {appointmentDetails.documents &&
          appointmentDetails.documents.length > 0 ? (
            appointmentDetails.documents.map((document, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => onDocumentPress(document.url)}
              >
                <View style={styles.documentItem}>
                  <Text style={styles.documentText}>{document.name}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noDocumentsText}>No documents available.</Text>
          )}
        </View>
      </View>

      {/* Messaging and Confirmation Button */}
      <TouchableOpacity style={styles.Button}>
        <Text style={styles.ButtonText}>Confirm</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // Use a clean white background
  },
  doctorProfileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f4f7", // Lighter background for less visual weight
  },
  doctorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  doctorDetails: {
    flex: 1,
    marginLeft: 16,
  },
  doctorName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#202124", // Dark for text for contrast against the light header
  },
  doctorSpecialty: {
    fontSize: 16,
    color: "#202124", // Complementary dark color for secondary text
    marginTop: 6,
  },

  appointmentInfo: {
    padding: 16,
    backgroundColor: "#ffffff",
    marginLeft: 8,
    marginRight: 8,
  },
  appointmentTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#202124", // Keep titles dark for emphasis
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  appointmentDetail: {
    fontSize: 18,
    marginLeft: 8,
    color: "#202124", // Dark color for detail text for readability
  },
  iconStyle: {
    color: "#4894FE", // Brand blue for icons
  },

  Button: {
    backgroundColor: "#4CAF50", // A vibrant green for the button
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 20,
    margin: 20,
    alignItems: "center",
    shadowColor: "#4CAF50", // Same green for a subtle button shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 7,
  },
  ButtonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "600",
  },
  

  reminderSection: {
    padding: 16,
    backgroundColor: "#e6f7ff", // Soft blue background to highlight section
  },
  reminderTitle: {
    fontWeight: "600",
    fontSize: 18, // Reduced size for subtlety
    color: "#202124",
    marginBottom: 10,
  },
  reminderItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  reminderText: {
    fontSize: 16, // Reduced size for subtlety
    marginLeft: 8,
    color: "#202124",
  },

  documentsSection: {
    padding: 16,
    backgroundColor: "#ffffff", // Consistent background with the rest of the screen
    borderTopWidth: 1, // Only top border to separate from the reminder section
    borderTopColor: "#d1e3f8",
  },
  documentsTitle: {
    fontWeight: "600",
    fontSize: 20,
    marginBottom: 10,
    color: "#202124",
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  documentText: {
    fontSize: 18,
    marginLeft: 8,
    color: "#4894FE",
    textDecorationLine: "underline",
  },
  noDocumentsText: {
    fontSize: 18,
    color: "#666",
  },
});

export default AppointmentDetailScreen;
