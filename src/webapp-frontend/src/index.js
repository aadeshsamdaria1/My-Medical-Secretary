import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Doctors from './pages/Doctors';
import Patients from './pages/Patients';
import Facilities from './pages/Facilities';
import FileUpload from './pages/FileUpload';
import LoginPage from './pages/LoginPage';
import AdminManagementPage from './pages/AdminManagement'
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/",
    element: <LoginPage/>
  },
  {
    path: "doctors",
    element: <ProtectedRoute element={<Doctors/>}/>
  },
  {
    path: "patients",
    element: <ProtectedRoute element={<Patients/>}/>
  },
  {
    path: "facilities",
    element: <ProtectedRoute element={<Facilities/>}/>
  },
  {
    path: "file_upload",
    element: <ProtectedRoute element={<FileUpload/>}/>
  },
  {
    path: "admin_account_management",
    element: <ProtectedRoute element={<AdminManagementPage/>}/>
  }

]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <RouterProvider router={router} />
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
