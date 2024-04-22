import React, { useState, useEffect } from 'react';

const PatientDetail = ({ patient, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstname: '',
    middleName: '',
    surname: '',
    dob: '',
    email: '',
    phone: '',
    accountStatus: '',
    password: '',
  });

  useEffect(() => {
    if (patient) {
      setEditFormData({
        firstname: patient.firstname || '',
        middleName: patient.middleName || '',
        surname: patient.surname || '',
        dob: patient.dob || '',
        email: patient.email || '',
        phone: patient.phone || '',
        accountStatus: patient.accountStatus || '',
        password: patient.password || '',
      });
    }
  }, [patient]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    onSave(editFormData);
    setIsEditing(false);
  };

  return (
    <div className="patients-detail-card">
      <h2>Patient Details</h2>
      {Object.entries(editFormData).map(([key, value]) => (
        <div className="patients-detail-row" key={key}>
          <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
          <input
            type={key === 'password' ? 'password' : 'text'}
            name={key}
            value={value}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
        </div>
      ))}
      <div className="patients-detail-actions">
        {isEditing ? (
          <>
            <button onClick={handleSaveClick} className="patients-save-btn">
              Save
            </button>
            <button onClick={handleCancelClick} className="patients-cancel-btn">
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={handleEditClick} className="patients-edit-btn">
              Edit
            </button>
            <button onClick={() => onDelete(patient?.patientId)} className="patients-delete-btn">
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PatientDetail;
