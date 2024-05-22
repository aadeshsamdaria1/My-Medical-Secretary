import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const AppointmentCard = ({ appointment, testID }) => {
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate("AppointmentDetail", {
      appointmentDetails: appointment,
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} testID={testID}>
      <View style={styles.card}>
        <View style={styles.details}>
          <Text style={styles.title}>{appointment.detail}</Text>
          <Text style={styles.date}>{appointment.doctor.name}</Text>
          <View style={styles.datetimeWrapper}>
            <Text style={styles.date}>
              {new Date(appointment.startDate).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
                hour12: true,
              })}
            </Text>
            <Text style={styles.time}>{new Date(`1970-01-01T${appointment.startTime}`)
                        .toLocaleString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })
                        .toUpperCase()}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  details: {
    justifyContent: "center",
    marginLeft: 8,
    flex: 1,
  },
  title: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
    color: "#007AFF"
  },
  datetimeWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  time: {
    fontSize: 14,
    color: "#666",
  },
});

export default AppointmentCard;
