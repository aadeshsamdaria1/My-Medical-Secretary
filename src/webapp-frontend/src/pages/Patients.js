import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import PatientList from "../components/PatientList";
import PatientDetail from "../components/PatientDetail";
import SearchBar from "../components/SearchBar";
import AppointmentsTable from "../components/AppointmentTable";
import "../styles/Patients.css";
import CreatePatientModal from "../components/CreatePatientModal";
import {
  getAllPatients,
  createPatient,
  getAppointmentByPatientId,
} from "../utils/patientsAPI";

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
    console.log("New Patient Data:", newPatient);
    createPatient(newPatient);
    handleCloseModal();
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const fetchedPatients = await getAllPatients();
      setPatients(fetchedPatients);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    }
  };

  useEffect(() => {
    const loadAppointments = async () => {
      if (selectedPatient) {
        try {
          const appointmentData = await getAppointmentByPatientId(
            selectedPatient.patientId
          );
          console.log(appointmentData);
          const patientAppointments = appointmentData.filter(
            (a) => a.patient.patientId === selectedPatient.patientId
          );
          console.log(patientAppointments);
          setAppointments(patientAppointments);
        } catch (error) {
          console.error("Failed to load appointment data:", error);
        }
      }
    };

    loadAppointments();
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
          <div className="patients-list-scrollable">
            <PatientList
              patients={filteredPatients}
              onSelectPatient={handleSelectPatient}
            />
          </div>
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
