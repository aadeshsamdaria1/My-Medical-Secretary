import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import AppointmentDetailScreen from "../../screens/AppointmentDetailScreen";
import {
  onDocumentPress,
  shareAppointmentDetails,
  addAppointmentToCalendar,
  onViewDoctorLocation,
} from "../../utils/appointmentFunctions";
import { share, sharedAction, dismissedAction } from 'react-native-share';

jest.mock("../../utils/appointmentFunctions", () => ({
  onDocumentPress: jest.fn(),
  shareAppointmentDetails: jest.fn(),
  addAppointmentToCalendar: jest.fn(),
  onViewDoctorLocation: jest.fn(),
  getFormattedTime: jest.fn().mockReturnValue("10:00 AM to 11:00 AM"), // Example return value
}));

jest.mock("react-native-share");

const mockAppointmentDetails = {
  doctor: {
    name: "John",
    expertise: "Arms and legs",
    address: "1 Street street",
  },
  status: "UNCONFIRMED",
  startDate: "2024-04-24T00:00:00.000Z",
  startTime: "10:00:00",
  duration: 600,
  detail: "$ FOTINATOS Roula",
  reason: "CS",
  documents: [{ name: "Medical Record", url: "http://example.com/doc1" }],
  note: "Bring previous medications.",
};

describe("AppointmentDetailScreen", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders all appointment details correctly", () => {
    const route = { params: { appointmentDetails: mockAppointmentDetails } };
    const { getByText } = render(<AppointmentDetailScreen route={route} />);
    expect(getByText("DR. John")).toBeTruthy();
    expect(getByText("Unconfirmed")).toBeTruthy();
    expect(getByText("Bring previous medications.")).toBeTruthy();
  });

  it("navigates to doctor location on pressing address", () => {
    const route = { params: { appointmentDetails: mockAppointmentDetails } };
    const { getByText } = render(<AppointmentDetailScreen route={route} />);
    fireEvent.press(getByText("View Doctor's Location"));
    expect(onViewDoctorLocation).toHaveBeenCalledWith(mockAppointmentDetails);
  });

  it("adds appointment to calendar when prompted", () => {
    const route = { params: { appointmentDetails: mockAppointmentDetails } };
    const { getByText } = render(<AppointmentDetailScreen route={route} />);
    fireEvent.press(getByText("Add to Calendar"));
    expect(addAppointmentToCalendar).toHaveBeenCalledWith(
      mockAppointmentDetails
    );
  });

  it("shares appointment details when share button is pressed", () => {
    const route = { params: { appointmentDetails: mockAppointmentDetails } };
    const { getByText } = render(<AppointmentDetailScreen route={route} />);
    fireEvent.press(getByText("Share Appointment Details"));
    expect(shareAppointmentDetails).toHaveBeenCalledWith(
      mockAppointmentDetails
    );
  });

  it("opens a document when document link is pressed", () => {
    const route = { params: { appointmentDetails: mockAppointmentDetails } };
    const { getByText } = render(<AppointmentDetailScreen route={route} />);
    fireEvent.press(getByText("Medical Record"));
    expect(onDocumentPress).toHaveBeenCalledWith("http://example.com/doc1");
  });

  it("renders Unconfirmed status badge for unconfirmed appointments", () => {
    const unconfirmedAppointment = {
      ...mockAppointmentDetails,
      status: "UNCONFIRMED",
    };
    const route = { params: { appointmentDetails: unconfirmedAppointment } };
    const { getByText } = render(<AppointmentDetailScreen route={route} />);
    expect(getByText("Unconfirmed")).toBeTruthy();
  });

  it("renders Confirmed status badge for confirmed appointments", () => {
    const confirmedAppointment = {
      ...mockAppointmentDetails,
      status: "CONFIRMED",
    };
    const route = { params: { appointmentDetails: confirmedAppointment } };
    const { getByText } = render(<AppointmentDetailScreen route={route} />);
    expect(getByText("Confirmed")).toBeTruthy();
  });

  it("displays a no documents message when no documents are available", () => {
    const appointmentNoDocuments = { ...mockAppointmentDetails, documents: [] };
    const route = { params: { appointmentDetails: appointmentNoDocuments } };
    const { getByText } = render(<AppointmentDetailScreen route={route} />);
    expect(getByText("No documents available.")).toBeTruthy();
  });

  it("displays a message when there is no note", () => {
    const appointmentWithNoNote = { ...mockAppointmentDetails, note: "" };
    const route = { params: { appointmentDetails: appointmentWithNoNote } };
    const { getByText } = render(<AppointmentDetailScreen route={route} />);
    expect(getByText("You have no reminders.")).toBeTruthy();
  });

  it("shares appointment details when share button is pressed", async () => {
    const route = { params: { appointmentDetails: mockAppointmentDetails } };
    const { getByText } = render(<AppointmentDetailScreen route={route} />);

    fireEvent.press(getByText("Share Appointment Details"));

    await waitFor(() => {
      expect(shareAppointmentDetails).toHaveBeenCalledWith(mockAppointmentDetails);
      expect(share).toHaveBeenCalledWith({
        message: expect.stringContaining(`
    Appointment Details:
    Doctor: ${mockAppointmentDetails.doctor.name}
    Date: ${mockAppointmentDetails.startDate}
    Time: ${mockAppointmentDetails.startTime}
    Duration: ${mockAppointmentDetails.duration}
    Clinic: ${mockAppointmentDetails.detail}
    Note: ${mockAppointmentDetails.note}
  `)
      });
    });
  });
});
