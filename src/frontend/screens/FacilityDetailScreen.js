import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { onViewDoctorLocation } from "../utils/appointmentFunctions";

const FacilityDetailScreen = ({ route }) => {
  const { facility } = route.params;
  const navigation = useNavigation();
  const { id, name, ...otherDetails } = facility;

  useEffect(() => {
    navigation.setOptions({ title: "" });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      {Object.entries(otherDetails).map(([key, value]) => {
        if (value !== "" && key !=="facilityType") {
          return (
            <View key={key} style={styles.detailContainer}>
              <Text style={styles.fieldName}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
              <Text style={styles.detail}>{value}</Text>
            </View>
          );
        }
        return null;
      })}
      {facility.address && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => onViewDoctorLocation(facility.address)}
        >
          <Text style={styles.buttonText}>View Location</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,

  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#007bff",
    marginBottom: 10,
  },
  detailContainer: {
    marginBottom: 10,
  },
  fieldName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  detail: {
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
});
export default FacilityDetailScreen;
