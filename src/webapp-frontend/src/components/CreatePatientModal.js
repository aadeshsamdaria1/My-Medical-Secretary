import React, { useState } from "react";
import "../styles/Patients.css";

const CreatePatientModal = ({ isVisible, onClose, onCreate }) => {
  const [patient, setPatient] = useState({
    patientId: "",
    firstname: "",
    middleName: "",
    surname: "",
    dob: "",
    email: "",
    address: "",
    suburb: "",
    state: "",
  });
  if (!isVisible) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedPatient = {
      ...patient,
      // Manually add a patient id and format the date of birth
      patientId: "10000",
      dob: `${patient.dob}T00:00:00Z`, 
    };
    onCreate(formattedPatient);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2>Create Patient</h2>
          <button onClick={onClose} className="modal-close-btn">
            X
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            name="firstname"
            type="text"
            placeholder="First Name"
            required
            onChange={handleInputChange}
            value={patient.firstname}
          />
          <input
            name="middleName"
            type="text"
            placeholder="Middle Name"
            onChange={handleInputChange}
            value={patient.middleName}
          />
          <input
            name="surname"
            type="text"
            placeholder="Last Name"
            required
            onChange={handleInputChange}
            value={patient.surname}
          />
          <input
            name="dob"
            type="date"
            placeholder="Date of Birth"
            required
            onChange={handleInputChange}
            value={patient.dob}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            onChange={handleInputChange}
            value={patient.email}
          />
          {/* <input
            name="phone"
            type="tel"
            placeholder="Phone"
            onChange={handleInputChange}
            value={patient.phone}
          /> */}
          <input
            name="address"
            type="text"
            placeholder="Address"
            onChange={handleInputChange}
            value={patient.address}
          />
          <input
            name="suburb"
            type="text"
            placeholder="Suburb"
            onChange={handleInputChange}
            value={patient.suburb}
          />
          <input
            name="state"
            type="text"
            placeholder="State"
            onChange={handleInputChange}
            value={patient.state}
          />
          <div className="modal-form-button-container">
            <button type="submit" className="modal-form-button create">
              Create
            </button>
            <button
              type="button"
              onClick={onClose}
              className="modal-form-button cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePatientModal;
