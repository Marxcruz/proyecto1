import React, { useContext, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import DoctorLogin from "./components/DoctorLogin";
import DoctorDashboard from "./components/DoctorDashboard";
import DoctorPatients from "./components/DoctorPatients";
import DoctorHistorial from "./components/DoctorHistorial";
import DoctorEntry from "./components/DoctorEntry";
import DoctorAppointments from "./components/doctor/DoctorAppointments";
import DoctorHistoriales from "./components/doctor/DoctorHistoriales";
import DoctorAsistente from "./components/doctor/DoctorAsistente";
import DoctorPerfil from "./components/doctor/DoctorPerfil";
import AddNewDoctor from "./components/AddNewDoctor";
import AddNewAdmin from "./components/AddNewAdmin";
import Messages from "./components/Messages";
import Patients from "./components/Patients";
import Doctors from "./components/Doctors";
import PatientDashboard from "./components/PatientDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context } from "./main";
import axios from "axios";

const App = () => {
  const { 
    isAuthenticated, 
    setIsAuthenticated, 
    setAdmin,
    isDoctorAuthenticated,
    setIsDoctorAuthenticated,
    setDoctor,
    isPatientAuthenticated,
    setIsPatientAuthenticated,
    setPatient
  } = useContext(Context);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3030/api/v1/user/single-admin",
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setAdmin(response?.data?.user);
      } catch (error) {
        setIsAuthenticated(false);
        setAdmin({});
      }
    };
    
    const fetchDoctor = async () => {
      try {
        console.log('Verificando autenticación de doctor...');
        const response = await axios.get(
          "http://localhost:3030/api/v1/user/single-doctor",
          { withCredentials: true }
        );
        console.log('Respuesta de autenticación de doctor:', response.data);
        if (response.data.success) {
          setIsDoctorAuthenticated(true);
          setDoctor(response.data.user);
          console.log('Doctor autenticado exitosamente');
        }
      } catch (error) {
        console.log('Error al verificar autenticación de doctor:', error);
        setIsDoctorAuthenticated(false);
        setDoctor({});
      }
    };

    const fetchPatient = async () => {
      try {
        console.log('Verificando autenticación de paciente...');
        const response = await axios.get(
          "http://localhost:3030/api/v1/user/single-patient",
          { withCredentials: true }
        );
        console.log('Respuesta de autenticación de paciente:', response.data);
        if (response.data.success) {
          setIsPatientAuthenticated(true);
          setPatient(response.data.user);
          console.log('Paciente autenticado exitosamente');
        }
      } catch (error) {
        console.log('Error al verificar autenticación de paciente:', error);
        setIsPatientAuthenticated(false);
        setPatient({});
      }
    };
    
    fetchAdmin();
    fetchDoctor();
    fetchPatient();
  }, [setIsAuthenticated, setAdmin, setIsDoctorAuthenticated, setDoctor, setIsPatientAuthenticated, setPatient]);

  return (
    <div>
      {/* Renderizar Sidebar solo si estamos en la sección de admin */}
      {window.location.pathname.includes('/doctor') || window.location.pathname.includes('/patient-dashboard') ? null : <Sidebar />}
      
      <Routes>
        {/* Rutas de administrador */}
        <Route
          path="/"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />
        <Route path="/add-new/doctor" element={<AddNewDoctor />} />
        <Route path="/add-new/admin" element={<AddNewAdmin />} />
        <Route path="/todos-mensajes" element={<Messages />} />
        <Route path="/todos-pacientes" element={<Patients />} />
        <Route path="/todos-medicos" element={<Doctors />} />
        
        {/* Rutas de doctor */}
        <Route
          path="/doctor-entry"
          element={<DoctorEntry />}
        />
        <Route
          path="/doctor-login"
          element={!isDoctorAuthenticated ? <DoctorLogin /> : <Navigate to="/doctor-dashboard" />}
        />
        <Route
          path="/doctor-dashboard"
          element={isDoctorAuthenticated ? <DoctorDashboard /> : <Navigate to="/doctor-login" />}
        />
        <Route
          path="/doctor-dashboard/pacientes"
          element={isDoctorAuthenticated ? <DoctorPatients /> : <Navigate to="/doctor-login" />}
        />
        <Route
          path="/doctor-dashboard/paciente/:id"
          element={isDoctorAuthenticated ? <DoctorHistorial /> : <Navigate to="/doctor-login" />}
        />
        <Route
          path="/doctor-dashboard/citas"
          element={isDoctorAuthenticated ? <DoctorAppointments /> : <Navigate to="/doctor-login" />}
        />
        <Route
          path="/doctor-dashboard/historiales"
          element={isDoctorAuthenticated ? <DoctorHistoriales /> : <Navigate to="/doctor-login" />}
        />
        <Route
          path="/doctor-dashboard/asistente"
          element={isDoctorAuthenticated ? <DoctorAsistente /> : <Navigate to="/doctor-login" />}
        />
        <Route
          path="/doctor-dashboard/perfil"
          element={isDoctorAuthenticated ? <DoctorPerfil /> : <Navigate to="/doctor-login" />}
        />
        
        {/* Rutas de paciente */}
        <Route
          path="/patient-dashboard"
          element={<PatientDashboard />}
        />
        <Route
          path="/patient-dashboard/appointments"
          element={<PatientDashboard />}
        />
        <Route
          path="/patient-dashboard/medical-history"
          element={<PatientDashboard />}
        />
        <Route
          path="/patient-dashboard/prescriptions"
          element={<PatientDashboard />}
        />
        <Route
          path="/patient-dashboard/lab-results"
          element={<PatientDashboard />}
        />
        <Route
          path="/patient-dashboard/messages"
          element={<PatientDashboard />}
        />
        <Route
          path="/patient-dashboard/profile"
          element={<PatientDashboard />}
        />
      </Routes>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default App;
