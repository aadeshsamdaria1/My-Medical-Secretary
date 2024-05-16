import React, { useState, useEffect } from "react";
import "../styles/ResourceViewer.css";
import { getAllResources } from "../utils/resourcesAPI";

function ResourceViewerPopup({ resources, onClose, selectedPatient }) {
  const [checkedResources, setCheckedResources] = useState([]);
  const [editingResourceId, setEditingResourceId] = useState(null);

  useEffect(() => {
    // Filter resources associated with the selected patient and set them as checked initially
    const initialCheckedResources = resources
      .filter((resource) => resource.patientIds.includes(selectedPatient.patientId))
      .map((resource) => resource.id);
    setCheckedResources(initialCheckedResources);
  }, [resources, selectedPatient.patientId]);

  const handleCheckResource = (resourceId) => {
    if (checkedResources.includes(resourceId)) {
      setCheckedResources(checkedResources.filter((id) => id !== resourceId));
      RemoveResourceFromPatient(resourceId);
    } else {
      setCheckedResources([...checkedResources, resourceId]);
      AddResourceToPatient(resourceId);
    }
  };

  const AddResourceToPatient = (resourceId) => {
    // TODO: Implement adding resource to patient
    console.log("Add resource to patient:", resourceId);
  };

  const RemoveResourceFromPatient = (resourceId) => {
    // TODO: Implement removing resource from patient
    console.log("Remove resource from patient:", resourceId);
  };

  const handleEditResource = (resourceId) => {
    setEditingResourceId(resourceId);
  };

  const handleSaveResource = (resourceId) => {
    // TODO: Implement saving resource changes
    console.log("Save resource changes:", resourceId);
    setEditingResourceId(null); // Reset editing state
  };

  const handleInputChange = (resourceId, field, value) => {
    // Find the edited resource in the resources array and update its corresponding field
    const updatedResources = resources.map((resource) => {
      if (resource.id === resourceId) {
        return {
          ...resource,
          [field]: value,
        };
      }
      return resource;
    });
    // will need to refetch resources here
  };

  const handleDeleteResource = (resourceId) => {
    // TODO: Implement deleting resource
    console.log("Delete resource:", resourceId);
  };

  const handleAddNewResource = async () => {
    // TODO: Implement adding new resource
    console.log("Adding new resource");
    const fetchedResources = await getAllResources();
    console.log(fetchedResources)
  };

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
                <th>Available to patient</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <tr key={resource.id}>
                  <td>{resource.id}</td>
                  <td>
                    {editingResourceId === resource.id ? (
                      <input
                        type="text"
                        value={resource.text}
                        onChange={(e) => handleInputChange(resource.id, "text", e.target.value)}
                      />
                    ) : (
                      resource.text
                    )}
                  </td>
                  <td>
                    {editingResourceId === resource.id ? (
                      <input
                        type="text"
                        value={resource.link}
                        onChange={(e) => handleInputChange(resource.id, "link", e.target.value)}
                      />
                    ) : (
                      resource.link
                    )}
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={checkedResources.includes(resource.id)}
                      onChange={() => handleCheckResource(resource.id)}
                    />
                  </td>
                  <td className="action-buttons">
                    {editingResourceId === resource.id ? (
                      <button className="save-button" onClick={() => handleSaveResource(resource.id)}>
                        Save
                      </button>
                    ) : (
                      <button className="edit-button" onClick={() => handleEditResource(resource.id)}>
                        Edit
                      </button>
                    )}
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
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default ResourceViewerPopup;
