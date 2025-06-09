import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import DoctorSidebar from "./DoctorSidebar";

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:3030/api/v1/appointments/doctor-patients",
          { withCredentials: true }
        );

        if (response.data.success) {
          setPatients(response.data.patients || []);
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

  // Filtrar pacientes según el término de búsqueda
  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.nombre} ${patient.apellido}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           patient.identificacion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           patient.correo?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <DoctorSidebar />
      <div className="flex-1 overflow-auto p-6 ml-64">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis Pacientes</h1>

        {/* Buscador */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar paciente por nombre, identificación o correo"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Lista de pacientes */}
        {loading ? (
          <div className="text-center py-4">Cargando pacientes...</div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            {searchTerm ? "No se encontraron pacientes con ese criterio de búsqueda" : "No tiene pacientes asignados"}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <div key={patient._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {patient.nombre} {patient.apellido}
                  </h2>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">ID:</span> {patient.identificacion}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Correo:</span> {patient.correo}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Teléfono:</span> {patient.telefono}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Género:</span> {patient.genero}
                  </p>
                  <p className="text-gray-600 mb-4">
                    <span className="font-medium">Fecha de nacimiento:</span>{" "}
                    {new Date(patient.fechaNacimiento).toLocaleDateString()}
                  </p>
                  <div className="flex space-x-2 mt-4">
                    <a
                      href={`/doctor-dashboard/paciente/${patient._id}`}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-center flex-1"
                    >
                      Ver historial
                    </a>
                    <a
                      href={`/doctor-dashboard/historial-nuevo/${patient._id}`}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-center flex-1"
                    >
                      Nueva entrada
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPatients;
