import React from "react";
import "../styles/Patients.css"; // Make sure the CSS file is correctly linked

const PatientList = ({ patients, onSelectPatient }) => {
  return (
    <div className="patients-list">
      <table className="patients-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Date of Birth</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr
              key={patient.patientId}
              onClick={() => onSelectPatient(patient)}
            >
              <td>{patient.patientId}</td>
              <td>{`${patient.firstname} ${patient.surname}`}</td>
              <td>{new Date(patient.dob).toLocaleDateString()}</td>
              <td>{patient.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;
