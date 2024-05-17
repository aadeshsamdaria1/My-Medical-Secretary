import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import '../styles/Doctors.css';
import deleteIcon from '../assets/delete-icon.png';
import doctorsIcon from '../assets/doctors-logo.jpg';
import { getAllDoctors, addDoctor, deleteDoctor, updateDoctor } from '../utils/doctorsAPI';
import AddDoctorForm from '../components/AddDoctorForm';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [filterOption, setFilterOption] = useState('name');
  const [filterCount, setFilterCount] = useState(null);
  const [filterValue, setFilterValue] = useState('');
  const [showAddDoctorForm, setShowAddDoctorForm] = useState(false);


  const resetJwtTesting = () => {
    console.log("resetting jwt")
    // Function for testing expired JWT token, uncomment below to set to expored token
    // when the add doctor button is pressed
    // localStorage.setItem("jwtToken", "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTcxMzQxNTkyNCwiZXhwIjoxNzEzNDE5NTI0fQ.Lb86BogS7O0Tj4H2oKHG5q2SorpBmpNRsfoDECVMxEMhYhOTvtF3kIGQabkKNjv60CtuhyOiNIh1J8m4teUsRw")
  }

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const fetchedDoctors = await getAllDoctors();
      setDoctors(fetchedDoctors);
    } catch (error) {
      console.error('Failed to fetch doctors:', error)
    }
  };

  const handleFilterChange = (option) => {
    setFilterOption(option);
  };

  const handleFilterCountChange = (count) => {
    setFilterCount(count);
  };

  const handleFilterValueChange = (value) => {
    setFilterValue(value);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleAddDoctor = () => {
    // TODO Remove this testing line
    resetJwtTesting();
    
    setShowAddDoctorForm(true);
    setSelectedDoctor(null);
  };
  
  const handleDeleteDoctor = async () => {
    if (selectedDoctor) {
      try {
        await deleteDoctor(selectedDoctor.id);
        setSelectedDoctor(null);
        fetchDoctors();
      } catch (error) {
        console.error("Failed to delete doctor:", error);
      }
      
      
    }
  };
  
  const handleEditDoctor = async () => {
    if (selectedDoctor) {
      const updatedDoctor = {
        ...selectedDoctor,
        name: selectedDoctor.name,
        expertise: selectedDoctor.expertise,
        address: selectedDoctor.address,
        contact: selectedDoctor.contact,
        email: selectedDoctor.email,
        website: selectedDoctor.website,
      };
      try {
        await updateDoctor(updatedDoctor);
        setSelectedDoctor(null);
        fetchDoctors();
      } catch (error) {
        console.error("Failed to update doctor:", error);
      }

    }
  };

  const handleCloseDoctor = () => {
    setSelectedDoctor(null);
  };

  const handleSaveNewDoctor = async (newDoctor) => {
    try {
      await addDoctor(newDoctor);
      setShowAddDoctorForm(false);
      fetchDoctors();
    } catch (error) {
      console.error("Failed to save new doctor:", error);
    }
  };

  const filteredDoctors = filterCount
    ? doctors
        .filter((doctor) => {
          if (filterOption === 'name') {
            return doctor.name.toLowerCase().includes(filterValue.toLowerCase());
          } else if (filterOption === 'id') {
            return doctor.id.toString().includes(filterValue);
          } else {
            return doctor.expertise.toLowerCase().includes(filterValue.toLowerCase());
          }
        })
        .sort((a, b) => {
          if (filterOption === 'name') {
            return a.name.localeCompare(b.name);
          } else if (filterOption === 'id') {
            return a.id - b.id;
          } else {
            return a.expertise.localeCompare(b.expertise);
          }
        })
        .slice(0, filterCount)
    : doctors
        .filter((doctor) => {
          if (filterOption === 'name') {
            return doctor.name.toLowerCase().includes(filterValue.toLowerCase());
          } else if (filterOption === 'id') {
            return doctor.id.toString().includes(filterValue);
          } else {
            return doctor.expertise.toLowerCase().includes(filterValue.toLowerCase());
          }
        })
        .sort((a, b) => {
          if (filterOption === 'name') {
            return a.name.localeCompare(b.name);
          } else if (filterOption === 'id') {
            return a.id - b.id;
          } else {
            return a.expertise.localeCompare(b.expertise);
          }
        });

  return (
    <div>
      <NavBar />
      <div className="doctors-page">
        <div className="doctors-list">
            <div className="filter-options">
                <div className="filter-group">
                    <span className="filter-label">Filter by:</span>
                    <div className="filter-buttons">
                        <button
                            className={`filter-btn ${filterOption === 'name' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('name')}
                        >
                            Name
                        </button>
                        <button
                            className={`filter-btn ${filterOption === 'id' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('id')}
                        >
                            ID
                        </button>
                        <button
                            className={`filter-btn ${filterOption === 'expertise' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('expertise')}
                        >
                            Expertise
                        </button>
                    </div>
                    <br />
                    <input
                    type="text"
                    placeholder={`Enter ${filterOption}`}
                    value={filterValue || ''}
                    onChange={(e) => handleFilterValueChange(e.target.value)}
                    className="filter-input"
                    />
                </div>
                <div className="filter-group">
                    <span className="filter-label">Filter by count:</span>
                    <br />
                    <input
                    type="number"
                    placeholder="Count"
                    value={filterCount || ''}
                    onChange={(e) => handleFilterCountChange(e.target.value)}
                    className="filter-input"
                    />
                </div>
                </div>
        
          <div className="table-container">
            <table className="doctors-table">
                <thead className='table-header'>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Expertise</th>
                </tr>
                </thead>
                <tbody>
                {filteredDoctors.map((doctor) => (
                    <tr
                    key={doctor.id}
                    onClick={() => handleDoctorSelect(doctor)}
                    className={
                        selectedDoctor && selectedDoctor.id === doctor.id
                        ? 'selected-row'
                        : ''
                    }
                    >
                    <td>{doctor.id}</td>
                    <td>{doctor.name}</td>
                    <td>{doctor.expertise}</td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
          <button className="add-doctor-btn" onClick={handleAddDoctor}>
            Add Doctor
          </button>
        </div>
        <div className="doctor-details">
            {
            showAddDoctorForm ? (
              <AddDoctorForm onCancel={() => setShowAddDoctorForm(false)} onSave={handleSaveNewDoctor} />
            ) : selectedDoctor ? (
                <>
                <h2>Doctor Details</h2>
                <div className="doctor-info">
                    <div className="doctor-info-row">
                    <label>ID:</label>
                    <input
                        type="text"
                        value={selectedDoctor.id}
                        disabled
                        className="doctor-input"
                    />
                    </div>
                    <div className="doctor-info-row">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={selectedDoctor.name}
                        onChange={(e) =>
                        setSelectedDoctor({ ...selectedDoctor, name: e.target.value })
                        }
                        className="doctor-input"
                    />
                    </div>
                    <div className="doctor-info-row">
                    <label htmlFor="expertise">Expertise:</label>
                    <input
                        type="text"
                        id="expertise"
                        value={selectedDoctor.expertise}
                        onChange={(e) =>
                        setSelectedDoctor({ ...selectedDoctor, expertise: e.target.value })
                        }
                        className="doctor-input"
                    />
                    </div>
                    <div className="doctor-info-row">
                    <label htmlFor="address">Address:</label>
                    <input
                        type="text"
                        id="address"  
                        value={selectedDoctor.address}
                        onChange={(e) =>
                        setSelectedDoctor({ ...selectedDoctor, address: e.target.value })
                        }
                        className="doctor-input"
                    />
                    </div>
                    <div className="doctor-info-row">
                    <label htmlFor="contact">Contact:</label>
                    <input
                        type="text"
                        id="contact"
                        value={selectedDoctor.contact}
                        onChange={(e) =>
                        setSelectedDoctor({ ...selectedDoctor, contact: e.target.value })
                        }
                        className="doctor-input"
                    />
                    </div>
                    <div className="doctor-info-row">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={selectedDoctor.email}
                        onChange={(e) =>
                        setSelectedDoctor({ ...selectedDoctor, email: e.target.value })
                        }
                        className="doctor-input"
                    />
                    </div>
                    <div className="doctor-info-row">
                    <label htmlFor="website">Website:</label>
                    <input
                        type="text"
                        id="website"
                        value={selectedDoctor.website}
                        onChange={(e) =>
                        setSelectedDoctor({ ...selectedDoctor, website: e.target.value })
                        }
                        className="doctor-input"
                    />
                    </div>
                </div>
                <div className="doctor-actions">
                    <button onClick={handleDeleteDoctor} className="delete-btn">
                    <img src={deleteIcon} alt="Delete" className="delete-icon" />
                    Delete
                    </button>
                    <button onClick={handleEditDoctor} className="edit-btn">
                    Save
                    </button>
                    <button onClick={handleCloseDoctor} className="close-btn">
                    Close
                    </button>
                </div>
                </>
            ) : (
                <div className="doctor-logo">
                <img src={doctorsIcon} alt="Doctor Logo" />
                </div>
            )}
            </div>
      </div>
    </div>
  );
};

export default DoctorsPage;