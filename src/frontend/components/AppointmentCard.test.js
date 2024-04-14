import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import AppointmentCard from "./AppointmentCard";
import { useNavigation } from "@react-navigation/native";

// Define the mock navigate function here so it can be referenced later in the assertion
const mockNavigate = jest.fn();

// Mock the useNavigation hook
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"), // Retain the actual exported objects
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock("react-native-gesture-handler", () => ({
  TouchableOpacity: ({ children, onPress }) => (
    <div onClick={onPress}>{children}</div> // Use 'div' for DOM elements in the Jest environment
  ),
}));

describe("AppointmentCard", () => {
  // Define the appointment object for reuse across tests
  const appointment = {
    dateCreate: "2024-02-19T00:00:00Z",
    detail: "$ FOTINATOS Roula",
    doctor: {
      address: "1 Street street",
      contact: "2394823948",
      email: "john.doe@example.com",
      expertise: "Arms and legs",
      id: 5,
      name: "John",
      website: "doctor.com",
    },
    duration: 600,
    id: 171251,
    lastUpdated: "2024-02-19T00:00:00Z",
    note: "",
    patient: {
      address: "13 Carrigal Street",
      dob: "1965-08-01T00:00:00Z",
      email: "roulaf@haus.com.au",
      firstname: "Roula",
      middleName: "",
      mmsId: 2,
      patientId: 421,
      state: "VIC",
      suburb: "Balwyn",
      surname: "Fotinatos",
    },
    reason: "CS",
    startDate: "2024-04-24T00:00:00.000+00:00",
    startTime: "10:00:00",
    status: "UNCONFIRMED",
    userNote: "",
  };

  it("renders correctly", () => {
    const { getByText } = render(<AppointmentCard appointment={appointment} />);
    expect(getByText("Meet with Dr.John")).toBeTruthy();
    expect(getByText(" Wed, April 24, 2024")).toBeTruthy();
    expect(getByText("10:00:00")).toBeTruthy();
  });

  it("navigates to appointment detail on press", () => {
    // Use the same appointment object without redefining it
    const { getByText } = render(<AppointmentCard appointment={appointment} />);
    // No need to call useNavigation again since you have mockNavigate reference
    fireEvent.press(getByText("Meet with Dr.John"));
    expect(mockNavigate).toHaveBeenCalledWith("AppointmentDetail", {
      appointmentDetails: appointment,
    });
  });
});

// cleanup is called automatically by the testing library
// afterEach(cleanup);