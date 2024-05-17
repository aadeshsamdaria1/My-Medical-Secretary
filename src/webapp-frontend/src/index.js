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
  }

]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
