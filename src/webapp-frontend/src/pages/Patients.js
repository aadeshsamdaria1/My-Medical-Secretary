import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import PatientList from "../components/PatientList";
import PatientDetail from "../components/PatientDetail";
import SearchBar from "../components/SearchBar";
import "../styles/Patients.css";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
    ];
    // Simulate an API call with a hardcoded delay
    setTimeout(() => setPatients(patientData), 1000);
  }, []);

  const handleSearchChange = (query) => {
    setSearchQuery(query.toLowerCase());
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
          <div className="patient-details">
            {selectedPatient && <PatientDetail patient={selectedPatient} />}
            <div>Form with patient details</div>
          </div>
          <div className="patient-list-container">
            <SearchBar onSearchChange={handleSearchChange} />
            <PatientList patients={filteredPatients} onSelectPatient={setSelectedPatient} />
          </div>
        </div>
      </div>
    );
}

export default Patients;
