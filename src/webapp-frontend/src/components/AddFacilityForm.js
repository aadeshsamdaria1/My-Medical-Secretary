import React, { useState } from 'react';

const AddFacilityForm = ({ onCancel, onSave }) => {
  const [newFacility, setNewFacility] = useState({
    name: '',
    contact: '',
    address: '',
    fax: '',
    website: '',
    facilityType: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setNewFacility({ ...newFacility, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!newFacility.name.trim()) {
      setError('Facility name is required');
      return;
    }
    onSave(newFacility);
    onCancel();
  };

  return (
    <div>
      <h2>Add New Facility</h2>
      {error && <div className="error">{error}</div>}
      <div className="facility-info">
        <div className="facility-info-row">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={newFacility.name}
            onChange={handleInputChange}
            className="facility-input"
          />
        </div>
        <div className="facility-info-row">
          <label>Contact:</label>
          <input
            type="text"
            name="contact"
            value={newFacility.contact}
            onChange={handleInputChange}
            className="facility-input"
          />
        </div>
        <div className="facility-info-row">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={newFacility.address}
            onChange={handleInputChange}
            className="facility-input"
          />
        </div>
        <div className="facility-info-row">
          <label>Fax:</label>
          <input
            type="text"
            name="fax"
            value={newFacility.fax}
            onChange={handleInputChange}
            className="facility-input"
          />
        </div>
        <div className="facility-info-row">
          <label>Website:</label>
          <input
            type="text"
            name="website"
            value={newFacility.website}
            onChange={handleInputChange}
            className="facility-input"
          />
        </div>
        <div className="facility-info-row">
          <label>Facility Type:</label>
          <input
            type="text"
            name="facilityType"
            value={newFacility.facilityType}
            onChange={handleInputChange}
            className="facility-input"
          />
        </div>
      </div>
      <div className="facility-actions">
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

export default AddFacilityForm;
