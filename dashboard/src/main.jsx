import React, { createContext, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

export const Context = createContext({ isAuthenticated: false, isDoctorAuthenticated: false, isPatientAuthenticated: false });

const Apps = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDoctorAuthenticated, setIsDoctorAuthenticated] = useState(false);
  const [isPatientAuthenticated, setIsPatientAuthenticated] = useState(false);
  const [admin, setAdmin] = useState({});
  const [doctor, setDoctor] = useState({});
  const [patient, setPatient] = useState({});

  return (
    <Context.Provider
      value={{ 
        isAuthenticated, 
        setIsAuthenticated, 
        admin, 
        setAdmin,
        isDoctorAuthenticated,
        setIsDoctorAuthenticated,
        doctor,
        setDoctor,
        isPatientAuthenticated,
        setIsPatientAuthenticated,
        patient,
        setPatient
      }}
    >
      <App />
    </Context.Provider>
  );
};

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Apps />
  </BrowserRouter>
);
