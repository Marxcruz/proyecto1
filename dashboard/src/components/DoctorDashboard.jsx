import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Context } from "../main";
import { toast } from "react-toastify";
import DoctorSidebar from "./DoctorSidebar";
import { FaUserMd, FaCalendarCheck, FaChartLine, FaBell, FaUserInjured, FaClock, FaClipboardList, FaCalendarAlt, FaSearch, FaPills, FaCalculator, FaNotesMedical, FaFileMedical, FaCommentMedical } from "react-icons/fa";
import { MdDashboard, MdNightlight, MdWbSunny, MdLocalHospital, MdOutlineHealthAndSafety } from "react-icons/md";

// Importar los nuevos componentes
import DashboardStats from "./doctor/DashboardStats";
import RecentAppointments from "./doctor/RecentAppointments";
import ClinicalTools from "./doctor/ClinicalTools";
import ClinicalHistory from "./doctor/ClinicalHistory";
import Prescriptions from "./doctor/Prescriptions";
import DoctorMessages from "./doctor/DoctorMessages";

const DoctorDashboard = () => {
  // Estado para la interfaz y navegación
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  
  // Estado para los datos
  const [appointments, setAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { doctor } = useContext(Context);
  
  // Estadísticas mejoradas
  const [stats, setStats] = useState({
    totalPacientes: 0,
    citasHoy: 0,
    citasPendientes: 0,
    pacientesNuevos: 0,
    completadas: 0
  });

  // Cargar datos al iniciar
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [appointmentsResponse, doctorPatientsResponse] = await Promise.all([
          axios.get(
            "http://localhost:3030/api/v1/appointments/doctor-appointments",
            { withCredentials: true }
          ),
          axios.get(
            "http://localhost:3030/api/v1/appointments/doctor-patients",
            { withCredentials: true }
          )
        ]);

        let calculatedTotalDoctorPatients = 0;
        if (doctorPatientsResponse.data.success && doctorPatientsResponse.data.patients) {
          calculatedTotalDoctorPatients = doctorPatientsResponse.data.patients.length;
        }

        if (appointmentsResponse.data.success) {
          const currentAppointments = appointmentsResponse.data.appointments || [];
          setAppointments(currentAppointments);
          
          const todayStr = new Date().toISOString().split('T')[0];
          const lastMonthDate = new Date();
          lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
          lastMonthDate.setHours(0, 0, 0, 0); // Para incluir todo el día del mes anterior
          
          let todayAppointmentsCount = 0;
          let pendingAppointmentsCount = 0;
          let completedAppointmentsCount = 0;
          const newPatientsIdSet = new Set();
          
          currentAppointments.forEach(appointment => {
            const appointmentDateObj = new Date(appointment.fechaCita);
            
            if (appointmentDateObj.toISOString().split('T')[0] === todayStr) {
              todayAppointmentsCount++;
            }
            
            if (appointment.estado === "Pendiente") {
              pendingAppointmentsCount++;
            } else if (appointment.estado === "Completada") {
              completedAppointmentsCount++;
            }
            
            if (appointmentDateObj >= lastMonthDate) {
              const patientId = typeof appointment.pacienteId === 'object' && appointment.pacienteId !== null 
                                ? appointment.pacienteId._id 
                                : appointment.pacienteId;
              if (patientId) {
                newPatientsIdSet.add(patientId);
              }
            }
          });
          
          setStats({
            totalPacientes: calculatedTotalDoctorPatients,
            citasHoy: todayAppointmentsCount,
            citasPendientes: pendingAppointmentsCount,
            pacientesNuevos: newPatientsIdSet.size,
            completadas: completedAppointmentsCount
          });
        } else {
          // Si la petición de citas falla, actualizamos solo el total de pacientes si la otra tuvo éxito
          setStats(prevStats => ({
            ...prevStats,
            totalPacientes: calculatedTotalDoctorPatients,
            citasHoy: 0,
            citasPendientes: 0,
            pacientesNuevos: 0,
            completadas: 0
          }));
          toast.error("Error al cargar las citas");
        }
      } catch (error) {
        console.error("Error al obtener datos del dashboard:", error);
        toast.error("Error al cargar los datos del panel");
        setStats({
            totalPacientes: 0,
            citasHoy: 0,
            citasPendientes: 0,
            pacientesNuevos: 0,
            completadas: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Función para cambiar entre modo claro y oscuro
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Contenido para cada pestaña
  const renderDashboardContent = () => (
    <>
      <DashboardStats stats={stats} darkMode={darkMode} />
      <div className="mt-6">
        <RecentAppointments appointments={appointments} loading={loading} darkMode={darkMode} />
      </div>
    </>
  );

  // Mapeo simplificado de pestañas a componentes
  const getTabContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return renderDashboardContent();
      case 'historial':
        return <ClinicalHistory darkMode={darkMode} />;
      case 'prescripciones':
        return <Prescriptions darkMode={darkMode} />;
      case 'herramientas':
        return <ClinicalTools darkMode={darkMode} />;
      case 'mensajes':
        return <DoctorMessages darkMode={darkMode} />;
      default:
        return <div>Selecciona una pestaña</div>;
    }
  };

  return (
    <div className={`flex h-screen w-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <DoctorSidebar />
      
      {/* Agregamos ml-64 para respetar el ancho del sidebar fijo */}
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        {/* Header y controles */}
        <div className={`px-6 py-4 flex justify-between items-center border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} sticky top-0 z-10`}>
          <div className="flex items-center">
            <FaUserMd className="text-blue-500 text-2xl mr-3" />
            <h1 className="text-2xl font-bold">
              Panel Médico - {doctor?.nombre} {doctor?.apellido}
            </h1>
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
            >
              {darkMode ? <MdWbSunny /> : <MdNightlight />}
            </button>
          </div>
        </div>
        
        {/* Navegación de pestañas */}
        <div className={`px-6 py-2 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-t-lg flex items-center ${activeTab === 'dashboard' 
                ? darkMode 
                  ? 'bg-gray-700 text-white border-b-2 border-blue-500' 
                  : 'bg-white text-blue-600 border-b-2 border-blue-500' 
                : darkMode 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-100'}`}
            >
              <MdDashboard className="mr-2" /> Panel Principal
            </button>
            <button
              onClick={() => setActiveTab('historial')}
              className={`px-4 py-2 rounded-t-lg flex items-center ${activeTab === 'historial' 
                ? darkMode 
                  ? 'bg-gray-700 text-white border-b-2 border-blue-500' 
                  : 'bg-white text-blue-600 border-b-2 border-blue-500' 
                : darkMode 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-100'}`}
            >
              <FaFileMedical className="mr-2" /> Historial Clínico
            </button>
            <button
              onClick={() => setActiveTab('prescripciones')}
              className={`px-4 py-2 rounded-t-lg flex items-center ${activeTab === 'prescripciones' 
                ? darkMode 
                  ? 'bg-gray-700 text-white border-b-2 border-blue-500' 
                  : 'bg-white text-blue-600 border-b-2 border-blue-500' 
                : darkMode 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-100'}`}
            >
              <FaPills className="mr-2" /> Prescripciones
            </button>
            <button
              onClick={() => setActiveTab('herramientas')}
              className={`px-4 py-2 rounded-t-lg flex items-center ${activeTab === 'herramientas' 
                ? darkMode 
                  ? 'bg-gray-700 text-white border-b-2 border-blue-500' 
                  : 'bg-white text-blue-600 border-b-2 border-blue-500' 
                : darkMode 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-100'}`}
            >
              <FaCalculator className="mr-2" /> Herramientas Clínicas
            </button>
            <button
              onClick={() => setActiveTab('mensajes')}
              className={`px-4 py-2 rounded-t-lg flex items-center ${activeTab === 'mensajes' 
                ? darkMode 
                  ? 'bg-gray-700 text-white border-b-2 border-blue-500' 
                  : 'bg-white text-blue-600 border-b-2 border-blue-500' 
                : darkMode 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-100'}`}
            >
              <FaCommentMedical className="mr-2" /> Mensajes
            </button>
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className="flex-1 overflow-y-auto p-6">
          {getTabContent()}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
