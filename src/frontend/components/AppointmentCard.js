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
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>😷</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.title}>Dr.{appointment.doctor.name}</Text>
          <View style={styles.datetimeWrapper}>
            <Text style={styles.date}>
              {new Date(appointment.startDate).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
            <Text style={styles.time}>{appointment.startTime}</Text>
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
    borderRadius: 20,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#007aff",
  },
  emojiContainer: {
    marginRight: 8,
  },
  emoji: {
    fontSize: 16,
  },
  details: {
    justifyContent: "center",
    flex: 1,
  },
  title: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 6,
  },
  datetimeWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    fontSize: 16,
    color: "#333",
    marginRight: 8,
  },
  time: {
    fontSize: 16,
    color: "#333",
  },
});

export default AppointmentCard;
