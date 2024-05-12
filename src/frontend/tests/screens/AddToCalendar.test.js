import React from "react";
import { render, fireEvent, waitFor, Alert } from "@testing-library/react-native";
import AppointmentDetailScreen from "../../screens/AppointmentDetailScreen";
import Calendar from 'expo-calendar';
import Location from 'expo-location';
import { addAppointmentToCalendar } from "../../utils/appointmentFunctions";

// Mock the entire expo-calendar module
jest.mock('expo-calendar', () => ({
  requestCalendarPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCalendarsAsync: jest.fn().mockResolvedValue([{ id: '1', allowsModifications: true }]),
  createEventAsync: jest.fn().mockResolvedValue('eventId'),
  EntityTypes: {
    EVENT: 'event',
  },
}));

describe("AppointmentDetailScreen", () => {
  const appointmentDetails = {
    id: 1,
    doctor: {
      name: "John Doe",
      address: "123 Main St",
    },
    startDate: "2023-06-01T10:00:00.000Z",
    startTime: "10:00",
    duration: 60,
    note: "Appointment notes",
  };

  beforeEach(() => {
    // Reset the mock functions before each test
    Calendar.requestCalendarPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Calendar.getCalendarsAsync.mockResolvedValue([{ id: '1', allowsModifications: true }]);
    Calendar.createEventAsync.mockResolvedValue('eventId');
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
  });

  it("should add appointment to calendar when 'Add to Calendar' button is pressed", async () => {
    const { getByText } = render(
      <AppointmentDetailScreen route={{ params: { appointmentDetails } }} />
    );

    fireEvent.press(getByText('Add to Calendar'));

    await waitFor(() => {
      expect(Calendar.requestCalendarPermissionsAsync).toHaveBeenCalled();
      expect(Calendar.getCalendarsAsync).toHaveBeenCalledWith(Calendar.EntityTypes.EVENT);
      expect(Calendar.createEventAsync).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          title: 'Appointment with Dr. John Doe',
          startDate: '2023-06-01T10:00:00.000Z',
          endDate: '2023-06-01T11:00:00.000Z',
          timeZone: 'UTC',
          location: '123 Main St',
          notes: 'Appointment notes',
        })
      );
    });
  });
});