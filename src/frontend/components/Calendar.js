import React from "react";
import { Calendar } from "react-native-calendars";

const AppointmentCalendar = ({ appointmentsFromApi, onDaySelect, onMonthChange, selectedMonth, selectedYear }) => {
  const markedDates = appointmentsFromApi.reduce((acc, appointment) => {
    const formattedDate = appointment.startDate.split("T")[0];
    acc[formattedDate] = {
      selected: true,
      marked: true,
      selectedColor: "#007aff",
      dotColor: "#fff",
    };
    return acc;
  }, {});

  return (
    <Calendar
      testID="calendar"
      onDayPress={(day) => {
        onDaySelect(day);
      }}
      onVisibleMonthsChange={(months) => {
        const { year, month } = months[0];
        onMonthChange(month, year);
      }}
      markedDates={markedDates}
      current={`${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`}
      theme={{
        'stylesheet.calendar.main': {
          week: {
            marginTop: 7,
            marginBottom: 7,
            flexDirection: 'row',
            justifyContent: 'space-around'
          }
        },
        'stylesheet.day.basic': {
          base: {
            width: 32,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
          },
        },
        today: {
          borderColor: '#007AFF',
          borderWidth: 2, 
          borderRadius: 17,
        },
        todayText: {
          color: '#ff3b30', 
          fontWeight: 'bold', 
        },
        textDay: {
          fontSize: 16,
          color: '#666',
          fontWeight: '600',
        },
      }}
    />
  );
};

export default AppointmentCalendar;