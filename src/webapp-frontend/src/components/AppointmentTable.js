import React from "react";
import "../styles/Patients.css";

const AppointmentsTable = ({ appointments }) => (
  <div className="appointments-container">
    <div className="appointment-title">
      <h1>Upcoming Appointments</h1>
    </div>
    {appointments.length > 0 ? (
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
              <td>{appointment.startDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <div className="no-appointments">
        <p>No upcoming appointments</p>
      </div>
    )}
  </div>
);

export default AppointmentsTable;

  