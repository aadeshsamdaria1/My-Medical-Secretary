import React from "react";
import { useState } from "react";
import "../styles/ResourceViewer.css";

function ResourceViewerPopup({ resources, onClose, selectedPatient }) {
  const [editedResources, setEditedResources] = useState({});

  const handleMakeResourceAvailable = (resourceId) => {
    // TODO add userD to resource
    console.log("Resource made available:", resourceId);
  };

  const handleMakeResourceUnavailable = (resourceId) => {
    // TODO remove UserID from resource
    console.log("Resource made unavailable:", resourceId);
  };

  const handleEditResource = (resourceId) => {
    // TODO save edited resource
    console.log("Resource edited:", editedResources[resourceId]);
  };

  const handleDeleteResource = (resourceId) => {
    // TODO delete resource
    console.log("Resource deleted:", resourceId);
  };

  const handleInputChange = (resourceId, field, value) => {
    setEditedResources({
      ...editedResources,
      [resourceId]: {
        ...editedResources[resourceId],
        [field]: value
      }
    });
  };

  const handleAddNewResource = () => {
    // TODO create new resource
    console.log("Adding new resource");
  };

  resources.sort((a, b) => {
    const aAvailable = a.patientIds.includes(selectedPatient.patientId);
    const bAvailable = b.patientIds.includes(selectedPatient.patientId);
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <tr key={resource.id} className={resource.patientIds.includes(selectedPatient.patientId) ? "available" : "not-available"}>
                  <td>{resource.id}</td>
                  <td>
                    {editedResources[resource.id] ? (
                      <input
                        type="text"
                        value={editedResources[resource.id].text}
                        onChange={(e) => handleInputChange(resource.id, "text", e.target.value)}
                      />
                    ) : (
                      resource.text
                    )}
                  </td>
                  <td>
                    {editedResources[resource.id] ? (
                      <input
                        type="text"
                        value={editedResources[resource.id].link}
                        onChange={(e) => handleInputChange(resource.id, "link", e.target.value)}
                      />
                    ) : (
                      resource.link
                    )}
                  </td>
                  <td className="action-buttons">
                    {resource.patientIds.includes(selectedPatient.patientId) ? (
                      <button className="make-unavailable-button" onClick={() => handleMakeResourceUnavailable(resource.id)}>
                        Remove from Patient
                      </button>
                    ) : (
                      <button className="make-available-button" onClick={() => handleMakeResourceAvailable(resource.id)}>
                        Make Available to Patient
                      </button>
                    )}
                    <button className="edit-button" onClick={() => handleEditResource(resource.id)}>
                      Edit
                    </button>
                    <button className="delete-button" onClick={() => handleDeleteResource(resource.id)}>
                      Delete
                    </button>
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
