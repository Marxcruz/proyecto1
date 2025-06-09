import React from 'react';
import { FaCalendarAlt, FaPills, FaStethoscope, FaFlask, FaChartLine } from 'react-icons/fa';

const PatientStats = ({ stats, darkMode }) => {
  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="p-5">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FaChartLine className="mr-2 text-green-500" />
          Mi Estado de Salud
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Próxima Cita */}
          <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
            <div className="flex items-center">
              <div className={`rounded-full p-3 ${darkMode ? 'bg-green-600' : 'bg-green-100'}`}>
                <FaCalendarAlt className={`h-6 w-6 ${darkMode ? 'text-white' : 'text-green-600'}`} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Próxima Cita</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {stats.proximaCita ? (
                    <>
                      {formatDate(stats.proximaCita.fechaCita)}
                      <div className="text-sm mt-1">
                        {stats.proximaCita.motivo}
                        <span className="block">Dr. {stats.proximaCita.doctorNombre}</span>
                      </div>
                    </>
                  ) : (
                    "No hay citas programadas"
                  )}
                </p>
              </div>
            </div>
          </div>
          
          {/* Medicamentos Activos */}
          <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
            <div className="flex items-center">
              <div className={`rounded-full p-3 ${darkMode ? 'bg-green-600' : 'bg-green-100'}`}>
                <FaPills className={`h-6 w-6 ${darkMode ? 'text-white' : 'text-green-600'}`} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Medicamentos Activos</h3>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-green-600'}`}>
                  {stats.medicamentosActivos}
                </p>
              </div>
            </div>
          </div>
          
          {/* Última Consulta */}
          <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
            <div className="flex items-center">
              <div className={`rounded-full p-3 ${darkMode ? 'bg-green-600' : 'bg-green-100'}`}>
                <FaStethoscope className={`h-6 w-6 ${darkMode ? 'text-white' : 'text-green-600'}`} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Última Consulta</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {stats.ultimaConsulta ? (
                    <>
                      {formatDate(stats.ultimaConsulta.fechaCita)}
                      <div className="text-sm mt-1">
                        {stats.ultimaConsulta.motivo}
                        <span className="block">Dr. {stats.ultimaConsulta.doctorNombre}</span>
                      </div>
                    </>
                  ) : (
                    "Sin consultas previas"
                  )}
                </p>
              </div>
            </div>
          </div>
          
          {/* Resultados Pendientes */}
          <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
            <div className="flex items-center">
              <div className={`rounded-full p-3 ${darkMode ? 'bg-green-600' : 'bg-green-100'}`}>
                <FaFlask className={`h-6 w-6 ${darkMode ? 'text-white' : 'text-green-600'}`} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Resultados Pendientes</h3>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-green-600'}`}>
                  {stats.resultadosPendientes}
                </p>
              </div>
            </div>
          </div>
          
          {/* Próximos Seguimientos */}
          <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
            <div className="flex items-center">
              <div className={`rounded-full p-3 ${darkMode ? 'bg-green-600' : 'bg-green-100'}`}>
                <FaChartLine className={`h-6 w-6 ${darkMode ? 'text-white' : 'text-green-600'}`} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Próximos Seguimientos</h3>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-green-600'}`}>
                  {stats.proximosSeguimientos}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientStats;
