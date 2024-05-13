import React from "react";
import "../styles/ResourceViewer.css"


function ResourceViewerPopup({ resources, onClose }) {
  const handleMakeAvailable = (resourceId) => {
    // Implement functionality to make resource available for a patient
    console.log('Resource made available:', resourceId);
  };

  const handleAddNewResource = () => {
    // Implement functionality to add new resource
    console.log('Adding new resource');
  };

  return (
    <div className="resource-viewer-popup-overlay">
      <div className="resource-viewer-popup">
        <h2>Resources</h2>
        <ul>
          {resources.map(resource => (
            <li key={resource.id}>
              <span>{resource.text}</span>
              <button onClick={() => handleMakeAvailable(resource.id)}>Make Available for Patient</button>
            </li>
          ))}
        </ul>
        <button onClick={handleAddNewResource}>Add New Resource</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default ResourceViewerPopup;
