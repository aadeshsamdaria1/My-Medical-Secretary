import React from 'react';

const PatientDetail = ({ patient }) => {
  return (
    <div className="patients-detail-card">
      <h2>Patient Details</h2>
      {patient && (
        <>
          <div className="patients-detail-row">
            <label>First Name</label>
            <div>{patient.firstname}</div>
          </div>
          <div className="patients-detail-row">
            <label>Middle Name</label>
            <div>{patient.middleName}</div>
          </div>
          <div className="patients-detail-row">
            <label>Surname</label>
            <div>{patient.surname}</div>
          </div>
          <div className="patients-detail-row">
            <label>Date of Birth</label>
            <div>{patient.dob}</div>
          </div>
          <div className="patients-detail-row">
            <label>Email</label>
            <div>{patient.email}</div>
          </div>
          <div className="patients-detail-row">
            <label>Phone</label>
            <div>{patient.phone}</div>
          </div>
          <div className="patients-detail-row">
            <label>Account Status</label>
            <div>{patient.accountStatus}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientDetail;
