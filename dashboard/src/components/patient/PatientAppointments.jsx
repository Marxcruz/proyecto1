import React, { useState, useContext } from 'react';
import { FaCalendarAlt, FaClock, FaUserMd, FaHospital, FaInfoCircle, FaCalendarPlus, FaCheckCircle, FaTimesCircle, FaCommentMedical, FaCalendarCheck } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Context } from '../../main';

const PatientAppointments = ({ appointments, loading, darkMode, isUpcoming, onReloadAppointments }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newAppointment, setNewAppointment] = useState({
    especialidad: '',
    fecha: '',
    hora: '',
    motivo: ''
  });
  const [showNewAppointmentForm, setShowNewAppointmentForm] = useState(false);

  // Filtrar citas según si queremos mostrar las próximas o todas
  const filteredAppointments = isUpcoming 
    ? appointments.filter(app => new Date(app.fechaCita) >= new Date()).slice(0, 5)
    : appointments;

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Formatear hora para mostrar
  const formatTime = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para mostrar detalles de una cita
  const showAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };
  
  // Función para recargar las citas (útil después de crear una nueva)
  const reloadAppointments = () => {
    // Esta función simula una recarga llamando a la función que le proporciona las citas
    // Esta implementación asume que las citas se pasan como props desde el componente padre
    // Si tuvieras que cargarlas aquí directamente, implementarías una llamada API
    setShowNewAppointmentForm(false);
    // Notificar al componente padre que debe recargar las citas
    if (typeof onReloadAppointments === 'function') {
      onReloadAppointments();
    }
  };

  // Función para solicitar una nueva cita - ahora con conexión real a la API
  const { patient } = useContext(Context);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestAppointment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Creamos un objeto con los datos para la API
      const appointmentData = {
        nombre: patient?.nombre || 'Paciente',
        apellido: patient?.apellido || '',
        correo: patient?.correo || '',
        telefono: patient?.telefono || '',
        identificacion: patient?.identificacion || '',
        fechaNacimiento: patient?.fechaNacimiento || '',
        genero: patient?.genero || '',
        fechaCita: newAppointment.fecha,
        horaCita: newAppointment.hora, // Enviamos la hora como campo separado
        departamento: newAppointment.especialidad,
        motivo: newAppointment.motivo,
        direccion: patient?.direccion || '',
        estado: 'Pendiente',
        // Agrega el ID del paciente si está disponible
        idPaciente: patient?._id || ''
      };

      // Enviar la solicitud al servidor
      const response = await axios.post(
        'http://localhost:3030/api/v1/appointments/create-appointment',
        appointmentData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Tu solicitud de cita ha sido enviada y está pendiente de aprobación');
        setShowNewAppointmentForm(false);
        setNewAppointment({
          especialidad: '',
          fecha: '',
          hora: '',
          motivo: ''
        });
        // Recargar la lista de citas
        if (typeof onReloadAppointments === 'function') {
          onReloadAppointments();
        }
      } else {
        toast.error('No se pudo crear la cita. Por favor intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error al solicitar cita:', error);
      toast.error('Error al solicitar la cita: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Estado de la cita con color correspondiente
  const getStatusColor = (status) => {
    switch (status) {
      case "Pendiente":
        return darkMode ? "text-yellow-300" : "text-yellow-600";
      case "Confirmada":
        return darkMode ? "text-green-300" : "text-green-600";
      case "Cancelada":
        return darkMode ? "text-red-300" : "text-red-600";
      case "Completada":
        return darkMode ? "text-blue-300" : "text-blue-600";
      default:
        return darkMode ? "text-gray-300" : "text-gray-600";
    }
  };
  
  // Obtener icono correspondiente al estado
  const getStatusIcon = (status) => {
    switch (status) {
      case "Pendiente":
        return <FaInfoCircle className="mr-1" />;
      case "Confirmada":
        return <FaCheckCircle className="mr-1" />;
      case "Cancelada":
        return <FaTimesCircle className="mr-1" />;
      case "Completada":
        return <FaCalendarCheck className="mr-1" />;
      default:
        return <FaInfoCircle className="mr-1" />;
    }
  };

  return (
    <div className={`rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <FaCalendarAlt className="mr-2 text-green-500" />
            {isUpcoming ? "Próximas Citas" : "Todas Mis Citas"}
          </h2>
          {!isUpcoming && (
            <button 
              onClick={() => setShowNewAppointmentForm(true)}
              className={`px-3 py-2 rounded-md flex items-center ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white`}
            >
              <FaCalendarPlus className="mr-2" /> Solicitar Cita
            </button>
          )}
        </div>
        
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-2">Cargando citas...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className={`text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <FaCalendarAlt className="mx-auto h-10 w-10 mb-2 opacity-50" />
            <p className="text-lg">No tienes citas {isUpcoming ? "próximas" : "programadas"}</p>
            {isUpcoming && (
              <button 
                onClick={() => setShowNewAppointmentForm(true)}
                className={`mt-4 px-3 py-2 rounded-md ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white`}
              >
                Solicitar una cita
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Fecha</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Hora</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Doctor</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Especialidad</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Estado</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredAppointments.map((appointment, index) => (
                  <tr key={index} className={darkMode ? 'bg-gray-800' : 'bg-white'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(appointment.fechaCita)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {appointment.horaCita || formatTime(appointment.fechaCita) || "No especificada"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Dr. {appointment.doctor ? `${appointment.doctor.nombre} ${appointment.doctor.apellido}` : (appointment.doctorNombre || 'Asignado')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {appointment.departamento || appointment.especialidad || 'General'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`flex items-center text-xs font-medium ${getStatusColor(appointment.estado)}`}>
                        {getStatusIcon(appointment.estado)}
                        {appointment.estado || "Pendiente"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => showAppointmentDetails(appointment)}
                        className={`px-3 py-1 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                        title="Ver detalles"
                      >
                        <FaInfoCircle className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {isUpcoming && appointments.length > 5 && (
        <div className="mt-4 text-center pb-4">
          <button 
            className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
          >
            Ver todas mis citas
          </button>
        </div>
      )}
      
      {/* Modal para detalles de cita */}
      {showModal && selectedAppointment && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${darkMode ? 'bg-black bg-opacity-70' : 'bg-gray-600 bg-opacity-50'}`}>
          <div className={`relative bg-white ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-xl p-6 max-w-md w-full`}>
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-semibold mb-4">Detalles de la Cita</h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <FaCalendarAlt className={`mr-3 ${getStatusColor(selectedAppointment.estado)} mt-1`} />
                <div>
                  <p className="font-medium">Fecha y Hora</p>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {formatDate(selectedAppointment.fechaCita)} - {selectedAppointment.horaCita || formatTime(selectedAppointment.fechaCita) || "No especificada"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FaUserMd className={`mr-3 ${getStatusColor(selectedAppointment.estado)} mt-1`} />
                <div>
                  <p className="font-medium">Médico</p>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Dr. {selectedAppointment.doctor ? `${selectedAppointment.doctor.nombre} ${selectedAppointment.doctor.apellido}` : (selectedAppointment.doctorNombre || 'Asignado')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FaHospital className={`mr-3 ${getStatusColor(selectedAppointment.estado)} mt-1`} />
                <div>
                  <p className="font-medium">Especialidad</p>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {selectedAppointment.departamento || selectedAppointment.especialidad || 'General'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FaInfoCircle className={`mr-3 ${getStatusColor(selectedAppointment.estado)} mt-1`} />
                <div>
                  <p className="font-medium">Motivo de la Consulta</p>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {selectedAppointment.motivo || 'No especificado'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                {getStatusIcon(selectedAppointment.estado)}
                <div>
                  <p className="font-medium">Estado</p>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} flex items-center`}>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(selectedAppointment.estado)}`}>
                      {selectedAppointment.estado || 'Pendiente'}
                    </span>
                  </p>
                </div>
              </div>
              
              {selectedAppointment.observacionesDoctor && (
                <div className="flex items-start">
                  <FaCommentMedical className={`mr-3 ${getStatusColor(selectedAppointment.estado)} mt-1`} />
                  <div>
                    <p className="font-medium">Observaciones del Médico</p>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {selectedAppointment.observacionesDoctor}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowModal(false)}
                className={`px-4 py-2 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Formulario para solicitar nueva cita */}
      {showNewAppointmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg shadow-lg p-6 max-w-md w-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
            <h3 className="text-xl font-bold mb-4">Solicitar Nueva Cita</h3>
            
            <form onSubmit={handleRequestAppointment}>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Especialidad</label>
                  <select 
                    className={`w-full px-3 py-2 rounded-md ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border`}
                    value={newAppointment.especialidad}
                    onChange={(e) => setNewAppointment({...newAppointment, especialidad: e.target.value})}
                    required
                  >
                    <option value="">Seleccionar especialidad</option>
                    <option value="Medicina General">Medicina General</option>
                    <option value="Pediatría">Pediatría</option>
                    <option value="Ortopedia">Ortopedia</option>
                    <option value="Cardiología">Cardiología</option>
                    <option value="Neurología">Neurología</option>
                    <option value="Oncología">Oncología</option>
                    <option value="Radiología">Radiología</option>
                    <option value="Fisioterapia">Fisioterapia</option>
                    <option value="Dermatología">Dermatología</option>
                    <option value="Otorrinolaringología">Otorrinolaringología</option>
                  </select>
                </div>
                
                <div>
                  <label className="block mb-1 font-medium">Fecha</label>
                  <input 
                    type="date" 
                    className={`w-full px-3 py-2 rounded-md ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border`}
                    value={newAppointment.fecha}
                    onChange={(e) => setNewAppointment({...newAppointment, fecha: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1 font-medium">Hora</label>
                  <input 
                    type="time" 
                    className={`w-full px-3 py-2 rounded-md ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border`}
                    value={newAppointment.hora}
                    onChange={(e) => setNewAppointment({...newAppointment, hora: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1 font-medium">Motivo de la consulta</label>
                  <textarea 
                    className={`w-full px-3 py-2 rounded-md ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border`}
                    value={newAppointment.motivo}
                    onChange={(e) => setNewAppointment({...newAppointment, motivo: e.target.value})}
                    rows="3"
                    required
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowNewAppointmentForm(false)}
                  className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} mr-3`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    'Solicitar Cita'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
