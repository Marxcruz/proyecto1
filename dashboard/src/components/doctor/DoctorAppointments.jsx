import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DoctorSidebar from '../DoctorSidebar';
import { FaCheck, FaTimes, FaCalendarCheck, FaEye, FaCommentMedical } from 'react-icons/fa';
import { io } from 'socket.io-client';

// Conexión al socket
const socket = io('http://localhost:3030', {
  withCredentials: true,
  transports: ['websocket'],
});

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [observaciones, setObservaciones] = useState('');

  // Conectar al socket al montar el componente
  useEffect(() => {
    socket.connect();
    console.log('Conectado al socket');

    // Limpiar conexión al desmontar
    return () => {
      socket.disconnect();
      console.log('Desconectado del socket');
    };
  }, []);

  // Función para cargar las citas desde el servidor
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3030/api/v1/appointments/doctor-appointments",
        { withCredentials: true }
      );

      if (response.data.success) {
        const appointmentsData = response.data.appointments || [];
        console.log('Citas obtenidas:', appointmentsData.length);
        setAppointments(appointmentsData);
      } else {
        console.error("No se obtuvieron citas - respuesta no exitosa");
        toast.error("No se pudieron cargar las citas");
      }
    } catch (error) {
      console.error("Error al obtener citas:", error);
      toast.error("Error al cargar las citas");
    } finally {
      setLoading(false);
    }
  };
  
  // Función para actualizar el estado de una cita (confirmar/rechazar)
  const updateAppointmentStatus = async (id, newStatus) => {
    try {
      setActionLoading(true);
      const response = await axios.put(
        `http://localhost:3030/api/v1/appointments/doctor-update-appointment/${id}`,
        {
          estado: newStatus,
          observaciones: observaciones
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(`Cita ${newStatus === 'Confirmada' ? 'confirmada' : newStatus === 'Cancelada' ? 'cancelada' : 'actualizada'} correctamente`);
        // Actualizar la lista de citas localmente para evitar recargar
        setAppointments(prevAppointments => 
          prevAppointments.map(app => 
            app._id === id ? {...app, estado: newStatus, observacionesDoctor: observaciones} : app
          )
        );
        // Emitir evento de socket para notificar al dashboard del administrador
        socket.emit('appointment_status_updated', {
          appointmentId: id,
          newStatus: newStatus,
          observaciones: observaciones,
          updatedAt: new Date().toISOString()
        });
        console.log('Evento de socket emitido: appointment_status_updated', { appointmentId: id, newStatus });
        setShowModal(false);
        setObservaciones('');
      } else {
        toast.error("No se pudo actualizar el estado de la cita");
      }
    } catch (error) {
      console.error("Error al actualizar cita:", error);
      toast.error("Error al actualizar la cita: " + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(false);
    }
  };
  
  // Función para mostrar modal de confirmación/rechazo
  const showAppointmentModal = (appointment) => {
    setSelectedAppointment(appointment);
    setObservaciones(appointment.observacionesDoctor || '');
    setShowModal(true);
  };

  // Cargar citas al inicio y configurar un intervalo para actualizaciones automáticas
  useEffect(() => {
    // Cargar citas inmediatamente
    fetchAppointments();
    
    // Configurar actualización automática cada 30 segundos
    const intervalId = setInterval(() => {
      fetchAppointments();
    }, 30000);
    
    // Limpiar intervalo al desmontar
    return () => clearInterval(intervalId);
  }, []);

  // Filtrar citas según el estado seleccionado
  const filteredAppointments = filterStatus === 'todos' 
    ? appointments 
    : appointments.filter(app => app.estado === filterStatus);

  return (
    <div className="flex h-screen bg-gray-100">
      <DoctorSidebar />
      <div className="flex-1 overflow-auto p-6 ml-64">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Todas las Citas</h1>
        {/* Filtros */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button 
            onClick={() => setFilterStatus('todos')} 
            className={`px-4 py-2 rounded-lg ${filterStatus === 'todos' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'}`}
          >
            Todas
          </button>
          <button 
            onClick={() => setFilterStatus('Pendiente')} 
            className={`px-4 py-2 rounded-lg ${filterStatus === 'Pendiente' 
              ? 'bg-yellow-500 text-white' 
              : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'}`}
          >
            Pendientes
          </button>
          <button 
            onClick={() => setFilterStatus('Confirmada')} 
            className={`px-4 py-2 rounded-lg ${filterStatus === 'Confirmada' 
              ? 'bg-green-500 text-white' 
              : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'}`}
          >
            Confirmadas
          </button>
          <button 
            onClick={() => setFilterStatus('Cancelada')} 
            className={`px-4 py-2 rounded-lg ${filterStatus === 'Cancelada' 
              ? 'bg-red-500 text-white' 
              : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'}`}
          >
            Canceladas
          </button>
          <button 
            onClick={() => setFilterStatus('Completada')} 
            className={`px-4 py-2 rounded-lg ${filterStatus === 'Completada' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'}`}
          >
            Completadas
          </button>
        </div>

        {/* Lista de citas */}
        <div className="rounded-lg shadow-md bg-white">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando citas...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {filterStatus === 'todos' 
                ? "No hay citas para mostrar" 
                : `No hay citas con estado "${filterStatus}"`}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 text-left text-gray-600">Paciente</th>
                    <th className="py-3 px-4 text-left text-gray-600">Fecha</th>
                    <th className="py-3 px-4 text-left text-gray-600">Hora</th>
                    <th className="py-3 px-4 text-left text-gray-600">Especialidad</th>
                    <th className="py-3 px-4 text-left text-gray-600">Motivo</th>
                    <th className="py-3 px-4 text-left text-gray-600">Estado</th>
                    <th className="py-3 px-4 text-left text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appointment) => {
                    // Formatear fecha y hora
                    const fecha = new Date(appointment.fechaCita).toLocaleDateString();
                    const hora = appointment.horaCita || 'No especificada';
                    
                    return (
                      <tr 
                        key={appointment._id} 
                        className="border-t border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          {appointment.nombre} {appointment.apellido}
                        </td>
                        <td className="py-3 px-4">{fecha}</td>
                        <td className="py-3 px-4">{hora}</td>
                        <td className="py-3 px-4">{appointment.departamento || 'No especificado'}</td>
                        <td className="py-3 px-4">{appointment.motivo || 'No especificado'}</td>
                        <td className="py-3 px-4">
                          <span 
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              appointment.estado === "Completada" 
                                ? "bg-green-100 text-green-800" 
                                : appointment.estado === "Pendiente" 
                                  ? "bg-yellow-100 text-yellow-800" 
                                  : appointment.estado === "Confirmada" 
                                    ? "bg-blue-100 text-blue-800" 
                                    : "bg-red-100 text-red-800"
                            }`}
                          >
                            {appointment.estado}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            {appointment.estado === "Pendiente" && (
                              <>
                                <button
                                  onClick={() => showAppointmentModal(appointment)}
                                  className="p-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                                  title="Confirmar cita"
                                >
                                  <FaCheck className="mr-1" /> Confirmar
                                </button>
                                <button
                                  onClick={() => showAppointmentModal(appointment)}
                                  className="p-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                                  title="Rechazar cita"
                                >
                                  <FaTimes className="mr-1" /> Rechazar
                                </button>
                              </>
                            )}
                            <Link 
                              to={`/doctor-dashboard/paciente/${appointment.idPaciente}`}
                              className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                              title="Ver historial del paciente"
                            >
                              <FaEye className="mr-1" /> Historial
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal para confirmar/rechazar citas */}
      {showModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Gestionar Cita</h3>
            
            <div className="mb-4">
              <p><span className="font-semibold">Paciente:</span> {selectedAppointment.nombre} {selectedAppointment.apellido}</p>
              <p><span className="font-semibold">Fecha:</span> {new Date(selectedAppointment.fechaCita).toLocaleDateString()}</p>
              <p><span className="font-semibold">Hora:</span> {new Date(selectedAppointment.fechaCita).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              <p><span className="font-semibold">Motivo:</span> {selectedAppointment.motivo}</p>
              <p><span className="font-semibold">Estado actual:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${selectedAppointment.estado === "Completada" ? "bg-green-100 text-green-800" : selectedAppointment.estado === "Pendiente" ? "bg-yellow-100 text-yellow-800" : selectedAppointment.estado === "Confirmada" ? "bg-blue-100 text-blue-800" : selectedAppointment.estado === "Cancelada" ? "bg-red-100 text-red-800" : ""}`}>  
                  {selectedAppointment.estado}
                </span>
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observaciones médicas
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Ingrese observaciones médicas (opcional)"
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              
              {selectedAppointment.estado === "Pendiente" && (
                <>
                  <button
                    onClick={() => updateAppointmentStatus(selectedAppointment._id, "Confirmada")}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <FaCheck className="mr-2" />
                        Confirmar
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => updateAppointmentStatus(selectedAppointment._id, "Cancelada")}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <FaTimes className="mr-2" />
                        Rechazar
                      </>
                    )}
                  </button>
                </>
              )}
              
              {selectedAppointment.estado === "Confirmada" && (
                <button
                  onClick={() => updateAppointmentStatus(selectedAppointment._id, "Completada")}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <FaCalendarCheck className="mr-2" />
                      Marcar Completada
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default DoctorAppointments;
