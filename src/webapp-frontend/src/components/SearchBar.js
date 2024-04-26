import React, { useState } from "react";
import "../styles/Patients.css";

const SearchBar = ({ onSearchChange, onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterByName, setFilterByName] = useState(true); // true for name, false for ID

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearchChange(e.target.value);
  };

  const handleFilterChange = (isByName) => {
    setFilterByName(isByName);
    onFilterChange(isByName);
  };

  return (
    <div className="patients-search-bar">
      <h3>Filter by</h3>
      <div className="filter-buttons">
        <button
          onClick={() => handleFilterChange(true)}
          className={`filter-button ${filterByName ? "active" : ""}`}
        >
          Name
        </button>
        <button
          onClick={() => handleFilterChange(false)}
          className={`filter-button ${!filterByName ? "active" : ""}`}
        >
          ID
        </button>
      </div>

      <input
        className="patients-search-input"
        type="text"
        placeholder="Search patients..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default SearchBar;
