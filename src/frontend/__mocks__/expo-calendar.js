// __mocks__/expo-calendar.js
const Calendar = {
    requestCalendarPermissionsAsync: jest.fn(),
    getCalendarsAsync: jest.fn(),
    createEventAsync: jest.fn(),
  };
  
  export default Calendar;