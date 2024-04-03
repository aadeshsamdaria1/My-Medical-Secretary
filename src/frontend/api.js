// api.js
export const API_ENDPOINT = 'http://mymedicalsecretary.uk.to:8080/api';
export const getUserEndpoint = (userId) => `${API_ENDPOINT}/users/get/${userId}`;
