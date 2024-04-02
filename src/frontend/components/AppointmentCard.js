import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import doctorImage from "../assets/anonymous-doctor.jpg";

const AppointmentCard = ({ appointment }) => {
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate("AppointmentDetail", {
      appointmentDetails: appointment,
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.card}>
        <View style={styles.iconWrapper}>
          <Image source={doctorImage} style={styles.doctorImage} />
        </View>
        <View style={styles.details}>
          <Text style={styles.title}>{appointment.title}</Text>
          <View style={styles.datetimeWrapper}>
            <Text style={styles.date}>{appointment.date}</Text>
            <Text style={styles.time}>{appointment.time}</Text>
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
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  iconWrapper: {
    backgroundColor: "#fff",
    borderRadius: 25,
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 45,
  },
  details: {
    justifyContent: "center",
    flex: 1,
  },
  title: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 4,
  },
  datetimeWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    fontSize: 16,
    color: "#333",
    marginRight: 4,
  },
  time: {
    fontSize: 16,
    color: "#333",
  },
});

export default AppointmentCard;
