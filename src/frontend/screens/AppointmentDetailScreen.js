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
  const [notes, setNotes] = useState(appointmentDetails.userNote || "");

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };


  const handleSaveNotes = async (newNotes) => {
    try {
      toggleModal();
      await updateUserNote(appointmentDetails.id, newNotes);
      setNotes(newNotes);
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

      </View>

      {/* 
      I believe we have no document functionality, but will leave this here
      IF we decide to implement later
      <Text style={styles.reminderText}>{appointmentDetails.userNote}</Text>
      
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
      </View> */}
      <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="create-outline" size={24} style={styles.iconStyle} />
        <Text style={styles.sectionTitle}>My Notes</Text>
      </View>
      {notes ? (
        <>
          <Text style={styles.sectionContent}>{notes}</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={toggleModal}
          >
            <Text style={styles.actionButtonText}>Update Notes</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.sectionContent}>No notes</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={toggleModal}
          >
            <Text style={styles.actionButtonText}>Add Notes</Text>
          </TouchableOpacity>
        </>
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
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
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
  },
  sectionContent: {
    fontSize: 16,
    fontWeight: "400",
    color: "#333",
    marginLeft: 32,
  },
  reminderSection: {
    backgroundColor: "#e6f7ff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    marginVertical: 8,
  },
  reminderItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  reminderText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  actionButton: {
    marginLeft: 32,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007aff",
    textDecorationLine: "underline",
  },
  shareButton: {
    backgroundColor: "#007aff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    alignItems: "center",
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textTransform: "none",
  },
  statusBadge: {
    backgroundColor: "orange",
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 4,
    marginLeft: 8,
  },
  confirmBadge: {
    backgroundColor: "green",
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 4,
    marginLeft: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  iconStyle: {
    fontSize: 24,
    color: "#007aff",
  },
});

export default AppointmentDetailScreen;