import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import PatientList from "../components/PatientList";
import PatientDetail from "../components/PatientDetail";
import SearchBar from "../components/SearchBar";
import AppointmentsTable from "../components/AppointmentTable";
import ResourceViewerPopup from "../components/ResourceViewerPopup";
import patientIcon from "../assets/patient-logo.png"
import "../styles/Patients.css";
import {
  getAllPatients,
  getAppointmentByPatientId,
} from "../utils/patientsAPI";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterByName, setFilterByName] = useState(true);
  const [showResourceViewer, setShowResourceViewer] = useState(false);

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
          const patientAppointments = appointmentData.filter(
            (a) => a.patient.patientId === selectedPatient.patientId
          );
          setAppointments(patientAppointments);
        } catch (error) {
          console.error("Failed to load appointment data:", error);
        }
      }
    };
    loadAppointments();
  }, [selectedPatient]);

  const handleSearchChange = (query, isByName) => {
    setSearchQuery(query.toLowerCase());
    setFilterByName(isByName);
  };

  const handleSelectPatient = (patient) => {
    if (!selectedPatient || patient.patientId !== selectedPatient.patientId) {
      setSelectedPatient(patient);
      setAppointments([]);
    }
  };

  const handleFilterChange = (isByName) => {
    setFilterByName(isByName);
  };

  const handleResourceViewerClick = () => {
    console.log("Resource Viewer clicked");
    setShowResourceViewer(true);
  };

  const handleCloseResourceViewer = () => {
    setShowResourceViewer(false);
  }

  const filteredPatients = patients
    .filter((patient) =>
      filterByName
        ? (patient.firstname + " " + patient.surname)
            .toLowerCase()
            .includes(searchQuery)
        : String(patient.patientId).includes(searchQuery)
    )
    .sort((a, b) =>
      filterByName
        ? (a.firstname + " " + a.surname).localeCompare(
            b.firstname + " " + b.surname
          )
        : a.patientId - b.patientId
    );
    

  return (
    <div>
      <NavBar />
      <div className="patients-container">
        <div className="patients-detail">
          
          {selectedPatient ? (
            <>
              <PatientDetail patient={selectedPatient} />
              <AppointmentsTable appointments={appointments} />
              <button
                onClick={handleResourceViewerClick}
                className="resource-viewer-btn"
              >
                Resource Viewer
              </button>
            </>
          ) : (
            
              <div className="patient-logo">
              <img src={patientIcon} alt="Patient Logo" />
              </div>
          
          )
            
          }
        </div>
        <div className="patients-list">
          <div className="patients-list-header">
            <h2>Patients</h2>
            <div className="patients-search-bar">
              <SearchBar
                onSearchChange={handleSearchChange}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>
          <div className="patients-list-scrollable">
            <PatientList
              patients={filteredPatients}
              onSelectPatient={handleSelectPatient}
            />
          </div>
        </div>
      </div>
      {showResourceViewer && (
        <ResourceViewerPopup
          // resources={dummyResources}
          onClose={handleCloseResourceViewer}
          selectedPatientId={selectedPatient.patientId}
        />
      )}
    </div>
  );
}

export default Patients;
