import React from 'react';

const PatientDetail = ({ patient, onEdit, onDelete }) => {
  // Determine if any patient data exists
  const hasPatientData = patient != null;

  // Function to display data or 'N/A'
  const displayData = (data) => hasPatientData ? data : '';

  return (
    <div className="patients-detail-card">
      <h2>Patient Details</h2>
      <div className="patients-detail-row">
        <label>First Name</label>
        <input type="text" value={displayData(patient?.firstname)} readOnly />
      </div>
      <div className="patients-detail-row">
        <label>Middle Name</label>
        <input type="text" value={displayData(patient?.middleName)} readOnly />
      </div>
      <div className="patients-detail-row">
        <label>Last Name</label>
        <input type="text" value={displayData(patient?.surname)} readOnly />
      </div>
      <div className="patients-detail-row">
        <label>DOB</label>
        <input type="text" value={displayData(patient?.dob)} readOnly />
      </div>
      <div className="patients-detail-row">
        <label>Email</label>
        <input type="text" value={displayData(patient?.email)} readOnly />
      </div>
      <div className="patients-detail-row">
        <label>Phone</label>
        <input type="text" value={displayData(patient?.phone)} readOnly />
      </div>
      <div className="patients-detail-row">
        <label>Account Status</label>
        <input type="text" value={displayData(patient?.accountStatus)} readOnly />
      </div>
      <div className="patients-detail-row">
        <label>Password</label>
        <input type="password" value={displayData(patient?.password)} readOnly />
      </div>
      <div className="patients-detail-actions">
        <button onClick={() => onEdit(patient)} className="patients-edit-btn">Edit</button>
        <button onClick={() => onDelete(patient?.patientId)} className="patients-delete-btn">Delete</button>
      </div>
    </div>
  );
};

export default PatientDetail;
