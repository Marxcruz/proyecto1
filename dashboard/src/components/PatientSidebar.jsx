import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Context } from "../main";
import { toast } from "react-toastify";
import axios from "axios";
import { FaUserAlt, FaCalendarAlt, FaFileMedical, FaPills, FaChartLine, FaCommentMedical, FaFlask } from "react-icons/fa";

const PatientSidebar = ({ setActiveTab }) => {
  const navigate = useNavigate();
  const { isPatientAuthenticated, setIsPatientAuthenticated, patient } = useContext(Context);

  const handleLogout = async () => {
    try {
      // Intentar cerrar sesión en el servidor
      await axios.get(
        "http://localhost:3030/api/v1/user/patient-logout",
        { withCredentials: true }
      ).then(response => {
        toast.success(response.data.message || "Sesión cerrada exitosamente");
      }).catch(err => {
        console.error("Error en la petición de cierre de sesión:", err);
        // No mostramos error al usuario ya que igualmente cerraremos sesión localmente
      });
      
      // Siempre ejecutar estas acciones, incluso si hay error en la petición
      setIsPatientAuthenticated(false);
      localStorage.removeItem("patientInfo"); // Limpiar cualquier información almacenada
      sessionStorage.clear(); // Limpiar sesión
      
      // Redireccionar a la página principal
      window.location.href = "http://localhost:5173/"; // Redirigir a la página principal en el puerto 5173
    } catch (error) {
      console.error("Error general al cerrar sesión:", error);
      toast.error("Se produjo un error, pero la sesión se ha cerrado");
      setIsPatientAuthenticated(false);
      window.location.href = "http://localhost:5173/"; // Redirigir a la página principal en el puerto 5173
    }
  };

  const sidebarLinks = [
    {
      title: "Mi Resumen",
      path: "/patient-dashboard",
      tab: "dashboard",
      icon: <FaChartLine className="h-5 w-5" />,
    },
    {
      title: "Mis Citas",
      path: "/patient-dashboard/appointments",
      tab: "appointments",
      icon: <FaCalendarAlt className="h-5 w-5" />,
    },
    {
      title: "Mi Historial Clínico",
      path: "/patient-dashboard/medical-history",
      tab: "medical-history",
      icon: <FaFileMedical className="h-5 w-5" />,
    },
    {
      title: "Mis Medicamentos",
      path: "/patient-dashboard/prescriptions",
      tab: "prescriptions",
      icon: <FaPills className="h-5 w-5" />,
    },
    {
      title: "Resultados de Laboratorio",
      path: "/patient-dashboard/lab-results",
      tab: "lab-results",
      icon: <FaFlask className="h-5 w-5" />,
    },
    {
      title: "Mensajes",
      path: "/patient-dashboard/messages",
      tab: "messages",
      icon: <FaCommentMedical className="h-5 w-5" />,
    },
    {
      title: "Mi Perfil",
      path: "/patient-dashboard", // Misma ruta que el dashboard principal
      tab: "profile",
      icon: <FaUserAlt className="h-5 w-5" />,
    },
  ];

  return (
    <div className="w-64 h-screen bg-green-700 text-white shadow fixed">
      <div className="p-6">
        <h2 className="text-xl font-bold">Portal del Paciente</h2>
        <p className="text-sm text-green-200 mt-1">
          {patient?.nombre} {patient?.apellido}
        </p>
        <p className="text-xs text-green-200 mt-1">#{patient?.numeroHistoria || "N/A"}</p>
      </div>

      <nav className="mt-6">
        <ul>
          {sidebarLinks.map((link, index) => (
            <li key={index}>
              {link.tab === 'profile' ? (
                <button
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center px-6 py-3 w-full text-white hover:bg-green-600 transition-colors"
                >
                  {link.icon}
                  <span className="ml-3">{link.title}</span>
                </button>
              ) : (
                <NavLink
                  to={link.path}
                  onClick={() => setActiveTab(link.tab)}
                  className={({ isActive }) =>
                    `flex items-center px-6 py-3 w-full ${isActive ? "bg-green-800" : ""} text-white hover:bg-green-600 transition-colors`
                  }
                >
                  {link.icon}
                  <span className="ml-3">{link.title}</span>
                </NavLink>
              )}
            </li>
          ))}
          <li className="px-4 py-2 mt-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-green-600 w-full text-left"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Cerrar Sesión</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default PatientSidebar;
