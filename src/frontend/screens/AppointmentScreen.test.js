import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import AppointmentScreen from "./AppointmentScreen";
import * as useUserDetailsHook from "../utils/useUserDetails";
import * as useUpcomingAppointmentsHook from "../utils/useUpcomingAppointments";

jest.mock("../components/Calendar", () => "AppointmentCalendar");
jest.mock("../components/AppointmentCard", () => "AppointmentCard");

const mockAppointmentsFromApi = [
  {
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
  },
];

describe("AppointmentScreen Integration Test", () => {
  beforeEach(() => {
    // Mocking the API hooks
    jest.spyOn(useUserDetailsHook, "useUserDetails").mockReturnValue({
      // ... mocked user details
    });

    // Use the mock array directly
    jest
      .spyOn(useUpcomingAppointmentsHook, "useUpcomingAppointments")
      .mockReturnValue(mockAppointmentsFromApi);
  });

  it("renders the appointment card and calendar component", async () => {
    const route = {
      params: {
        userId: "421",
      },
    };

    const { getByText, getByTestId } = render(
      <AppointmentScreen route={route} />
    );

    await waitFor(() => {
      expect(getByText("Calendar")).toBeTruthy();
      expect(getByTestId("appointment-card-171251")).toBeTruthy();
      expect(getByTestId('calendar')).toBeTruthy();
    });
  });
});
