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
  const [editingResource, setEditingResource] = useState({
    id:null,
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

    if (checked) {
      await addPatientToResource(resourceId, selectedPatientId);
    } else {
      await removePatientFromResource(resourceId, selectedPatientId);
    }
    fetchAllResources();
  };

  const handleEditResource =  async (resource, patientIds) => {
    const tempresource = { ...resource, patientIds: patientIds};
    setEditingResource(tempresource);
  };


  const handleSaveResource = async (resourceId) => {

    if (resourceId === editingResource.id) {
      await deleteResource(resourceId);
      const resourceWithoutId = { ...editingResource };
      delete resourceWithoutId.id;
      await addResource(resourceWithoutId);
      const fetchedResources = await getAllResources();
      setResources(fetchedResources);
    } 
    setEditingResource(prevState => ({
      ...prevState,
      id: null
    }));
  };

  const handleEditingResourceInputChange = (name, value) => {
    setEditingResource(prevState => ({
      ...prevState,
      [name]: value
    }));
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
  
  const handleCancelEdit = () => {
    setEditingResource(prevState => ({
      ...prevState,
      id: null
    }));
  }


  const handleAddNewResource = async () => {
    console.log("Adding new resource");
    try {
      const resource = {
        text:newResource.text,
        link:newResource.link,
        patientIds: newResource.assignToCurrentPatient ? [selectedPatientId] : []
      }
      if (resource.text === "" && resource.link === "") {
        // user is trying to add an empty resource
        return
      }
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
                    {editingResource.id && editingResource.id === resource.resource.id ? (
                      <input
                        className="edit-input"
                        type="text"
                        value={editingResource.text}
                        onChange={(e) => handleEditingResourceInputChange("text", e.target.value)}
                      />
                    ) : (
                      resource.resource.text
                    )}
                  </td>
                  <td>
                    {editingResource.id && editingResource.id === resource.resource.id ? (
                      <input
                        className="edit-input"
                        type="text"
                        value={editingResource.link}
                        onChange={(e) => handleEditingResourceInputChange("link", e.target.value)}
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
                      disabled={editingResource.id && editingResource.id === resource.resource.id}
                    />
                  </td>
                  <td className="action-buttons">
                    {editingResource.id && editingResource.id === resource.resource.id ? (
                      <>
                        <button className="save-button" onClick={() => handleSaveResource(resource.resource.id)}>
                          Save
                        </button>
                        <button className="cancel-button" onClick={() => handleCancelEdit()}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="edit-button" onClick={() => handleEditResource(resource.resource, resource.patientIds)}>
                          Edit
                        </button>
                        <button className="delete-button" onClick={() => handleDeleteResource(resource.resource.id)}>
                          Delete
                        </button>
                      </>
                    )}
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
