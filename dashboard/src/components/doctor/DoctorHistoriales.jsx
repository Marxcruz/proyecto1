import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DoctorSidebar from '../DoctorSidebar';
import { FaSearch, FaFileMedical } from 'react-icons/fa';

const DoctorHistoriales = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:3030/api/v1/user/doctor-patients",
          { withCredentials: true }
        );

        if (response.data.success) {
          setPatients(response.data.patients || []);
        } else {
          toast.error(response.data.message || "Error al cargar pacientes");
        }
      } catch (error) {
        console.error("Error al obtener pacientes:", error);
        toast.error("Error al cargar los pacientes");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filtrar pacientes por término de búsqueda
  const filteredPatients = patients.filter(patient =>
    `${patient.nombre} ${patient.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.identificacion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.correo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <DoctorSidebar />
      <div className="flex-1 overflow-auto p-6 ml-64">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Historiales Clínicos</h1>
        
        {/* Barra de búsqueda */}
        <div className="mb-6">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="text-gray-500" />
            </span>
            <input
              type="text"
              placeholder="Buscar paciente por nombre, ID o correo..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Lista de pacientes */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando pacientes...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No se encontraron pacientes con ese criterio de búsqueda" : "No hay pacientes registrados"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 text-left text-gray-600">Nombre</th>
                    <th className="py-3 px-4 text-left text-gray-600">Identificación</th>
                    <th className="py-3 px-4 text-left text-gray-600">Correo</th>
                    <th className="py-3 px-4 text-left text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient._id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {patient.nombre} {patient.apellido}
                      </td>
                      <td className="py-3 px-4">{patient.identificacion || "No disponible"}</td>
                      <td className="py-3 px-4">{patient.correo || "No disponible"}</td>
                      <td className="py-3 px-4">
                        <Link 
                          to={`/doctor-dashboard/paciente/${patient._id}`}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center w-fit"
                        >
                          <FaFileMedical className="mr-1" /> Ver Historial
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorHistoriales;
