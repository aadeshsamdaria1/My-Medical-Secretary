import React from "react";
import "../styles/Patients.css";

const SearchBar = ({ onSearchChange }) => {
  return (
    <div className="patients-search-bar">
      <input
        className="patients-search-input"
        type="text"
        placeholder="Search patients..."
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
