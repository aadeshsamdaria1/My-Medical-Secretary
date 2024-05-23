import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { onViewDoctorLocation } from '../utils/appointmentFunctions';
import {
  Alert,
  Linking,
} from "react-native";
import {handleLinkPress, handleCallPress, handleEmailPress} from "../utils/nativeLinkFunctions"; 

const DoctorDetailScreen = ({ route }) => {
  const { doctor } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: '' });
  }, [navigation]);

  const { id, name, expertise, website, contact, email, address, ...otherDetails } = doctor; 

  return (
    <View style={styles.container}>
      <Text style={styles.doctorName}>{name}</Text>
      <Text style={styles.sectionTitle}>Expertise: {expertise}</Text>
      <View style={styles.detailsContainer}>
        {Object.entries(otherDetails).map(([key, value]) => (
          <View key={key} style={styles.detailItem}>
            <Text style={[styles.detailLabel, styles.bold]}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </Text>
            <Text style={styles.detailValue}>{value}</Text>
          </View>
        ))}
        { website !== "" &&
          <TouchableOpacity
          onPress={() => handleLinkPress(website)}>
          <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, styles.bold]}>
                Website:
              </Text>
              <Text style={styles.websiteLink}>{website}</Text>
          </View>
          </TouchableOpacity>
        }
        { contact !== "" &&
          <TouchableOpacity
          onPress={() => handleCallPress(contact)}>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, styles.bold]}>
                  Contact:
                </Text>
                <Text style={styles.websiteLink}>{contact}</Text>
            </View>
          </TouchableOpacity>
        }
        { email !== "" &&
          <TouchableOpacity
          onPress={() => handleEmailPress(email)}>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, styles.bold]}>
                  Email:
                </Text>
                <Text style={styles.websiteLink}>{email}</Text>
            </View>
          </TouchableOpacity>
        }
        {address !== "" && (
        <View>
          <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, styles.bold]}>
                  Address:
                </Text>
                <Text style={styles.detailValue}>{address}</Text>
            </View>
            <TouchableOpacity
          style={styles.button}
          onPress={() => onViewDoctorLocation(address)}
        >
          <Text style={styles.buttonText}>View Location</Text>
        </TouchableOpacity>
        </View>

      )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  doctorName: {
    fontWeight: 'bold',
    fontSize: 30, 
    color: '#007bff', 
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 22, 
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  detailsContainer: {
    width: '100%',
  },
  detailItem: {
    marginBottom: 8, 
  },
  detailLabel: {
    fontSize: 18, 
  },
  detailValue: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007aff",
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    textTransform: "none",
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  websiteLink: {
    fontSize: 16,
    color: "#007AFF"

  }
});

export default DoctorDetailScreen;