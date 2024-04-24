import React from "react";
import "../styles/Patients.css";

const AppointmentsTable = ({ appointments }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="appointments-container">
      <div className="appointment-title">
        <h1>Appointments</h1>
      </div>
      <table className="appointments-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Doctor</th>
            <th>Title</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.id}</td>
              <td>{appointment.providerId}</td>
              <td>{appointment.detail}</td>
              <td>{formatDate(appointment.startDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentsTable;
