jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
  }));
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FileUpload from '../pages/FileUpload';
import { MemoryRouter } from 'react-router-dom';

describe('FileUpload', () => {
  test('renders the component', () => {
    render(<MemoryRouter> <FileUpload /> </MemoryRouter>);
    expect(screen.getByText('Upload Genie Report')).toBeInTheDocument();
  });

  test('renders the drop area', () => {
    render(<MemoryRouter> <FileUpload /> </MemoryRouter>);
    const dropArea = screen.getByText(/Drag file here/i);
    expect(dropArea).toBeInTheDocument();
  });

  test('renders the file type options', () => {
    render(<MemoryRouter> <FileUpload /> </MemoryRouter>);
    const patientFileOption = screen.getByLabelText('Patient File');
    const appointmentFileOption = screen.getByLabelText('Appointment File');
    expect(patientFileOption).toBeInTheDocument();
    expect(appointmentFileOption).toBeInTheDocument();
  });

  test('renders the submit button', () => {
    render(<MemoryRouter> <FileUpload /> </MemoryRouter>);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeInTheDocument();
  });


  test('displays error message when no file is selected', () => {
    render(<MemoryRouter> <FileUpload /> </MemoryRouter>);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);
    expect(screen.getByText('Please select a file to upload')).toBeInTheDocument();
  });
});