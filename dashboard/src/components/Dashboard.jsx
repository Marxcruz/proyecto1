import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { FaNotesMedical, FaUserMd } from "react-icons/fa";
import ChatBot from "./ChatBot";
import { io } from 'socket.io-client';

// Conexión al socket
const socket = io('http://localhost:3030', {
  withCredentials: true,
  transports: ['websocket'],
});

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const { isAuthenticated } = useContext(Context);
  useEffect(() => {
    socket.connect();
    console.log('Conectado al socket en dashboard de administrador');

    // Escuchar eventos de actualización de estado de citas
    socket.on('appointment_status_updated', (data) => {
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === data.appointmentId
            ? { ...appointment, estado: data.newStatus, observacionesDoctor: data.observaciones }
            : appointment
        )
      );
      toast.info(`Estado de cita actualizado a ${data.newStatus}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3030/api/v1/appointments/get-all-appointment",
          { withCredentials: true }
        );
        setAppointments(data.appointment || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error al cargar las citas');
      }
    };
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3030/api/v1/user/get-all-doctor",
          { withCredentials: true }
        );
        setTotalDoctors(data.doctor?.length || 0);
      } catch (error) {}
    };
    fetchAppointments();
    fetchDoctors();
  }, []);

  const handleStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:3030/api/v1/appointments/update-status-appointment/${appointmentId}`,
        { estado: status },
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, estado: status }
            : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al actualizar el estado de la cita");
    }
  };

  const handleDelete = async (appointmentId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:3030/api/v1/appointments/delete-appointment/${appointmentId}`,
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment._id !== appointmentId)
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al eliminar la cita");
    }
  };
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <div className="flex flex-col gap-6 mx-auto px-4 py-8 md:px-6 lg:px-8 max-w-7xl bg-slate-100 min-h-screen">
        {/* Sección Superior: Bienvenida y Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tarjeta de Bienvenida */}
          <div className="md:col-span-1 bg-gradient-to-br from-indigo-600 to-blue-500 text-white rounded-xl shadow-lg p-6 flex flex-col justify-center">
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">
              Hola, <span className="font-semibold">Administrador</span>
            </h1>
            <p className="text-indigo-100 text-sm">
              Bienvenido al Panel de Control. Aquí puedes gestionar historiales clínicos, citas y personal médico de manera eficiente.
            </p>
          </div>

          {/* Tarjeta: Total de Historiales */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Historiales</p>
              <h2 className="text-3xl font-bold text-gray-800 tracking-tight">{appointments.length}</h2>
            </div>
            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg">
              <FaNotesMedical size={28} />
            </div>
          </div>

          {/* Tarjeta: Doctores Registrados */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Doctores Registrados</p>
              <p className="text-3xl font-bold text-gray-800 tracking-tight">{totalDoctors}</p>
            </div>
            <div className="bg-pink-100 text-pink-600 p-3 rounded-lg">
              <FaUserMd size={28} />
            </div>
          </div>
        </div>

        {/* Sección Inferior: Tabla de Historiales Clínicos y Citas */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h4 className="text-xl md:text-2xl text-center font-semibold mb-6 text-gray-800">
            Historiales Clínicos y Citas
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] table-auto">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold">Paciente</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold">Fecha Consulta</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold">Médico Tratante</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold">Especialidad</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold">Estado</th>
                  <th className="py-3 px-4 text-center text-sm font-semibold">Atendido</th>
                  <th className="py-3 px-4 text-center text-sm font-semibold">Opciones</th>
                </tr>
              </thead>
              <tbody>
                {appointments && appointments.length > 0 ? (
                  appointments.map((item, index) => (
                    <tr key={item._id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} border-b border-slate-200 hover:bg-slate-100 transition-colors duration-150`}>
                      <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">{`${item.nombre || ''} ${item.apellido || ''}`}</td>
                      <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">
                        {item.fechaCita ? item.fechaCita.substring(0, 10) : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">{`${item.doctor?.nombre || 'N/A'} ${item.doctor?.apellido || ''}`}</td>
                      <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">
                        {item.departamento || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <select
                          value={item.estado || 'Pendiente'}
                          onChange={(e) => handleStatus(item._id, e.target.value)}
                          className={`w-full p-2 rounded-md border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm font-medium transition-colors duration-150 ${
                            (item.estado || 'Pendiente') === "Pendiente"
                              ? "text-blue-700 bg-blue-100 border-blue-300"
                              : (item.estado || 'Pendiente') === "Confirmada"
                              ? "text-green-700 bg-green-100 border-green-300"
                              : "text-red-700 bg-red-100 border-red-300"
                          }`}
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="Confirmada">Confirmada</option>
                          <option value="Cancelada">Cancelada</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.haVisitado ? (
                          <GoCheckCircleFill className="text-green-500 text-xl mx-auto" />
                        ) : (
                          <AiFillCloseCircle className="text-red-500 text-xl mx-auto" />
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleDelete(item._id)}
                          className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-100 transition-colors duration-150"
                          aria-label="Eliminar cita"
                        >
                          <MdDelete size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.39m3.421 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a15.995 15.995 0 00-4.764 4.648l-3.876 5.814a1.151 1.151 0 001.597 1.597l5.814-3.876a15.996 15.996 0 004.649-4.763m-3.42-3.42a15.995 15.995 0 004.764-4.648" />
                        </svg>
                        <p className="font-semibold text-lg">No se encontraron citas</p>
                        <p className="text-sm text-gray-400">Actualmente no hay historiales clínicos o citas para mostrar.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Burbuja flotante de ChatBot IA */}
      <ChatBot />
    </>
  );
}

export default Dashboard;
