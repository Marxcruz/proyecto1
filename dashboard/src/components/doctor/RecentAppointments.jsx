import React from 'react';
import { Link } from 'react-router-dom';

const RecentAppointments = ({ appointments, loading, darkMode }) => {
  return (
    <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-700'} mb-4 flex items-center`}>
        <span className="mr-2">Citas Recientes</span>
      </h2>
      
      {loading ? (
        <div className="text-center py-4">Cargando citas...</div>
      ) : appointments.length === 0 ? (
        <div className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No hay citas para mostrar
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className={`min-w-full ${darkMode ? 'bg-gray-700' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <thead>
              <tr className={darkMode ? 'bg-gray-600' : 'bg-gray-100'}>
                <th className={`py-2 px-4 border-b ${darkMode ? 'border-gray-500 text-gray-200' : 'border-gray-200 text-left'}`}>Paciente</th>
                <th className={`py-2 px-4 border-b ${darkMode ? 'border-gray-500 text-gray-200' : 'border-gray-200 text-left'}`}>Fecha</th>
                <th className={`py-2 px-4 border-b ${darkMode ? 'border-gray-500 text-gray-200' : 'border-gray-200 text-left'}`}>Hora</th>
                <th className={`py-2 px-4 border-b ${darkMode ? 'border-gray-500 text-gray-200' : 'border-gray-200 text-left'}`}>Motivo</th>
                <th className={`py-2 px-4 border-b ${darkMode ? 'border-gray-500 text-gray-200' : 'border-gray-200 text-left'}`}>Estado</th>
                <th className={`py-2 px-4 border-b ${darkMode ? 'border-gray-500 text-gray-200' : 'border-gray-200 text-left'}`}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {appointments.slice(0, 5).map((appointment) => {
                // Formatear fecha y hora
                const fecha = new Date(appointment.fechaCita).toLocaleDateString();
                const hora = appointment.horaCita || 'No especificada';
                
                return (
                  <tr key={appointment._id} className={darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'}>
                    <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      {appointment.nombre} {appointment.apellido}
                    </td>
                    <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>{fecha}</td>
                    <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>{hora}</td>
                    <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>{appointment.motivo || 'No especificado'}</td>
                    <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.estado === "Completada" 
                            ? "bg-green-100 text-green-800" 
                            : appointment.estado === "Pendiente" 
                              ? "bg-yellow-100 text-yellow-800" 
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {appointment.estado}
                      </span>
                    </td>
                    <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <Link 
                        to={`/doctor-dashboard/paciente/${appointment.idPaciente}`}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {appointments.length > 5 && (
            <div className="text-right mt-4">
              <Link 
                to="/doctor-dashboard/citas" 
                className="text-blue-500 hover:underline"
              >
                Ver todas las citas ({appointments.length})
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentAppointments;
