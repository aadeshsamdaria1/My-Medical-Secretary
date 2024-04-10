// api.js
export const API_ENDPOINT = 'http://mymedicalsecretary.uk.to:8080/api';
export const getUserEndpoint = (userId) => `${API_ENDPOINT}/users/get_patient/${userId}`;
export const getAppointmentsByUserEndpoint = (userId) => `${API_ENDPOINT}/appointments/get_all/${userId}`;

