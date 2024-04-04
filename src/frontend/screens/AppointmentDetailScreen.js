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
  const { appointmentDetails } = route.params;

  const onDocumentPress = (url) => {
    // Implement logic to handle document opening, for example:
    Linking.openURL(url).catch((err) => {
      console.error("Failed to open the URL:", url, err);
    });
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
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.linkText}>View Clinic Details</Text>
        </TouchableOpacity>
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
        <Text style={styles.sectionContent}>{appointmentDetails.date}</Text>
        <Text style={styles.sectionContent}>{appointmentDetails.time}</Text>
        <TouchableOpacity onPress={() => {}}>
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
                <Text style={styles.documentText}>{document.name}</Text>
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

      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>Confirm Appointment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  section: {
    padding: 16,
    marginHorizontal: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginLeft: 8,
  },
  sectionContent: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    marginLeft: 32,
  },
  linkText: {
    fontSize: 16,
    color: "#007BFF",
    textDecorationLine: "underline",
    marginLeft: 32,
  },
  doctorInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  doctorDetail: {
    fontSize: 16,
    color: "#000",
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
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginHorizontal: 50,
    marginVertical: 20,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  confirmButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },

  iconStyle: {
    color: "#87CEEB", // Sky blue color
  },
});

export default AppointmentDetailScreen;
