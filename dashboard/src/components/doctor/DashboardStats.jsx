import React from 'react';
import { FaUserInjured, FaCalendarCheck, FaCalendarAlt, FaUserPlus, FaCheckCircle } from 'react-icons/fa';

const DashboardStats = ({ stats, darkMode }) => {
  const statItems = [
    { 
      title: "Total Pacientes", 
      value: stats.totalPacientes, 
      icon: <FaUserInjured />, 
      color: "blue" 
    },
    { 
      title: "Citas Hoy", 
      value: stats.citasHoy, 
      icon: <FaCalendarCheck />, 
      color: "green" 
    },
    { 
      title: "Citas Pendientes", 
      value: stats.citasPendientes, 
      icon: <FaCalendarAlt />, 
      color: "yellow" 
    },
    { 
      title: "Pacientes Nuevos", 
      value: stats.pacientesNuevos, 
      icon: <FaUserPlus />, 
      color: "purple" 
    },
    { 
      title: "Citas Completadas", 
      value: stats.completadas, 
      icon: <FaCheckCircle />, 
      color: "teal" 
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {statItems.map((item, index) => (
        <div 
          key={index} 
          className={`p-4 rounded-lg shadow-md flex items-center ${
            darkMode 
              ? 'bg-gray-800 text-white' 
              : 'bg-white text-gray-800'
          }`}
        >
          <div className={`p-3 rounded-full mr-4 text-white bg-${item.color}-500`}>
            {item.icon}
          </div>
          <div>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.title}</p>
            <p className={`text-2xl font-bold ${
              item.color === 'blue' ? 'text-blue-600' : 
              item.color === 'green' ? 'text-green-600' : 
              item.color === 'yellow' ? 'text-yellow-600' : 
              item.color === 'purple' ? 'text-purple-600' : 
              'text-teal-600'
            }`}>
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
