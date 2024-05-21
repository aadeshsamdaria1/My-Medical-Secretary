jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
  }));
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Patients from '../pages/Patients';
import * as patientsAPI from '../utils/patientsAPI';

jest.mock('../utils/patientsAPI');

describe('Patients', () => {
  const mockPatients = [
    { patientId: 1, firstname: 'John', surname: 'Doe' },
    { patientId: 2, firstname: 'Jane', surname: 'Smith' },
  ];

  const mockAppointments = [
    { id: 1, date: '2023-05-20', patient: { patientId: 1 } },
    { id: 2, date: '2023-05-22', patient: { patientId: 1 } },
  ];

  beforeEach(() => {
    patientsAPI.getAllPatients.mockResolvedValue(mockPatients);
    patientsAPI.getAppointmentByPatientId.mockResolvedValue(mockAppointments);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = (ui) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  test('renders the component', async () => {
    renderWithRouter(<Patients />);
    const patientsHeadings = screen.getAllByText('Patients');
    expect(patientsHeadings).toHaveLength(2); // Assuming there are two elements with the text "Patients"
  });

  test('renders the PatientList component', async () => {
    renderWithRouter(<Patients />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });
});