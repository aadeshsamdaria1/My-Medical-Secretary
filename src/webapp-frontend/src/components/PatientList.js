import React from "react";
import "../styles/PatientList.css"; // Make sure the CSS file is correctly linked

const PatientList = ({ patients, onSelectPatient }) => {
  return (
    <div className="patient-list-container">
      <table className="patient-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>DOB</th>
            <th>Account Status</th>
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
              <td>{patient.accountStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;
