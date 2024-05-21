jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
  }));
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Facilities from '../pages/Facilities';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../utils/facilitiesAPI', () => ({
  getAllFacilities: jest.fn(),
  updateFacility: jest.fn(),
  createFacility: jest.fn(),
  deleteFacilityById: jest.fn(),
}));

describe('Facilities', () => {
  test('renders the component', () => {
    render(<MemoryRouter> <Facilities /> </MemoryRouter>);
    expect(screen.getByText('Filter by name:')).toBeInTheDocument();
  });

  test('filters facilities by name', async () => {
    const facilities = [
      { id: 1, name: 'Facility A', facilityType: 'RADIOLOGY', contact: '123' },
      { id: 2, name: 'Facility B', facilityType: 'PATHOLOGY', contact: '456' },
    ];
    jest.spyOn(require('../utils/facilitiesAPI'), 'getAllFacilities').mockResolvedValue(facilities);
    render(<MemoryRouter> <Facilities /> </MemoryRouter>);
    await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(3));

    const nameInput = screen.getByPlaceholderText('Enter name');
    fireEvent.change(nameInput, { target: { value: 'Facility A' } });

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(2);
    expect(rows[1]).toHaveTextContent('Facility A');
  });

  test('filters facilities by facility type', async () => {
    const facilities = [
      { id: 1, name: 'Facility A', facilityType: 'RADIOLOGY', contact: '123' },
      { id: 2, name: 'Facility B', facilityType: 'PATHOLOGY', contact: '456' },
    ];
    jest.spyOn(require('../utils/facilitiesAPI'), 'getAllFacilities').mockResolvedValue(facilities);
    render(<MemoryRouter> <Facilities /> </MemoryRouter>);
    await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(3));

    const typeSelect = screen.getByRole('combobox');
    fireEvent.change(typeSelect, { target: { value: 'RADIOLOGY' } });

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(2);
    expect(rows[1]).toHaveTextContent('Facility A');
  });

  test('filters facilities by count', async () => {
    const facilities = [
      { id: 1, name: 'Facility A', facilityType: 'RADIOLOGY', contact: '123' },
      { id: 2, name: 'Facility B', facilityType: 'PATHOLOGY', contact: '456' },
      { id: 3, name: 'Facility C', facilityType: 'HOSPITAL', contact: '789' },
    ];
    jest.spyOn(require('../utils/facilitiesAPI'), 'getAllFacilities').mockResolvedValue(facilities);
    render(<MemoryRouter> <Facilities /> </MemoryRouter>);
    await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(4));

    const countInput = screen.getByPlaceholderText('Count');
    fireEvent.change(countInput, { target: { value: '2' } });

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3);
  });

  test('fetches facilities on component mount', async () => {
    const facilities = [
      { id: 1, name: 'Facility A', facilityType: 'RADIOLOGY', contact: '123' },
      { id: 2, name: 'Facility B', facilityType: 'PATHOLOGY', contact: '456' },
    ];
    jest.spyOn(require('../utils/facilitiesAPI'), 'getAllFacilities').mockResolvedValue(facilities);
    render(<MemoryRouter> <Facilities /> </MemoryRouter>);
    await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(3));

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3);
    expect(rows[1]).toHaveTextContent('Facility A');
    expect(rows[2]).toHaveTextContent('Facility B');
  });

  test('handles errors when fetching facilities', async () => {
    jest.spyOn(require('../utils/facilitiesAPI'), 'getAllFacilities').mockRejectedValue(new Error('Failed to fetch facilities'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<MemoryRouter> <Facilities /> </MemoryRouter>);
    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch facilities:', new Error('Failed to fetch facilities')));
    consoleSpy.mockRestore();
  });

});