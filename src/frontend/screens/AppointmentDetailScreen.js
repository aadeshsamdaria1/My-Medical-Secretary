import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  onDocumentPress,
  shareAppointmentDetails,
  addAppointmentToCalendar,
  onViewDoctorLocation,
  getFormattedTime,
} from "../utils/appointmentFunctions";
import NotesModal from "../components/NotesModal";
import { updateUserNote } from "../utils/updateUserNote";

const AppointmentDetailScreen = ({ route }) => {
  const { appointmentDetails } = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notes, setNotes] = useState(appointmentDetails.notes || "");

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleSaveNotes = async (newNotes) => {
    try {
      await updateUserNote(appointmentDetails.id, newNotes);
      setNotes(newNotes);
      toggleModal();
    } catch (error) {
      console.error('Failed to save notes:', error.message);
    }
  };

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
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              onViewDoctorLocation(appointmentDetails.doctor.address);
            }}
          >
            <Text style={styles.actionButtonText}>View Doctor's Location</Text>
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
          <Text style={styles.sectionTitle}>Date</Text>
        </View>
        <Text style={styles.sectionContent}>
          {new Date(appointmentDetails.startDate).toLocaleDateString("en-US", {
            weekday: "short",
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
          style={styles.actionButton}
          onPress={() => addAppointmentToCalendar(appointmentDetails)}
        >
          <Text style={styles.actionButtonText}>Add to Calendar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            style={styles.iconStyle}
          />
          <Text style={styles.sectionTitle}>Details</Text>
        </View>
        <Text style={styles.sectionContent}>{appointmentDetails.detail}</Text>
        <Text style={styles.sectionContent}>{appointmentDetails.reason}</Text>
        <TouchableOpacity style={styles.actionButton} onPress={toggleModal}>
          <Text style={styles.actionButtonText}>Add Notes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name="document-outline"
            size={24}
            style={styles.iconStyle}
          />
          <Text style={styles.sectionTitle}>Documents</Text>
        </View>
        {appointmentDetails.documents &&
        appointmentDetails.documents.length > 0 ? (
          appointmentDetails.documents.map((document, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onDocumentPress(document.url)}
              style={styles.documentItem}
            >
              <Text style={styles.documentText}>{document.name}</Text>
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
            <Text style={styles.reminderText}>{appointmentDetails.userNote}</Text>
          </View>
        ) : (
          <Text style={styles.reminderText}>You have no reminders.</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.shareButton}
        onPress={() => shareAppointmentDetails(appointmentDetails)}
      >
        <Text style={styles.shareButtonText}>Share Appointment Details</Text>
      </TouchableOpacity>

      <NotesModal
        isVisible={isModalVisible}
        onClose={toggleModal}
        onSave={handleSaveNotes}
        initialNotes={notes}
      />
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
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
    marginBottom: 4,
  },
  sectionContent: {
    fontWeight: "400",
    fontSize: 16,
    color: "#333",
    marginLeft: 32,
    marginBottom: 4,
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
    marginTop: 4,
  },

  reminderSection: {
    padding: 16,
    backgroundColor: "#e6f7ff",
    borderRadius: 10,
    marginHorizontal: 8,
  },
  reminderItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  reminderText: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 8,
  },

  shareButton: {
    backgroundColor: "#007aff",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    alignItems: "center",
  },
  shareButtonText: {
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

  actionButton: {
    marginLeft: 32,
    alignSelf: "flex-start",
  },
  actionButtonText: {
    color: "#007aff",
    fontSize: 16,
    fontWeight: "500",
    textDecorationLine: "underline", 
  },

  iconStyle: {
    color: "#007aff",
    alignSelf: "center",
  },
});

export default AppointmentDetailScreen;
