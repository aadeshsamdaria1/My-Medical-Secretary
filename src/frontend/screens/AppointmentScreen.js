import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import CalendarScreen from "../components/Calendar";

export default function AppointmentScreen() {
  return (
    <>
      <View style={styles.container}>
        <Text>Appointment Screen</Text>
        <CalendarScreen />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
