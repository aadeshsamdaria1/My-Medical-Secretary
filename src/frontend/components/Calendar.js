import React from "react";
import { Calendar } from "react-native-calendars";

const CalendarScreen = ({ markedDates, onDaySelect }) => {
  return (
    <Calendar
      // Event Handler for when a day is pressed
      onDayPress={(day) => {
        onDaySelect(day);
      }}

      // Marked dates with custom styling
      markedDates={Object.keys(markedDates).reduce((acc, date) => {
        acc[date] = {
          selected: true,
          marked: true,
          selectedColor: "green",
          dotColor: "#fff",
        };
        return acc;
      }, {})}

      // Calendar theme customizations
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
            alignItems: 'center'
          },
        },
        textDayFontWeight: '400', // increased text weight
        textMonthFontWeight: '400', // increased text weight
        textDayHeaderFontWeight: '400', // increased text weight
        marginHorizontal: 16, // sets horizontal margin, but may not affect some calendar styles
      }}
    />
  );
};

export default CalendarScreen;
