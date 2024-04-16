import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AppointmentDetailsModal from '../../components/AppointmentDetailsModal';
// Mock appointment
const mockAppointment = {
  id: 1,
  detail: 'Routine checkup',
  reason: 'General health',
  note: 'No specific notes',
  startDate: '2022-04-15T00:00:00.000+00:00',
  startTime: '10:30:00',
  duration: 60,
  doctor: {
    name: 'John Doe',
    expertise: 'General Practitioner',
    contact: '123-456-7890',
    email: 'john.doe@example.com',
    website: 'https://www.example.com',
    address: '123 Main St, Anytown USA',
  },
};

describe('AppointmentDetailsModal', () => {
  it('renders appointment details correctly', () => {
    const { getByText } = render(
      <AppointmentDetailsModal visible={true} appointment={mockAppointment} onClose={() => {}} />
    );

    expect(getByText('Appointment Details')).toBeTruthy();
    expect(getByText('Detail: Routine checkup')).toBeTruthy();
    expect(getByText('Reason: General health')).toBeTruthy();
    expect(getByText('Note: No specific notes')).toBeTruthy();
    expect(getByText('Date: 15/4/2022')).toBeTruthy();
    expect(getByText('Time: 10:30:00')).toBeTruthy();
    expect(getByText('Duration: 60 minutes')).toBeTruthy();
    expect(getByText("Doctor's Details")).toBeTruthy();
    expect(getByText('Name: John Doe')).toBeTruthy();
    expect(getByText('Expertise: General Practitioner')).toBeTruthy();
    expect(getByText('Contact: 123-456-7890')).toBeTruthy();
    expect(getByText('Email: john.doe@example.com')).toBeTruthy();
    expect(getByText('Website: https://www.example.com')).toBeTruthy();
    expect(getByText('Address: 123 Main St, Anytown USA')).toBeTruthy();
  });

  it('renders error message when appointment is not provided', () => {
    const { getByText } = render(<AppointmentDetailsModal visible={true} appointment={null} onClose={() => {}} />);
    expect(getByText('Error while loading appointment details')).toBeTruthy();
  });

  it('closes the modal when the close button is pressed', () => {
    const onCloseMock = jest.fn();
    const { getByTestId } = render(
      <AppointmentDetailsModal visible={true} appointment={mockAppointment} onClose={onCloseMock} />
    );

    const closeButton = getByTestId('close-modal');
    fireEvent.press(closeButton);
    expect(onCloseMock).toHaveBeenCalled();
  });
});