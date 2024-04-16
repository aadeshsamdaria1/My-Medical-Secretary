import React, { useState, useEffect } from 'react';
import { Modal, ScrollView, StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import AppointmentDetailsModal from '../components/AppointmentDetailsModal';
import { useUserDetails } from "../utils/useUserDetails";
import { useUpcomingAppointments } from "../utils/useUpcomingAppointments";

const HomeScreen = ({ route }) => {
  const userId = route.params?.userId;

  // // Sample data for upcoming appointments and recent messages
  // const upcomingAppointments = [
  //   {
  //     "id": 1,
  //     "detail": "Routine chekcup",
  //     "reason": "General health",
  //     "note": "No specific notes",
  //     "dateCreate": "2022-04-08T10:30:00Z",
  //     "lastUpdated": "2022-04-08T12:45:00Z",
  //     "startTime": "10:30:00",
  //     "startDate": "2022-04-15T00:00:00.000+00:00",
  //     "duration": 60,
  //     "userNote": "",
  //     "status": "UNCONFIRMED",
  //     "patient": {
  //         "mmsId": 450,
  //         "email": "john.doe@example.com",
  //         "patientId": 3,
  //         "firstname": "Zara",
  //         "middleName": "Doe",
  //         "surname": "Smith",
  //         "dob": "1990-01-01T00:00:00Z",
  //         "address": "123 Main St",
  //         "suburb": "Cityville",
  //         "state": "California"
  //     },
  //     "doctor": {
  //         "id": 3,
  //         "name": "John",
  //         "address": "1 Street street",
  //         "contact": "2394823948",
  //         "email": "john.doe@example.com",
  //         "expertise": "Arms and legs",
  //         "website": "doctor.com"
  //     }
  // },
  // ];
  const recentMessages = [
    { id: '1', sender: 'Nurse Mary', message: 'Please remember to take your medication. This is a longer message to demonstrate the functionality.' },
    { id: '2', sender: 'Dr. John Doe', message: 'Your test results are ready.' },
  ];
  // Screen data
  const [showMoreAppointments, setShowMoreAppointments] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showMoreMessages, setShowMoreMessages] = useState(false);
  const userName = useUserDetails(userId);
  const upcomingAppointments = useUpcomingAppointments(userId);
  // Screen controllers
  const showAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentModal(true);
  };

  const closeAppointmentModal = () => {
    setShowAppointmentModal(false);
    setSelectedAppointment(null);
  };

  const handleMessagePress = (message) => {
    Alert.alert(
      'Message',
      message,
      [
        {
          text: 'Close',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };
  // Screen UI
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Hi, {userName}</Text>
      </View>

      <View style={styles.dashboard}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          {upcomingAppointments.length > 0 ? (
            <FlatList
              data={showMoreAppointments ? upcomingAppointments : upcomingAppointments.slice(0, 2)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  testID="appointment-item"
                  style={[styles.appointmentItem, { backgroundColor: 'lightblue' }]}
                  onPress={() => showAppointmentDetails(item)}
                >
                  <View style={styles.appointmentHeader}>
                    <View style={styles.appointmentDoctorInfo}>
                      <Text style={[styles.appointmentDoctorName, { textAlign: 'center' }]}>{item.doctor.name}</Text>
                      <Text style={[styles.appointmentDetail, { textAlign: 'center' }]}>{item.detail}</Text>
                    </View>
                  </View>
                  <View style={styles.appointmentDetails}>
                    <Text style={styles.appointmentDate}>
                      {new Date(item.startDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Text>
                    <Text style={styles.appointmentTime}>
                      {new Date(`1970-01-01T${item.startTime}`)
                        .toLocaleString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })
                        .toUpperCase()}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.noDataText}>No upcoming appointments</Text>
          )}
          {upcomingAppointments.length > 2 && (
            <View style={styles.showMoreButtonContainer}>
              {showMoreAppointments ? (
                <TouchableOpacity
                  style={[styles.showMoreButton, { backgroundColor: '#007AFF' }]}
                  onPress={() => setShowMoreAppointments(false)}
                >
                  <Text style={[styles.showMoreText, { color: 'white' }]}>Show Less</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.showMoreButton, { backgroundColor: '#007AFF' }]}
                  onPress={() => setShowMoreAppointments(true)}
                >
                  <Text style={[styles.showMoreText, { color: 'white' }]}>Show More</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Messages</Text>
          {recentMessages.length > 0 ? (
            <FlatList
              data={showMoreMessages ? recentMessages : recentMessages.slice(0, 2)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.messageItem, { backgroundColor: '#f5f5f5' }]}
                  onPress={() => handleMessagePress(item.message)}
                >
                  <Text style={styles.messageSender}>{item.sender}</Text>
                  <Text style={styles.messageText}>{item.message.length > 50 ? `${item.message.slice(0, 50)}...` : item.message}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.noDataText}>No recent messages</Text>
          )}
          {recentMessages.length > 2 && (
            <View style={styles.showMoreButtonContainer}>
              {showMoreMessages ? (
                <TouchableOpacity
                  style={[styles.showMoreButton, { backgroundColor: '#007AFF' }]}
                  onPress={() => setShowMoreMessages(false)}
                >
                  <Text style={[styles.showMoreText, { color: 'white' }]}>Show Less</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.showMoreButton, { backgroundColor: '#007AFF' }]}
                  onPress={() => setShowMoreMessages(true)}
                >
                  <Text style={[styles.showMoreText, { color: 'white' }]}>Show More</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
      <AppointmentDetailsModal
        visible={showAppointmentModal}
        appointment={selectedAppointment}
        onClose={closeAppointmentModal}
      />
    </View>
  );
};
// Screen Stylings
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  dashboard: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  appointmentItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentDoctorInfo: {
    flex: 1,
  },
  appointmentDoctorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  appointmentDetail: {
    fontSize: 14,
    color: '#666',
  },
  appointmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  appointmentDate: {
    fontSize: 14,
    color: '#666',
  },
  appointmentTime: {
    fontSize: 14,
    color: '#666',
    color: 'red'
  },
  messageItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  messageSender: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 14,
    color: '#666',
  },
  showMoreButtonContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  showMoreButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  showMoreText: {
    fontSize: 16,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 24,
  },
});

export default HomeScreen;