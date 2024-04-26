import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import PatientList from "../components/PatientList";
import PatientDetail from "../components/PatientDetail";
import SearchBar from "../components/SearchBar";
import AppointmentsTable from "../components/AppointmentTable";
import { getAllPatients, getPatientAppointments } from "../utils/patientsAPI";
import "../styles/Patients.css";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPatients = await getAllPatients();
        setPatients(fetchedPatients);
      } catch (error) {
        console.error('Failed to fetch patients:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (selectedPatient) {
        try {
          const fetchedAppointments = await getPatientAppointments(selectedPatient.patientId);
          setAppointments(fetchedAppointments);
        } catch (error) {
          console.error('Failed to fetch appointments:', error);
        }
      }
    };
    fetchAppointments();
  }, [selectedPatient]);

  const handleSearchChange = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    // Reset appointments when changing selection
    setAppointments([]);
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
            <PatientDetail patient={selectedPatient} />
            {selectedPatient && <AppointmentsTable appointments={appointments} />}
          </div>
          <div className="patients-list-container">
            <div className="patients-list-header">
              <h2>Patients</h2>
              <div className="patients-search-bar">
                <SearchBar onSearchChange={handleSearchChange} />
              </div>
            </div>
            <div className="patients-list-scrollable">
              <PatientList patients={filteredPatients} onSelectPatient={handleSelectPatient} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Patients;
