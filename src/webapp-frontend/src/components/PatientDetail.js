import React from 'react';

const PatientDetail = ({ patient }) => {
  return (
    <div className="patient-detail">
      <h2>Patient Details</h2>
      <p>First Name: {patient.firstname}</p>
      <p>Middle Name: {patient.middleName}</p>
      <p>Last Name: {patient.surname}</p>
      <p>Date of Birth: {new Date(patient.dob).toLocaleDateString()}</p>
      <p>Email: {patient.email}</p>
      <p>Address: {`${patient.street}, ${patient.suburb}, ${patient.state}`}</p>
    </div>
  );
};

export default PatientDetail;
