import React from "react";
import "../styles/ResourceViewer.css";

function ResourceViewerPopup({ resources, onClose, selectedPatient }) {
  const handleMakeResourceAvailable = (resourceId) => {
    // TODO add userD to resource
    console.log("Resource made available:", resourceId);
  };

  const handleMakeResourceUnavailable = (resourceId) => {
    // TODO remove UserID from resource
    console.log("Resource made unavailable:", resourceId);
  };

  const handleAddNewResource = () => {
    // TODO create new resource
    console.log("Adding new resource");
  };

  // Sort resources by availability to the selected patient
  resources.sort((a, b) => {
    const aAvailable = a.patientIds.includes(selectedPatient.patientId);
    const bAvailable = b.patientIds.includes(selectedPatient.patientId);
    // Resources available to the patient should come before those unavailable
    if (aAvailable && !bAvailable) return -1;
    if (!aAvailable && bAvailable) return 1;
    return 0;
  });

  return (
    <div className="resource-viewer-popup-overlay">
      <div className="resource-viewer-popup">
        <h2 className="popup-title">Resources</h2>
        <div className="resource-table-container">
          <table className="resource-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Link</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <tr key={resource.id} className={resource.patientIds.includes(selectedPatient.patientId) ? "available" : "not-available"}>
                  <td>{resource.id}</td>
                  <td>{resource.text}</td>
                  <td>{resource.link}</td>
                  <td>
                    {resource.patientIds.includes(selectedPatient.patientId) ? (
                      <button className="green-button" onClick={() => handleMakeResourceUnavailable(resource.id)}>
                        Remove from Patient
                      </button>
                    ) : (
                      <button className="red-button" onClick={() => handleMakeResourceAvailable(resource.id)}>
                        Make Available to Patient
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="add-resource-section">
          <h3>Add New Resource</h3>
          <input type="text" placeholder="Resource Name" />
          <input type="text" placeholder="Resource Link" />
          <button onClick={handleAddNewResource}>Add</button>
        </div>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default ResourceViewerPopup;
