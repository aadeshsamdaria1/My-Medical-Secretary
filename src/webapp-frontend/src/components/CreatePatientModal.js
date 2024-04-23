import React from "react";
import "../styles/Patients.css";

const CreatePatientModal = ({ isVisible, onClose, onSubmit }) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2>Create Patient</h2>
          <button onClick={onClose} className="modal-close-btn">
            X
          </button>
        </div>
        <form className="modal-form" onSubmit={onSubmit}>
          <input
            name="firstName"
            type="text"
            placeholder="First Name"
            required
            // add onChange handler as needed
          />
          <input
            name="middleName"
            type="text"
            placeholder="Middle Name"
            // add onChange handler as needed
          />
          <input
            name="lastName"
            type="text"
            placeholder="Last Name"
            required
            // add onChange handler as needed
          />
          <input
            name="dob"
            type="date"
            placeholder="Date of Birth"
            required
            // add onChange handler as needed
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            // add onChange handler as needed
          />
          <input
            name="phone"
            type="tel"
            placeholder="Phone"
            // add onChange handler as needed
          />
          <input
            name="street"
            type="text"
            placeholder="Street"
            // add onChange handler as needed
          />
          <input
            name="suburb"
            type="text"
            placeholder="Suburb"
            // add onChange handler as needed
          />
          <input
            name="state"
            type="text"
            placeholder="State"
            // add onChange handler as needed
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
