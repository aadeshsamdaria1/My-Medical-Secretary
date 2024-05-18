import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { getAllAdmins, createAdmin, deleteAdminById } from "../utils/adminAccountsAPI";
import '../styles/AdminManagement.css';

function AdminManagementPage() {
  const [admins, setAdmins] = useState([]);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const adminsData = await getAllAdmins();
      setAdmins(adminsData);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const handleCreateAdmin = async () => {
    try {
      if (!email || !username || !password || !confirmPassword) {
        setError("All fields are required");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      await createAdmin({ email, username, password });
      fetchAdmins();
      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setError("");
    } catch (error) {
      console.error("Error creating admin:", error);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this admin?");
      if (!confirmDelete) return; // If user cancels deletion, exit function

      await deleteAdminById(adminId);
      fetchAdmins(); // Refresh admins list after deletion
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  return (
    <div>
    <NavBar />
    <div className="admin-management-container">
      

      <div className="admin-list-container">
        <h3>Current Active Admin Accounts</h3>
        <div className="table-container">
          <table className="admin-table">
            <thead className="table-header">
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {admins.map((admin) => (
                <tr key={admin.mmsId}>
                    <td>{admin.username}</td>
                    <td>{admin.email}</td>
                    <td>
                    {localStorage.getItem("userId") === String(admin.mmsId) ? (
                        <span className="owner">Current Account</span>
                    ) : (
                        <button onClick={() => handleDeleteAdmin(admin.mmsId)}>
                        Delete
                        </button>
                    )}
                    </td>
                </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="admin-form-container">
        <h3>Create New Admin Account</h3>
        <div>
          <label>Email:</label>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </div>
        <div>

          <input
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button onClick={handleCreateAdmin}>Create Admin</button>
      </div>
    </div>
    </div>
  );
}

export default AdminManagementPage;
