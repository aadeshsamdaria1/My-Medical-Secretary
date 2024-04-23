import React, { useState, useRef } from 'react';
import NavBar from '../components/NavBar';
import '../styles/FileUpload.css';
import uploadIcon from '../assets/upload-icon.png'
import { uploadAppointmentFile, uploadPatientFile } from '../utils/filesAPI';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [progressMessage, setProgressMessage] = useState('');
  


  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setError('');
        setSuccessMessage('');
    }

  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const selectedFile = event.dataTransfer.files[0];
    if (selectedFile) {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setError('');
        setSuccessMessage('');
    }

  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileTypeChange = (type) => {
    setFileType(type);
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      setSuccessMessage('');
      return;
    }

    if (!fileType) {
      setError('Please select a file type.');
      setSuccessMessage('');
      return;
    }
    try {
      setProgressMessage("Upload in progress");
      console.log('Submitting file:', file);
      if (fileType === 'patient') {
        await uploadPatientFile(file);
        setSuccessMessage(`Patient file '${fileName}' uploaded successfully.`);
      } else if (fileType === 'appointment') {
        await uploadAppointmentFile(file);
        setSuccessMessage(`Appointment file '${fileName}' uploaded successfully.`);
      }
      setFileName('')
      setFile(null)

      
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Error uploading file. Please try again.')
      setSuccessMessage('');
    } finally {
      setProgressMessage('');
    }

  };

  return (
<div>
  <NavBar />
  <div className="upload-header">
    <img src={uploadIcon} alt="Upload Icon" className="upload-icon" />
    <span className="upload-text">Upload Genie Report</span>
  </div>
  <div className="file-upload-container">
    <div
      className="drop-area"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleButtonClick}
    >
      <input
        type="file"
        onChange={handleFileChange}
        style={{ position: 'absolute', left: '-9999px' }} // Hide the input off-screen but keep it accessible
        ref={fileInputRef}
      />
      {fileName ? (
        <p className="file-name">{fileName}</p>
      ) : (
        <p>Drag file here<br/><strong>-- or --</strong><br/>Click to choose file</p>
      )}
    </div>
  </div>
  <div className="file-type-container">
    <div className="file-type-option">
      <label>
        <input
          type="radio"
          name="fileType"
          checked={fileType === 'patient'}
          onChange={() => handleFileTypeChange('patient')}
        />
        Patient File
      </label>
    </div>
    <div className="file-type-option">
      <label>
        <input
          type="radio"
          name="fileType"
          checked={fileType === 'appointment'}
          onChange={() => handleFileTypeChange('appointment')}
        />
        Appointment File
      </label>
    </div>
  </div>
  {error && (
    <div className="error-message">{error}</div>
  )}
  {successMessage && (
    <div className="success-message">{successMessage}</div>
  )}
  {progressMessage && (
    <div className="progress-message">{progressMessage}</div>
  )}
  <div className="submit-button-container">
    <button onClick={handleSubmit}>Submit</button>
  </div>
</div>
  );
};

export default FileUpload;
