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
    padding: 16,
  },
  section: {
    padding: 16,
    marginHorizontal: 16,
    backgroundColor: '#fff', // consider using a different shade here if you change the background
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    borderRadius: 8, // rounded corners for the sections
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12, // More space to set apart the section header from its content
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b6b6b",
    marginLeft: 8,
  },
  sectionContent: {
    fontWeight: "500",
    fontSize: 16,
    color: "#000",
    marginBottom: 8,
    marginLeft: 32,
  },
  linkText: {
    fontSize: 16,
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
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    resizeMode: 'cover',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  doctorDetail: {
    fontSize: 16,
    color: "#555",
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
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    alignItems: "center",
    elevation: 2, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  },
  confirmButtonText: {
    textTransform: 'uppercase',
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },

  iconStyle: {
    color: "#87CEEB", // Sky blue color
    alignSelf: "center",
  },
});

export default AppointmentDetailScreen;
