jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
  }));
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import AdminManagementPage from '../pages/AdminManagement';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../utils/adminAccountsAPI', () => ({
  getAllAdmins: jest.fn(),
  createAdmin: jest.fn(),
  deleteAdminById: jest.fn(),
}));

describe('AdminManagementPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component', () => {
    render(<MemoryRouter> <AdminManagementPage /> </MemoryRouter>);
    expect(screen.getByText('Current Active Admin Accounts')).toBeInTheDocument();
    expect(screen.getByText('Create New Admin Account')).toBeInTheDocument();
  });

  test('fetches admins on component mount', async () => {
    const admins = [
      { mmsId: 1, username: 'admin1', email: 'admin1@example.com' },
      { mmsId: 2, username: 'admin2', email: 'admin2@example.com' },
    ];
    jest.spyOn(require('../utils/adminAccountsAPI'), 'getAllAdmins').mockResolvedValue(admins);
    render(<MemoryRouter> <AdminManagementPage /> </MemoryRouter>);
    await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(3));

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3);
    expect(rows[1]).toHaveTextContent('admin1');
    expect(rows[2]).toHaveTextContent('admin2');
  });

  test('creates a new admin', async () => {
    jest.spyOn(require('../utils/adminAccountsAPI'), 'createAdmin').mockResolvedValue();
    render(<MemoryRouter> <AdminManagementPage /> </MemoryRouter>);

    const emailInput = screen.getByPlaceholderText('Email');
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    const createButton = screen.getByText('Create Admin');
    fireEvent.click(createButton);

    await waitFor(() => expect(require('../utils/adminAccountsAPI').createAdmin).toHaveBeenCalledWith({
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
    }));
  });

  test('deletes an admin', async () => {
    const admins = [
      { mmsId: 1, username: 'admin1', email: 'admin1@example.com' },
      { mmsId: 2, username: 'admin2', email: 'admin2@example.com' },
    ];
    jest.spyOn(require('../utils/adminAccountsAPI'), 'getAllAdmins').mockResolvedValue(admins);
    jest.spyOn(require('../utils/adminAccountsAPI'), 'deleteAdminById').mockResolvedValue();
    window.confirm = jest.fn(() => true); // Mock the confirm dialog

    render(<MemoryRouter> <AdminManagementPage /> </MemoryRouter>);
    await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(3));

    const deleteButton = screen.getAllByRole('button', { name: 'Delete' })[0];
    fireEvent.click(deleteButton);

    await waitFor(() => expect(require('../utils/adminAccountsAPI').deleteAdminById).toHaveBeenCalledWith(1));
  });
});