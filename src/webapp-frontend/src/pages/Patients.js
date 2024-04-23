import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import PatientList from "../components/PatientList";
import PatientDetail from "../components/PatientDetail";
import SearchBar from "../components/SearchBar";
import AppointmentsTable from "../components/AppointmentTable";
import "../styles/Patients.css";
import CreatePatientModal from "../components/CreatePatientModal";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const handleSavePatient = (updatedPatientData) => {
    // Here you would make an API call to update the patient data
    console.log("Updated Patient Data:", updatedPatientData);
    const updatedPatients = patients.map((patient) =>
      patient.patientId === updatedPatientData.patientId
        ? updatedPatientData
        : patient
    );
    setPatients(updatedPatients);

    // Deselect the current patient, or reselect to force details to update
    setSelectedPatient(null);
    setSelectedPatient(updatedPatientData);
  };

  const handleDeletePatient = (patientId) => {
    // Handle deleting the patient here
  };

  const handleCreatePatient = () => {
    setCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setCreateModalOpen(false);
  };

  const handleNewPatientData = (newPatient) => {
    // Here you would send the new patient data to the backend
    // For now, we'll just console log it and pretend we're submitting it
    console.log(newPatient);
    // After submission, you might want to close the modal and refresh the patient list
    handleCloseModal();
    // fetch new list or add to current list
  };

  useEffect(() => {
    // Fetch the patient data from an API endpoint here.
    // The below is an example using a static patient object.
    const patientData = [
      {
        patientId: 3,
        firstname: "Zara",
        middleName: "Doe",
        surname: "Smith",
        dob: "1990-01-01T00:00:00Z",
        email: "john.doe@example.com",
        street: "123 Main St",
        suburb: "Cityville",
        state: "California",
      },
      {
        patientId: 4,
        firstname: "Ethan",
        middleName: "Kyle",
        surname: "Johnson",
        dob: "1984-05-15T00:00:00Z",
        email: "ethan.johnson@example.com",
        street: "456 Oak Lane",
        suburb: "Springfield",
        state: "Oregon",
      },
    ];

    // Simulate an API call with a hardcoded delay
    setTimeout(() => setPatients(patientData), 1000);
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      const appointmentData = [
        {
          id: 3,
          detail: "Routine checkup",
          reason: "General health.",
          note: "No specific notes",
          dateCreate: "2022-04-08T10:30:00Z",
          lastUpdated: "2022-04-08T12:45:00Z",
          startTime: "10:30:00",
          startDate: "2022-04-15",
          duration: 60,
          patientId: 3,
          providerId: 3,
        },
      ];
      const patientAppointments = appointmentData.filter(
        (a) => a.patientId === selectedPatient.patientId
      );
      setAppointments(patientAppointments);
    }
  }, [selectedPatient]);

  const handleSearchChange = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  const handleSelectPatient = (patient) => {
    // Only update state if a different patient is selected or if no patient is currently selected
    if (!selectedPatient || patient.patientId !== selectedPatient.patientId) {
      setSelectedPatient(patient);
      // Reset appointments when changing selection
      setAppointments([]);
    }
  };

  const filteredPatients = searchQuery
    ? patients.filter(
        (p) =>
          p.firstname.toLowerCase().includes(searchQuery) ||
          p.surname.toLowerCase().includes(searchQuery) ||
          String(p.patientId).includes(searchQuery)
      )
    : patients;

  return (
    <div>
      <NavBar />
      <div className="patients-container">
        <div className="patients-detail">
          <PatientDetail
            patient={selectedPatient}
            onSave={handleSavePatient}
            onDelete={handleDeletePatient}
          />
          {selectedPatient && <AppointmentsTable appointments={appointments} />}
        </div>
        <div className="patients-list">
          <div className="patients-list-header">
            <h2>Patients</h2>
            <div className="patients-search-bar">
              <SearchBar onSearchChange={handleSearchChange} />
            </div>
          </div>
          <PatientList
            patients={filteredPatients}
            onSelectPatient={handleSelectPatient}
          />
          <button onClick={handleCreatePatient} className="create-patient-btn">
            Create New Patient
          </button>
          {isCreateModalOpen && (
            <CreatePatientModal
              isVisible={isCreateModalOpen}
              onClose={handleCloseModal}
              onCreate={handleNewPatientData}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Patients;
