// AppointmentDetailsModal.js
import React from 'react';
import { Modal, ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const AppointmentDetailsModal = ({ visible, appointment, onClose }) => (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer} testID="appointment-modal">
        <View style={[styles.modalContent, { maxHeight: '80%' }]}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {appointment ? (
              <>
                <Text style={styles.modalTitle}>Appointment Details</Text>
                {appointment.detail && (
                  <Text style={styles.modalDetail}>
                    <Text style={{ fontWeight: 'bold' }}>Detail:</Text> {appointment.detail}
                  </Text>
                )}
                {appointment.reason && (
                  <Text style={styles.modalDetail}>
                    <Text style={{ fontWeight: 'bold' }}>Reason:</Text> {appointment.reason}
                  </Text>
                )}
                {appointment.note && (
                  <Text style={styles.modalDetail}>
                    <Text style={{ fontWeight: 'bold' }}>Note:</Text> {appointment.note}
                  </Text>
                )}
                {appointment.startDate && (
                  <Text style={styles.modalDetail}>
                    <Text style={{ fontWeight: 'bold' }}>Date:</Text> {new Date(appointment.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </Text>
                )}
                {appointment.startTime && (
                  <Text style={styles.modalDetail}>
                    <Text style={{ fontWeight: 'bold' }}>Time:</Text> {new Date(`1970-01-01T${appointment.startTime}`).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase()}
                  </Text>
                )}
                {appointment.duration && (
                  <Text style={styles.modalDetail}>
                    <Text style={{ fontWeight: 'bold' }}>Duration:</Text> {appointment.duration / 10} minutes
                  </Text>
                )}
                {appointment.doctor.name && (
                  <Text style={styles.modalDetail}>
                    <Text style={{ fontWeight: 'bold' }}>Doctor:</Text> {appointment.doctor.name}
                  </Text>
                )}
              </>
            ) : (
              <Text style={styles.modalDetail}>Error while loading appointment details</Text>
            )}
            <TouchableOpacity onPress={onClose} style={styles.closeButton} testID="close-modal">
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    width: '80%',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: "#007AFF"
  },
  modalDetail: {
    fontSize: 16,
    marginBottom: 8,
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AppointmentDetailsModal;