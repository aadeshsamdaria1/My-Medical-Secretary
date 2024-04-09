import * as Calendar from "expo-calendar";
import * as Location from "expo-location";
import { Alert, Share, Linking, Platform } from "react-native";

export const onViewDoctorLocation = async (appointmentDetails) => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Location Permissions Required",
        "We need location permissions to open the map."
      );
      return;
    }

    const doctorAddress = `${appointmentDetails.clinicAddress}, ${appointmentDetails.clinicSuburb}, ${appointmentDetails.clinicState}`;

    // Open the location in the device's default maps app
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      doctorAddress
    )}`;
    await Linking.openURL(mapUrl);
  } catch (error) {
    console.error("Error opening map:", error);
    Alert.alert(
      "Error",
      "There was an error opening the map. Please try again later."
    );
  }
};

export const onDocumentPress = (url) => {
  Linking.openURL(url).catch((err) => {
    console.error("Failed to open the URL:", url, err);
  });
};

export const shareAppointmentDetails = async (appointmentDetails) => {
  try {
    const message = `
        Appointment Details:
        Doctor: ${appointmentDetails.doctorName}
        Specialty: ${appointmentDetails.doctorSpecialty}
        Date: ${appointmentDetails.date}
        Time: ${appointmentDetails.time}
        Clinic: ${appointmentDetails.clinicName}
        Address: ${appointmentDetails.clinicAddress}
      `;

    const result = await Share.share({
      message: message.trim(),
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // Shared with activity type of result.activityType
      } else {
        // Shared
      }
    } else if (result.action === Share.dismissedAction) {
      // Dismissed
    }
  } catch (error) {
    alert(error.message);
  }
};

export const addAppointmentToCalendar = async (appointmentDetails) => {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Permissions required",
      "We need calendar permissions to add this event."
    );
    return;
  }

  const defaultCalendarSource =
    Platform.OS === "ios"
      ? await getDefaultCalendarSource()
      : { isLocalAccount: true, name: "Expo Calendar" };

  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT
  );
  const defaultCalendar =
    calendars.find((calendar) => calendar.allowsModifications) || calendars[0];

  try {
    const eventDetails = {
      title: appointmentDetails.doctorName,
      startDate: new Date(appointmentDetails.date).toISOString(),
      endDate: new Date(
        new Date(appointmentDetails.date).getTime() + 60 * 60 * 1000
      ).toISOString(), // Assuming the appointment is 1 hour long
      timeZone: "UTC",
      location: appointmentDetails.clinicAddress,
      notes:
        "Appointment with " +
        appointmentDetails.doctorName +
        " at " +
        appointmentDetails.clinicName,
    };

    await Calendar.createEventAsync(defaultCalendar.id, eventDetails);
    Alert.alert("Success", "Appointment added to your calendar");
  } catch (error) {
    console.error("Error adding event to calendar:", error);
    Alert.alert(
      "Error",
      "There was an error adding the appointment to your calendar."
    );
  }
};

export const getDefaultCalendarSource = async () => {
  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT
  );
  const defaultCalendars = calendars.filter(
    (each) => each.source && each.source.name === "Default"
  );
  return defaultCalendars.length ? defaultCalendars[0].source : null;
};
