import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import AddFacilityForm from '../components/AddFacilityForm';
import deleteIcon from '../assets/delete-icon.png';
import '../styles/Facilities.css';
import doctorsLogo from '../assets/doctors-logo.jpg';

import {
  updateFacility,
  createFacility,
  getAllFacilities,
  deleteFacilityById
} from '../utils/facilitiesAPI';



const Facilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [filterCount, setFilterCount] = useState(null);
  const [filterValue, setFilterValue] = useState('');
  const [facilityTypeFilter, setFacilityTypeFilter] = useState('');
  const [showAddFacilityForm, setShowAddFacilityForm] = useState(false);

  useEffect(() => {
    fetchFacilities(); // Initial fetch on component mount
  }, []); // Empty dependency array, so it only runs once on component mount

  const fetchFacilities = async () => {
    try {
      const fetchedFacilities = await getAllFacilities();
      setFacilities(fetchedFacilities);
    } catch (error) {
      console.error('Failed to fetch facilities:', error);
    }
  };


  const handleFilterCountChange = (count) => {
    setFilterCount(count);
  };

  const handleFilterValueChange = (value) => {
    setFilterValue(value);
  };

  const handleFacilityTypeFilterChange = (value) => {
    setFacilityTypeFilter(value);
  };

  const handleFacilitySelect = (facility) => {
    setSelectedFacility(facility);
  };

  const handleAddFacility = () => {
    setShowAddFacilityForm(true);
    setSelectedFacility(null);
  };

  const handleDeleteFacility = async () => {
    if (selectedFacility) {
      try {
        await deleteFacilityById(selectedFacility.id);
        fetchFacilities();
        setSelectedFacility(null);
      } catch (error) {
      console.error("failed to delete facility:", error)
    }
  }
  };

  const handleEditFacility = async () => {
    if (selectedFacility) {
      const updatedFacility = {
        ...selectedFacility,
        name: selectedFacility.name,
        contact: selectedFacility.contact,
        address: selectedFacility.address,
        fax: selectedFacility.fax,
        website: selectedFacility.website,
        facilityType: selectedFacility.facilityType,
      };
      try {
        await updateFacility(selectedFacility.id, updatedFacility);
        setSelectedFacility(null);
        fetchFacilities();

      } catch (error) {
        console.error("failed to updatee facility:", error)
      }

    }
  };

  const handleCloseFacility = () => {
    setSelectedFacility(null);
  };

  const handleSaveNewFacility = async (newFacility) => {
    try {
      await createFacility(newFacility);
      setShowAddFacilityForm(false);
      fetchFacilities(); // Refetch facilities after creating
    } catch (error) {
      console.error('Failed to save new facility:', error);
    }
  };

  const filteredFacilities = filterCount
    ? facilities
        .filter((facility) => {
          return (
            facility.name.toLowerCase().includes(filterValue.toLowerCase()) &&
            (facilityTypeFilter === '' || facility.facilityType === facilityTypeFilter)
          );
        })
        .sort((a, b) => a.name.localeCompare(b.name))
        .slice(0, filterCount)
    : facilities
        .filter((facility) => {
          return (
            facility.name.toLowerCase().includes(filterValue.toLowerCase()) &&
            (facilityTypeFilter === '' || facility.facilityType === facilityTypeFilter)
          );
        })
        .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <NavBar />
      <div className="facilities-page">
        <div className="facilities-list">
          <div className="filter-options">
            <div className="filter-group">
              <span className="filter-label">Filter by name:</span>
              <input
                type="text"
                placeholder="Enter name"
                value={filterValue || ''}
                onChange={(e) => handleFilterValueChange(e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <span className="filter-label">Filter by facility type:</span>
              <select
                value={facilityTypeFilter}
                onChange={(e) => handleFacilityTypeFilterChange(e.target.value)}
                className="filter-input"
              >
                <option value="">All</option>
                <option value="RADIOLOGY">Radiology</option>
                <option value="PATHOLOGY">Pathology</option>
                <option value="HOSPITAL">Hospital</option>
              </select>
            </div>
            <div className="filter-group">
              <span className="filter-label">Filter by count:</span>
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
            <table className="facilities-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {filteredFacilities.map((facility) => (
                  <tr
                    key={facility.name}
                    onClick={() => handleFacilitySelect(facility)}
                    className={
                      selectedFacility && selectedFacility.name === facility.name
                        ? 'selected'
                        : ''
                    }
                  >
                    <td>{facility.name}</td>
                    <td>{facility.facilityType}</td>
                    <td>{facility.contact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="add-facility-btn" onClick={handleAddFacility}>
            Add Facility
          </button>
        </div>
        <div className="facility-details">
          {showAddFacilityForm ? (
            <AddFacilityForm
              onCancel={() => setShowAddFacilityForm(false)}
              onSave={handleSaveNewFacility}
            />
          ) : selectedFacility ? (
            <>
              <h2>Facility Details</h2>
              <div className="facility-info">
                <div className="facility-info-row">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={selectedFacility.name}
                    onChange={(e) =>
                      setSelectedFacility({ ...selectedFacility, name: e.target.value })
                    }
                    className="facility-input"
                  />
                </div>
                <div className="facility-info-row">
                  <label>Contact:</label>
                  <input
                    type="text"
                    value={selectedFacility.contact}
                    onChange={(e) =>
                      setSelectedFacility({ ...selectedFacility, contact: e.target.value })
                    }
                    className="facility-input"
                  />
                </div>
                <div className="facility-info-row">
                  <label>Address:</label>
                  <input
                    type="text"
                    value={selectedFacility.address}
                    onChange={(e) =>
                      setSelectedFacility({ ...selectedFacility, address: e.target.value })
                    }
                    className="facility-input"
                  />
                </div>
                <div className="facility-info-row">
                  <label>Fax:</label>
                  <input
                    type="text"
                    value={selectedFacility.fax || ''}
                    onChange={(e) =>
                      setSelectedFacility({ ...selectedFacility, fax: e.target.value })
                    }
                    className="facility-input"
                  />
                </div>
                <div className="facility-info-row">
                  <label>Website:</label>
                  <input
                    type="text"
                    value={selectedFacility.website}
                    onChange={(e) =>
                      setSelectedFacility({ ...selectedFacility, website: e.target.value })
                    }
                    className="facility-input"
                  />
                </div>
                <div className="facility-info-row">
                  <label>Type:</label>
                  <input
                    type="text"
                    value={selectedFacility.facilityType}
                    onChange={(e) =>
                      setSelectedFacility({ ...selectedFacility, facilityType: e.target.value })
                    }
                    className="facility-input"
                  />
                </div>
              </div>
              <div className="facility-actions">
                <button onClick={handleDeleteFacility} className="delete-btn">
                  <img src={deleteIcon} alt="Delete" className="delete-icon" />
                  Delete
                </button>
                <button onClick={handleEditFacility} className="edit-btn">
                  Save
                </button>
                <button onClick={handleCloseFacility} className="close-btn">
                  Close
                </button>
              </div>
            </>
          ) : (
            <div className="facility-logo">
              {/* Display a random logo or placeholder */}
              <img src={doctorsLogo} alt="Facility Logo" />
            </div>
          )}
        </div>
        </div>
    </div>
  );
};

export default Facilities;
