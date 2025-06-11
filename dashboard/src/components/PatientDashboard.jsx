import React, { useState, useEffect, useContext, useCallback } from "react";
import AIChatWindow from "./AIChatWindow"; // Importar el nuevo componente de chat
import axios from "axios";
import { Context } from "../main";
import { toast } from "react-toastify";
import PatientSidebar from "./PatientSidebar";
import { FaUserAlt, FaCalendarCheck, FaChartLine, FaFileMedical, FaFlask, FaPills, FaCommentMedical } from "react-icons/fa";
import { MdDashboard, MdNightlight, MdWbSunny, MdHealthAndSafety } from "react-icons/md";

// Importar los componentes del paciente
import PatientStats from "./patient/PatientStats";
import PatientAppointments from "./patient/PatientAppointments";
import MedicalHistory from "./patient/MedicalHistory";
import PatientPrescriptions from "./patient/PatientPrescriptions";
import LabResults from "./patient/LabResults";
import PatientMessages from "./patient/PatientMessages";
import PatientProfile from "./patient/PatientProfile";

const PatientDashboard = () => {
  // Estado para la interfaz y navegación
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // Estado para la ventana de chat
  
  // Estado para los datos
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { patient } = useContext(Context);
  
  // Estadísticas del paciente
  const [stats, setStats] = useState({
    proximaCita: null,
    medicamentosActivos: 0,
    ultimaConsulta: null,
    resultadosPendientes: 0,
    proximosSeguimientos: 0
  });

  // Cargar datos al iniciar
  // Detectar la ruta actual para activar la pestaña correspondiente
  useEffect(() => {
    // Obtener la ruta actual
    const path = window.location.pathname;
    
    // Mapear la ruta a la pestaña correspondiente
    if (path.includes('/patient-dashboard/appointments')) {
      setActiveTab('appointments');
    } else if (path.includes('/patient-dashboard/medical-history')) {
      setActiveTab('medical-history');
    } else if (path.includes('/patient-dashboard/prescriptions')) {
      setActiveTab('prescriptions');
    } else if (path.includes('/patient-dashboard/lab-results')) {
      setActiveTab('lab-results');
    } else if (path.includes('/patient-dashboard/messages')) {
      setActiveTab('messages');
    } else if (path.includes('/patient-dashboard/profile')) {
      setActiveTab('profile');
    } else {
      // Por defecto, mostrar el dashboard en cualquier otra ruta
      setActiveTab('dashboard');
    }
  }, []);

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      
      // Obtener citas del paciente
      const appointmentsResponse = await axios.get(
        "http://localhost:3030/api/v1/appointments/my-appointments",
        { withCredentials: true }
      );

      if (appointmentsResponse.data.success) {
        const patientAppointments = appointmentsResponse.data.appointments || [];
        setAppointments(patientAppointments);
        
        // Ordenar citas por fecha
        const sortedAppointments = [...patientAppointments].sort((a, b) => 
          new Date(a.fechaCita) - new Date(b.fechaCita)
        );
        
        // Encontrar la próxima cita
        const today = new Date();
        const upcomingAppointment = sortedAppointments.find(
          app => new Date(app.fechaCita) >= today
        );
        
        // Encontrar la última consulta
        const pastAppointments = sortedAppointments.filter(
          app => new Date(app.fechaCita) < today && app.estado === "Completada"
        );
        const lastConsultation = pastAppointments.length > 0 
          ? pastAppointments[pastAppointments.length - 1] 
          : null;
        
        // Obtener prescripciones
        const prescriptionsResponse = await axios.get(
          "http://localhost:3030/api/v1/prescription/patient-prescriptions",
          { withCredentials: true }
        );
        
        if (prescriptionsResponse.data.success) {
          const patientPrescriptions = prescriptionsResponse.data.prescriptions || [];
          setPrescriptions(patientPrescriptions);
          
          // Contar medicamentos activos
          const activeCount = patientPrescriptions.filter(
            p => new Date(p.fechaFin) >= today
          ).length;
          
          // Actualizar estadísticas
          setStats({
            proximaCita: upcomingAppointment,
            medicamentosActivos: activeCount,
            ultimaConsulta: lastConsultation,
            resultadosPendientes: 0, // Placeholder - implementar cuando haya API de resultados
            proximosSeguimientos: sortedAppointments.filter(
              app => new Date(app.fechaCita) >= today && app.tipo === "Seguimiento"
            ).length
          });
        }
      }
    } catch (error) {
      console.error("Error al obtener datos del paciente:", error);
      toast.error("Error al cargar la información del paciente");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchPatientData = async () => {
      await loadAppointments();
      // Puedes cargar aquí otras cosas (stats etc.)
    };
    fetchPatientData();
  }, []);

  // Función para cambiar entre modo claro y oscuro
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Renderizado de la pestaña principal del dashboard
  const renderDashboardContent = () => (
    <>
      <PatientStats stats={stats} darkMode={darkMode} />
      <div className="mt-6">
        <PatientAppointments 
          appointments={appointments.filter(app => new Date(app.fechaCita) >= new Date())} 
          loading={loading} 
          darkMode={darkMode} 
          isUpcoming={true} 
        />
      </div>
    </>
  );

  // Mapeo de pestañas a componentes
  const getTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardContent();
      case 'appointments':
        return <PatientAppointments appointments={appointments} loading={loading} darkMode={darkMode} />;
      case 'medical-history':
        return <MedicalHistory darkMode={darkMode} />;
      case 'prescriptions':
        return <PatientPrescriptions prescriptions={prescriptions} darkMode={darkMode} />;
      case 'lab-results':
        return <LabResults darkMode={darkMode} />;
      case 'messages':
        return <PatientMessages darkMode={darkMode} />;
      case 'profile':
        return <PatientProfile darkMode={darkMode} />;
      default:
        return <div>Selecciona una pestaña</div>;
    }
  };

  return (
    <div className={`flex h-screen w-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <PatientSidebar setActiveTab={setActiveTab} />
      
      {/* Agregamos ml-64 para respetar el ancho del sidebar fijo */}
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        {/* Header y controles */}
        <div className={`px-6 py-4 flex justify-between items-center border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} sticky top-0 z-10`}>
          <div className="flex items-center">
            <FaUserAlt className="text-green-500 text-2xl mr-3" />
            <h1 className="text-2xl font-bold">
              Portal del Paciente - {patient?.nombre} {patient?.apellido}
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
                  ? 'bg-gray-700 text-white border-b-2 border-green-500' 
                  : 'bg-white text-green-600 border-b-2 border-green-500' 
                : darkMode 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-100'}`}
            >
              <MdDashboard className="mr-2" /> Mi Resumen
            </button>
            
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-4 py-2 rounded-t-lg flex items-center ${activeTab === 'appointments' 
                ? darkMode 
                  ? 'bg-gray-700 text-white border-b-2 border-green-500' 
                  : 'bg-white text-green-600 border-b-2 border-green-500' 
                : darkMode 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-100'}`}
            >
              <FaCalendarCheck className="mr-2" /> Mis Citas
            </button>
            
            <button
              onClick={() => setActiveTab('medical-history')}
              className={`px-4 py-2 rounded-t-lg flex items-center ${activeTab === 'medical-history' 
                ? darkMode 
                  ? 'bg-gray-700 text-white border-b-2 border-green-500' 
                  : 'bg-white text-green-600 border-b-2 border-green-500' 
                : darkMode 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-100'}`}
            >
              <FaFileMedical className="mr-2" /> Mi Historial
            </button>
            
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`px-4 py-2 rounded-t-lg flex items-center ${activeTab === 'prescriptions' 
                ? darkMode 
                  ? 'bg-gray-700 text-white border-b-2 border-green-500' 
                  : 'bg-white text-green-600 border-b-2 border-green-500' 
                : darkMode 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-100'}`}
            >
              <FaPills className="mr-2" /> Medicamentos
            </button>
            
            <button
              onClick={() => setActiveTab('lab-results')}
              className={`px-4 py-2 rounded-t-lg flex items-center ${activeTab === 'lab-results' 
                ? darkMode 
                  ? 'bg-gray-700 text-white border-b-2 border-green-500' 
                  : 'bg-white text-green-600 border-b-2 border-green-500' 
                : darkMode 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-100'}`}
            >
              <FaFlask className="mr-2" /> Resultados Lab
            </button>
            
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-2 rounded-t-lg flex items-center ${activeTab === 'messages' 
                ? darkMode 
                  ? 'bg-gray-700 text-white border-b-2 border-green-500' 
                  : 'bg-white text-green-600 border-b-2 border-green-500' 
                : darkMode 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-100'}`}
            >
              <FaCommentMedical className="mr-2" /> Mensajes
            </button>
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className="p-6 overflow-auto flex-1 w-full">
          <div className="w-full max-w-full">
            {getTabContent()}
          </div>
        </div>
      </div>
      
      {/* Botón flotante para el chat con IA */}
      <button
        onClick={() => setIsChatOpen(prev => !prev)} // Alternar la visibilidad de la ventana de chat
        className={`fixed bottom-6 right-6 text-white p-4 rounded-full shadow-xl z-50 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-150 ease-in-out flex items-center justify-center ${darkMode ? 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'}`}
        aria-label="Abrir chat con IA"
        title="Chatear con Asistente IA"
      >
        <FaCommentMedical size={24} />
      </button>

      {/* Ventana de Chat con IA */}
      {isChatOpen && (
        <AIChatWindow 
          onClose={() => setIsChatOpen(false)} 
          darkMode={darkMode} 
          onAppointmentCreated={loadAppointments}
        />
      )}
    </div>
  );
};

export default PatientDashboard;
