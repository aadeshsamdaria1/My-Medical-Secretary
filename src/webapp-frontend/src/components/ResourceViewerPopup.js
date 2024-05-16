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
  const [checkedResources, setCheckedResources] = useState([]);
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


  useEffect(() => {

    // Filter resources associated with the selected patient and set them as checked initially
    const initialCheckedResources = resources
      .filter((resource) => resource.patientIds.includes(selectedPatientId))
      .map((resource) => resource.id);
    setCheckedResources(initialCheckedResources);
  }, [resources]);

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
    // TODO: Implement adding new resource
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
                      type="checkbox"
                      checked={checkedResources.includes(resource.resource.id)}
                      onChange={() => handleCheckResource(resource.resource.id)}
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
            name="text"
            placeholder="Resource Name" 
            style={{width: "300px", height: "40px", "fontSize": "16px"}}
            value={newResource.text}
            onChange={handleNewResourceInputChange}/>
          <input
            type="text"
            name="link"
            placeholder="Resource Link"
            style={{width: "300px", height: "40px", "fontSize": "16px"}}
            value={newResource.link}
            onChange={handleNewResourceInputChange}/>
          <label>
            Assign to this patient  
            <input
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
