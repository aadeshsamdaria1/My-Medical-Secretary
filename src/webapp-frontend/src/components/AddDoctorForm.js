// AddDoctorForm.js
import React, { useState } from 'react';

const AddDoctorForm = ({ onCancel, onSave }) => {
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    expertise: '',
    address: '',
    contact: '',
    email: '',
    website: '',
  });

  const handleInputChange = (e) => {
    setNewDoctor({ ...newDoctor, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(newDoctor);
    onCancel();
  };

  return (
    <div>
      <h2>Add New Doctor</h2>
      <div className="doctor-info">
        <div className="doctor-info-row">
          <label>ID:</label>
          <input
            type="text"
            name="id"
            value={newDoctor.id}
            onChange={handleInputChange}
            className="doctor-input"
          />
        </div>
        <div className="doctor-info-row">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={newDoctor.name}
            onChange={handleInputChange}
            className="doctor-input"
          />
        </div>
        <div className="doctor-info-row">
          <label>Expertise:</label>
          <input
            type="text"
            name="expertise"
            value={newDoctor.expertise}
            onChange={handleInputChange}
            className="doctor-input"
          />
        </div>
        <div className="doctor-info-row">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={newDoctor.address}
            onChange={handleInputChange}
            className="doctor-input"
          />
        </div>
        <div className="doctor-info-row">
          <label>Contact:</label>
          <input
            type="text"
            name="contact"
            value={newDoctor.contact}
            onChange={handleInputChange}
            className="doctor-input"
          />
        </div>
        <div className="doctor-info-row">
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={newDoctor.email}
            onChange={handleInputChange}
            className="doctor-input"
          />
        </div>
        <div className="doctor-info-row">
          <label>Website:</label>
          <input
            type="text"
            name="website"
            value={newDoctor.website}
            onChange={handleInputChange}
            className="doctor-input"
          />
        </div>

      </div>
      <div className="doctor-actions">
        <button onClick={handleSave} className="edit-btn">
          Save
        </button>
        <button onClick={onCancel} className="close-btn">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddDoctorForm;