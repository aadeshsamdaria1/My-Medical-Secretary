import React from "react";
import { Calendar } from "react-native-calendars";

const CalendarScreen = ({ appointmentsFromApi, onDaySelect }) => {
  // Prepare markedDates from appointment data
  const markedDates = appointmentsFromApi.reduce((acc, appointment) => {
    // Extract just the date part from the startDate
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
      onDayPress={(day) => {
        onDaySelect(day);
      }}

      markedDates={markedDates}

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
        textDayFontFamily: 'System',
        textMonthFontFamily: 'System',
        textDayHeaderFontFamily: 'System',
        textDayFontWeight: '500',
        textMonthFontWeight: 'bold',
        textDayHeaderFontWeight: '500',
        textDayFontSize: 16,
        textMonthFontSize: 20,
        textDayHeaderFontSize: 16,
        marginHorizontal: 30, 
      }}
    />
  );
};

export default CalendarScreen;
