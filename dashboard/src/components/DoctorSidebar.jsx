import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Context } from "../main";
import { toast } from "react-toastify";
import axios from "axios";

const DoctorSidebar = () => {
  const navigate = useNavigate();
  const { isDoctorAuthenticated, setIsDoctorAuthenticated, doctor } = useContext(Context);

  const handleLogout = async () => {
    try {
      // Intentar cerrar sesión en el servidor
      await axios.get(
        "http://localhost:3030/api/v1/user/doctor-logout",
        { withCredentials: true }
      ).then(response => {
        toast.success(response.data.message || "Sesión cerrada exitosamente");
      }).catch(err => {
        console.error("Error en la petición de cierre de sesión:", err);
        // No mostramos error al usuario ya que igualmente cerraremos sesión localmente
      });
      
      // Siempre ejecutar estas acciones, incluso si hay error en la petición
      setIsDoctorAuthenticated(false);
      localStorage.removeItem("doctorInfo"); // Limpiar cualquier información almacenada
      sessionStorage.clear(); // Limpiar sesión
      
      // Redireccionar a la página principal
      window.location.href = "http://localhost:5173/"; // Redirigir a la página principal en el puerto 5173
    } catch (error) {
      console.error("Error general al cerrar sesión:", error);
      toast.error("Se produjo un error, pero la sesión se ha cerrado");
      setIsDoctorAuthenticated(false);
      window.location.href = "http://localhost:5173/"; // Redirigir a la página principal en el puerto 5173
    }
  };

  const sidebarLinks = [
    {
      title: "Panel Principal",
      path: "/doctor-dashboard",
      icon: (
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
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      title: "Mis Pacientes",
      path: "/doctor-dashboard/pacientes",
      icon: (
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      title: "Historial Clínico",
      path: "/doctor-dashboard/historiales",
      icon: (
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      title: "Citas",
      path: "/doctor-dashboard/citas",
      icon: (
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "Asistente IA",
      path: "/doctor-dashboard/asistente",
      icon: (
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
            d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
          />
        </svg>
      ),
    },
    {
      title: "Mi Perfil",
      path: "/doctor-dashboard/perfil",
      icon: (
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-64 h-screen bg-blue-800 text-white shadow fixed">
      <div className="p-6">
        <h2 className="text-xl font-bold">Portal Médico</h2>
        <p className="text-sm text-blue-200 mt-1">
          Dr. {doctor?.nombre} {doctor?.apellido}
        </p>
        <p className="text-xs text-blue-200 mt-1">{doctor?.departamentoMedico}</p>
      </div>

      <nav className="mt-6">
        <ul>
          {sidebarLinks.map((link, index) => (
            <li key={index} className="px-4 py-2">
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-2 rounded-md hover:bg-blue-700 ${isActive ? "bg-blue-700" : ""}`
                }
              >
                {link.icon}
                <span>{link.title}</span>
              </NavLink>
            </li>
          ))}
          <li className="px-4 py-2 mt-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-blue-700 w-full text-left"
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

export default DoctorSidebar;
