import React, { useState, useEffect } from "react";
import "../styles/ResourceViewer.css";
import {
  getAllResources,
  addResource,
  deleteResource,
  addPatientToResource,
  removePatientFromResource
} from "../utils/resourcesAPI";

function ResourceViewerPopup({onClose, selectedPatientId }) {
  const [resources, setResources] = useState([])
  const [editingResourceId, setEditingResourceId] = useState({
    text:'',
    link:'',
    patientIds: []
  });
  const [newResource, setNewResource] = useState({
    text:'',
    link:'',
    assignToCurrentPatient: false
  });

  useEffect(() => {
    fetchAllResources();
  }, []);

  const fetchAllResources = async () => {
    try {
      const fetchedResources = await getAllResources();
      setResources(fetchedResources);
    } catch (error) {
      console.error('Failed to fetch resources:', error)
    }
  };



  const handleCheckResource = async (resourceId, checked) => {

    console.log("resource check: ", resourceId);
    if (checked) {
      await addPatientToResource(resourceId, selectedPatientId);
    } else {
      await removePatientFromResource(resourceId, selectedPatientId);
    }
    fetchAllResources();
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
    console.log(updatedResources);
    // will need to refetch resources here
  };

  const handleNewResourceInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    setNewResource(prevState => ({
      ...prevState,
      [name]: newValue
    }));
  };


  const handleDeleteResource = async (resourceId) => {
    if (resourceId) {
      try {
        await deleteResource(resourceId);
        fetchAllResources();
      } catch (error) {
        console.error("falied to delete resource")
      }
    }
  };


  const handleAddNewResource = async () => {
    console.log("Adding new resource");
    try {
      const resource = {
        text:newResource.text,
        link:newResource.link,
        patientIds: newResource.assignToCurrentPatient ? [selectedPatientId] : []
      }
      console.log(selectedPatientId)
      await addResource(resource);
      setNewResource({
        text:'',
        link:'',
        assignToCurrentPatient:false
      })
      await fetchAllResources();
    } catch (error) {
      console.error("failed to save new resource:", error);
    }
  };

  return (
    <div className="resource-viewer-popup-overlay">
      <div className="resource-viewer-popup">
        <h2 className="popup-title">Resources</h2>
        <div className="resource-table-container">
          <table className="resource-table">
            <thead>
              <tr>
                <th>Text</th>
                <th>Link</th>
                <th>Available to patient</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <tr key={resource.resource.id}>
                  <td>
                    {editingResourceId === resource.resource.id ? (
                      <input
                        type="text"
                        value={resource.resource.text}
                        onChange={(e) => handleInputChange(resource.resource.id , "text", e.target.value)}
                      />
                    ) : (
                      resource.resource.text
                    )}
                  </td>
                  <td>
                    {editingResourceId === resource.resource.id ? (
                      <input
                        type="text"
                        value={resource.resource.link}
                        onChange={(e) => handleInputChange(resource.resource.id , "link", e.target.value)}
                      />
                    ) : (
                      resource.resource.link
                    )}
                  </td>
                  <td>
                    <input
                      className="checkbox"
                      type="checkbox"
                      checked={resource.patientIds.includes(selectedPatientId)}
                      onChange={(e) => handleCheckResource(resource.resource.id, e.target.checked)}
                    />
                  </td>
                  <td className="action-buttons">
                    {editingResourceId === resource.resource.id ? (
                      <button className="save-button" onClick={() => handleSaveResource(resource.resource.id)}>
                        Save
                      </button>
                    ) : (
                      <button className="edit-button" onClick={() => handleEditResource(resource.resource.id)}>
                        Edit
                      </button>
                    )}
                    <button className="delete-button" onClick={() => handleDeleteResource(resource.resource.id)}>
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
          <input 
            type="text" 
            className="textbox"
            name="text"
            placeholder="Resource Text" 
            value={newResource.text}
            onChange={handleNewResourceInputChange}/>
          <input
            type="text"
            className="textbox"
            name="link"
            placeholder="Resource Link"
            value={newResource.link}
            onChange={handleNewResourceInputChange}/>
          <label>
            Assign new resource to current patient  
            <input
              className="assign-to-patient-checkbox"
              type="checkbox"
              name="assignToCurrentPatient"
              checked={newResource.assignToCurrentPatient}
              onChange={handleNewResourceInputChange}/></label>
          <button onClick={handleAddNewResource}>Add resource</button>
        </div>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default ResourceViewerPopup;
