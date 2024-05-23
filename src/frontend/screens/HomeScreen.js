import React, { useState, useEffect } from 'react';
import { Modal, ScrollView, StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import AppointmentDetailsModal from '../components/AppointmentDetailsModal';
import { useUserDetails } from "../utils/useUserDetails";
import { useUpcomingAppointments } from "../utils/useUpcomingAppointments";
import { useMessage } from "../utils/useMessageByUser";

const HomeScreen = ({ route }) => {
  const userId = route.params?.userId;
  const recentMessages = useMessage(userId);

  const [showMoreAppointments, setShowMoreAppointments] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showMoreMessages, setShowMoreMessages] = useState(false);
  const userName = useUserDetails(userId);
  const upcomingAppointments = useUpcomingAppointments(userId);

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome, {userName}</Text>
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
                  style={[styles.appointmentItem, { backgroundColor: '#f5f5f5' }]}
                  onPress={() => showAppointmentDetails(item)}
                >
                  <View style={styles.appointmentHeader}>
                    <View style={styles.appointmentDoctorInfo}>
                      <Text style={[styles.appointmentDoctorName, { textAlign: 'center' }]}>{item.detail}</Text>
                      <Text style={[styles.appointmentDetail, { textAlign: 'center' }]}>{item.doctor.name}</Text>
                      <Text style={[styles.appointmentDetail, { textAlign: 'center' }]}>{item.reason}</Text>
                    </View>
                  </View>
                  <View style={styles.appointmentDetails}>
                    <Text style={styles.appointmentDate}>
                      {new Date(item.startDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })} {new Date(`1970-01-01T${item.startTime}`)
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
              keyExtractor={(item, index) => `${item.patientId}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.messageItem, { backgroundColor: '#f5f5f5' }]}
                  onPress={() => handleMessagePress(item.text)}
                >
                  <Text style={styles.messageText}>{item.text.length > 50 ? `${item.text.slice(0, 50)}...` : item.text}</Text>
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
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: "#06b4ff",
    color: "#007AFF",
    marginBottom: 5
  },
  appointmentDetail: {
    fontSize: 14,
    color: 'black',
  },
  appointmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  appointmentDate: {
    fontSize: 14,
    color: 'black',
  },
  appointmentTime: {
    fontSize: 14,
    color: '#666',
    color: 'blue'
  },
  messageItem: {
    padding: 12,
    borderRadius: 12,
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
    fontSize: 14,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 24,
  },
});

export default HomeScreen;
