jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  // Add other axios methods as needed
}));
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DoctorsPage from '../pages/Doctors';
import { getAllDoctors, addDoctor, deleteDoctor, updateDoctor } from '../utils/doctorsAPI';

jest.mock('../utils/doctorsAPI');

describe('DoctorsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering Tests
  it('should render the component without crashing', () => {
    render(<DoctorsPage />);
    expect(screen.getByText('Add Doctor')).toBeInTheDocument();
  });

  it('should render the NavBar component', () => {
    render(<DoctorsPage />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render the doctors list table', () => {
    render(<DoctorsPage />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render the doctor details section', async () => {
    const mockDoctors = [
      { id: 1, name: 'John Doe', expertise: 'Cardiology' },
    ];
    getAllDoctors.mockResolvedValue(mockDoctors);
    render(<DoctorsPage />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('John Doe'));
      expect(screen.getByText('Doctor Details')).toBeInTheDocument();
    });
  });

  it('should render the add doctor form', () => {
    render(<DoctorsPage />);
    fireEvent.click(screen.getByText('Add Doctor'));
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  // Functionality Tests
  it('should fetch the list of doctors', async () => {
    const mockDoctors = [
      { id: 1, name: 'John Doe', expertise: 'Cardiology' },
      { id: 2, name: 'Jane Smith', expertise: 'Pediatrics' },
    ];
    getAllDoctors.mockResolvedValue(mockDoctors);
    render(<DoctorsPage />);
    await waitFor(() => {
      expect(screen.getAllByRole('row')).toHaveLength(3); // Including the header row
    });
  });

  it('should filter the list of doctors', async () => {
    const mockDoctors = [
      { id: 1, name: 'John Doe', expertise: 'Cardiology' },
      { id: 2, name: 'Jane Smith', expertise: 'Pediatrics' },
      { id: 3, name: 'Bob Johnson', expertise: 'Orthopedics' },
    ];
    getAllDoctors.mockResolvedValue(mockDoctors);
    render(<DoctorsPage />);
    await waitFor(() => {
      fireEvent.change(screen.getByPlaceholderText('Enter name'), { target: { value: 'John' } });
      expect(screen.getAllByRole('row')).toHaveLength(3); // Including the header row
    });
  });

  it('should select a doctor', async () => {
    const mockDoctors = [
      { id: 1, name: 'John Doe', expertise: 'Cardiology' },
    ];
    getAllDoctors.mockResolvedValue(mockDoctors);
    render(<DoctorsPage />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('John Doe'));
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    });
  });

  it('should add a new doctor', async () => {
    const newDoctor = { name: 'New Doctor', expertise: 'Neurology', address: '123 Main St', contact: '555-1234', email: 'new@doctor.com', website: 'www.newdoctor.com' };
    addDoctor.mockResolvedValue(newDoctor);
    render(<DoctorsPage />);
    fireEvent.click(screen.getByText('Add Doctor'));
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: newDoctor.name } });
    fireEvent.change(screen.getByLabelText('Expertise'), { target: { value: newDoctor.expertise } });
    fireEvent.change(screen.getByLabelText('Address'), { target: { value: newDoctor.address } });
    fireEvent.change(screen.getByLabelText('Contact'), { target: { value: newDoctor.contact } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: newDoctor.email } });
    fireEvent.change(screen.getByLabelText('Website'), { target: { value: newDoctor.website } });
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(screen.getByText('New Doctor')).toBeInTheDocument();
    });
  });

  it('should edit a doctor\'s details', async () => {
    const mockDoctors = [
      { id: 1, name: 'John Doe', expertise: 'Cardiology' },
    ];
    getAllDoctors.mockResolvedValue(mockDoctors);
    render(<DoctorsPage />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('John Doe'));
      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Updated Doctor' } });
      fireEvent.click(screen.getByText('Save'));
      expect(screen.getByDisplayValue('Updated Doctor')).toBeInTheDocument();
    });
  });

  it('should delete a doctor', async () => {
    const mockDoctors = [
      { id: 1, name: 'John Doe', expertise: 'Cardiology' },
    ];
    getAllDoctors.mockResolvedValue(mockDoctors);
    deleteDoctor.mockResolvedValue({ id: 1, name: 'John Doe', expertise: 'Cardiology' });
    render(<DoctorsPage />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('John Doe'));
      fireEvent.click(screen.getByText('Delete'));
      expect(screen.queryByText('<td>John Doe</td>')).not.toBeInTheDocument();
    });
  });

  it('should close the doctor details section', async () => {
    const mockDoctors = [
      { id: 1, name: 'John Doe', expertise: 'Cardiology' },
    ];
    getAllDoctors.mockResolvedValue(mockDoctors);
    render(<DoctorsPage />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('John Doe'));
      fireEvent.click(screen.getByText('Close'));
      expect(screen.queryByText('Doctor Details')).not.toBeInTheDocument();
    });
  });

  it('should handle errors gracefully', async () => {
    const errorMessage = 'Failed to fetch doctors';
    getAllDoctors.mockRejectedValue(new Error(errorMessage));
    console.error = jest.fn();
    render(<DoctorsPage />);
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Failed to fetch doctors:', new Error(errorMessage));
    });
  });
});