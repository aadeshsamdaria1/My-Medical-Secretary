import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import PatientList from "../components/PatientList";
import PatientDetail from "../components/PatientDetail";
import SearchBar from "../components/SearchBar";
import AppointmentsTable from "../components/AppointmentTable";
import "../styles/Patients.css";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointments, setAppointments] = useState([]); // Add this line
  const [searchQuery, setSearchQuery] = useState("");
  

  const handleEditPatient = (patient) => {
    // Handle editing the patient here
  }

  const handleDeletePatient = (patientId) => {
    // Handle deleting the patient here
  }

  

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
      } 
    ];
    
    // Simulate an API call with a hardcoded delay
    setTimeout(() => setPatients(patientData), 1000);
  }, []);

  useEffect(() => {
      if (selectedPatient){
        const appointmentData = [
          {
            "id": 3,
            "detail": "Routine checkup",
            "reason": "General health.",
            "note": "No specific notes",
            "dateCreate": "2022-04-08T10:30:00Z",
            "lastUpdated": "2022-04-08T12:45:00Z",
            "startTime": "10:30:00",
            "startDate": "2022-04-15",
            "duration": 60,
            "patientId": 3,
            "providerId": 3
          } 
        ];
        const patientAppointments = appointmentData.filter((a) => a.patientId === selectedPatient.patientId);
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
            <PatientDetail patient={selectedPatient} onEdit={handleEditPatient} onDelete={handleDeletePatient} />
            {selectedPatient && <AppointmentsTable appointments={appointments} />}
          </div>
          <div className="patients-list">
            <SearchBar onSearchChange={handleSearchChange} />
            <PatientList patients={filteredPatients} onSelectPatient={handleSelectPatient} />
          </div>
        </div>
      </div>
    );
  }


export default Patients;
