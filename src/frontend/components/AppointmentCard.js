import React from "react";
import PropTypes from "prop-types";
import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import doctorImage from "../assets/doctor.jpg";

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
        <View style={styles.iconWrapper}>
          <Image source={doctorImage} style={styles.doctorImage} />
        </View>
        <View style={styles.details}>
          <Text style={styles.title}>
            Meet with Dr.{appointment.doctor.name}
          </Text>
          <View style={styles.datetimeWrapper}>
            <Text style={styles.date}>
              {new Date(appointment.startDate).toLocaleDateString("en-US", {
                weekday: "short",
                month: "long",
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

AppointmentCard.propTypes = {
  testID: PropTypes.string,
  appointment: PropTypes.shape({
    doctor: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired,
    startDate: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired
  }).isRequired
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
  },
  iconWrapper: {
    backgroundColor: "#fff",
    borderRadius: 25,
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  details: {
    justifyContent: "center",
    flex: 1,
  },
  title: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
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
