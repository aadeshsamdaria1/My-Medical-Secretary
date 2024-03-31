import React from "react";
import { Calendar } from "react-native-calendars";

const CalendarScreen = ({ markedDates, onDaySelect }) => {
  return (
    <Calendar
      onDayPress={(day) => {
        onDaySelect(day);
      }}
      markedDates={Object.keys(markedDates).reduce((acc, date) => {
        acc[date] = {
          selected: true,
          marked: true,
          selectedColor: 'green',
          dotColor: 'orange',
        };
        return acc;
      }, {})}
    />
  );
};

export default CalendarScreen;

