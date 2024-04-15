import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AppointmentCalendar from './Calendar';
import { Calendar } from 'react-native-calendars';

jest.mock('react-native-calendars', () => ({
  Calendar: jest.fn(({ onDayPress, testID }) => (
    <button testID={testID} onPress={(day) => onDayPress(day)} title="Mock Calendar" />
  )),
}));

describe('CalendarScreen', () => {
  const mockAppointments = [
    { startDate: '2024-04-24T00:00:00.000Z' },
    { startDate: '2024-04-25T00:00:00.000Z' }
  ];

  it('renders with marked dates from appointments', () => {
    const { getByTestId } = render(
      <AppointmentCalendar appointmentsFromApi={mockAppointments} onDaySelect={() => {}} />
    );

    expect(Calendar).toHaveBeenCalledWith(
      expect.objectContaining({
        markedDates: {
          '2024-04-24': {
            selected: true,
            marked: true,
            selectedColor: '#007aff',
            dotColor: '#fff',
          },
          '2024-04-25': {
            selected: true,
            marked: true,
            selectedColor: '#007aff',
            dotColor: '#fff',
          }
        },
      }),
      {}
    );
  });

  it('calls onDaySelect when a day is pressed', () => {
    const onDaySelectMock = jest.fn();
    const { getByTestId } = render(
      <AppointmentCalendar appointmentsFromApi={mockAppointments} onDaySelect={onDaySelectMock} />
    );
    fireEvent.press(getByTestId('calendar'), { dateString: '2024-04-24' });
    expect(onDaySelectMock).toHaveBeenCalledWith({ dateString: '2024-04-24' });
  });

  it('does not mark dates without appointments', () => {
    const { getByTestId } = render(
      <AppointmentCalendar appointmentsFromApi={[]} onDaySelect={() => {}} />
    );
    expect(Calendar).toHaveBeenCalledWith(
      expect.objectContaining({
        markedDates: {}
      }),
      {}
    );
  });

  it('handles invalid date inputs gracefully', () => {
    const onDaySelectMock = jest.fn();
    const invalidDates = [{ startDate: 'invalid-date' }];
    render(
      <AppointmentCalendar appointmentsFromApi={invalidDates} onDaySelect={onDaySelectMock} />
    );
    expect(Calendar).toHaveBeenCalledWith(
      expect.objectContaining({
        markedDates: {}
      }),
      {}
    );
  });


});
