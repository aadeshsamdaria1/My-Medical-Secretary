import React from 'react';
import renderer from 'react-test-renderer';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import HomeScreen from '../../screens/HomeScreen';
jest.mock('../../api');

const mockUserData = {
    "mmsId": 1,
    "email": "roulaf@haus.com.au",
    "patientId": 421,
    "firstname": "Roula",
    "middleName": "",
    "surname": "Fotinatos",
    "dob": "1965-08-01T00:00:00Z",
    "address": "13 Carrigal Street",
    "suburb": "Balwyn",
    "state": "VIC"
}
const mockUpcomingAppointments = [
    {
      id: 1,
      detail: "Routine checkup",
      reason: "General health",
      note: "No specific notes",
      startDate: "2022-04-15T00:00:00.000+00:00",
      startTime: "10:30:00",
      duration: 60,
      doctor: {
        name: "John Doe",
        expertise: "General Practitioner",
        contact: "123-456-7890",
        email: "john.doe@example.com",
        website: "https://www.example.com",
        address: "123 Main St, Anytown USA",
      },
    },
    {
      id: 2,
      detail: "Follow-up visit",
      reason: "Knee injury",
      note: "Bring X-ray reports",
      startDate: "2022-04-20T00:00:00.000+00:00",
      startTime: "14:00:00",
      duration: 45,
      doctor: {
        name: "Jane Smith",
        expertise: "Orthopedic Surgeon",
        contact: "987-654-3210",
        email: "jane.smith@example.com",
        website: "https://www.orthoclinic.com",
        address: "456 Oak St, Anytown USA",
      },
    },
    {
      id: 3,
      detail: "Annual physical",
      reason: "Preventive care",
      note: "Fasting required",
      startDate: "2022-05-01T00:00:00.000+00:00",
      startTime: "09:00:00",
      duration: 90,
      doctor: {
        name: "Michael Johnson",
        expertise: "Family Medicine",
        contact: "555-123-4567",
        email: "michael.johnson@example.com",
        website: "https://www.familyclinic.org",
        address: "789 Maple Ave, Anytown USA",
      },
    },
  ];
  
describe('HomeScreen', () => {
  const route = { params: { userId: 1 } };
  beforeEach(() => {
    jest.spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockUserData),
      })
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockUpcomingAppointments),
      });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });


  it('renders correctly with valid route params', () => {
    const tree = renderer.create(<HomeScreen route={route} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('fetches and displays user name correctly', async () => {
    const { getByText } = render(<HomeScreen route={route} />);
    await waitFor(() => expect(getByText(`Hi, ${mockUserData.firstname}`)).toBeTruthy());
  });

  it('displays "No upcoming appointments" message when there are no appointments', async () => {
    jest.spyOn(global, 'fetch')
    .mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockUserData),
    })
    .mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce([]),
    });
    const { getByText } = render(<HomeScreen route={route} />);
    await waitFor(() => expect(getByText('No upcoming appointments')).toBeTruthy());
  });

  it('shows more appointments when "Show More" button is clicked', async () => {
    const { getByText, queryByText } = render(<HomeScreen route={route} />);
    await waitFor(() => {
      fireEvent.press(getByText('Show More'));
      expect(queryByText('Show Less')).toBeTruthy();
    });
  });

  it('hides appointments when "Show Less" button is clicked', async () => {
    const { getByText, queryByText, getAllByTestId } = render(<HomeScreen route={route} />);
    await waitFor(() => {
      fireEvent.press(getByText('Show More'));
      expect(queryByText('Show Less')).toBeTruthy();
      fireEvent.press(getByText('Show Less'));
      expect(queryByText('Show More')).toBeTruthy();
    });
  });
  
  it('opens appointment details modal when an appointment item is pressed', async () => {
    const { getByTestId, getAllByTestId  } = render(<HomeScreen route={route} />);
    const appointmentItems = await waitFor(() => getAllByTestId ('appointment-item'));
    const firstAppointmentItem = appointmentItems[0];
    fireEvent.press(firstAppointmentItem);
    const modal = getByTestId('appointment-modal');
    expect(modal).toBeTruthy();
  });

  it('closes appointment details modal when close button is pressed', async () => {
    const { queryByTestId, getByTestId, getAllByTestId  } = render(<HomeScreen route={route} />);
    const appointmentItems = await waitFor(() => getAllByTestId ('appointment-item'));
    const firstAppointmentItem = appointmentItems[0];
    fireEvent.press(firstAppointmentItem);
    const modal = getByTestId('appointment-modal');
    expect(modal).toBeTruthy();
    const closeButton = getByTestId('close-modal');
    fireEvent.press(closeButton);
    expect(queryByTestId('appointment-modal')).toBeNull();
  });
//TODO: Should write test cases for the messages section
});