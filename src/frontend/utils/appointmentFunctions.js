import * as Calendar from "expo-calendar";
import * as Location from "expo-location";
import { Alert, Share, Linking, Platform } from "react-native";

export const onViewDoctorLocation = async (address) => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Location Permissions Required",
        "We need location permissions to open the map."
      );
      return;
    }


    // Open the location in the device's default maps app
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
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
    const startDateTime = appointmentDetails.startDate.split("T")[0]
    const message = `
        Appointment Details:
        Doctor: ${appointmentDetails.doctor.name}
        Date: ${startDateTime}
        Time: ${appointmentDetails.startTime}
        Duration: ${appointmentDetails.duration}
        Clinic: ${appointmentDetails.detail}
        Note: ${appointmentDetails.note}
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
    const startDate = new Date(appointmentDetails.startDate);
    const utcStartDate = new Date(startDate.toISOString());
    const endDate = new Date(
      utcStartDate.setMinutes(
        utcStartDate.getMinutes() + appointmentDetails.duration
      )
    );

    const eventDetails = {
      title: `Appointment with Dr. ${appointmentDetails.doctor.name}`,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      timeZone: "UTC",
      location: appointmentDetails.doctor.address,
      notes: appointmentDetails.note,
    };

    console.log("Adding event to calendar:", eventDetails);

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

export const getFormattedTime = (startDate, startTime, duration) => {
  const startDateTime = new Date(`${startDate.split("T")[0]}T${startTime}`);

  const endTime = new Date(startDateTime.getTime() + duration * 60000);

  const options = { hour: "2-digit", minute: "2-digit", hour12: true };

  const formattedStartTime = startDateTime.toLocaleTimeString("en-US", options);
  const formattedEndTime = endTime.toLocaleTimeString("en-US", options);

  return `${formattedStartTime} to ${formattedEndTime}`;
};
