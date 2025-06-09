import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import DoctorSidebar from "./DoctorSidebar";

const DoctorHistorial = () => {
  const { id } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuevaNota, setNuevaNota] = useState({
    titulo: "",
    descripcion: "",
    diagnostico: "",
    tratamiento: "",
    indicaciones: ""
  });
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const fetchPacienteYCitas = async () => {
      try {
        setLoading(true);
        
        // Obtener información del paciente
        const pacienteResponse = await axios.get(
          `http://localhost:3030/api/v1/user/get-patient/${id}`,
          { withCredentials: true }
        );

        // Obtener citas del paciente
        const citasResponse = await axios.get(
          `http://localhost:3030/api/v1/appointment/patient-appointments/${id}`,
          { withCredentials: true }
        );

        if (pacienteResponse.data.success) {
          setPaciente(pacienteResponse.data.patient);
        }

        if (citasResponse.data.success) {
          setCitas(citasResponse.data.appointments || []);
        }
      } catch (error) {
        console.error("Error al obtener datos del paciente:", error);
        toast.error("Error al cargar la información del paciente");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPacienteYCitas();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevaNota(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevaNota.titulo || !nuevaNota.descripcion) {
      toast.error("Título y descripción son obligatorios");
      return;
    }

    try {
      setGuardando(true);
      const response = await axios.post(
        "http://localhost:3030/api/v1/historiales/crear",
        {
          ...nuevaNota,
          pacienteId: id,
          fecha: new Date().toISOString()
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Nota clínica guardada exitosamente");
        setNuevaNota({
          titulo: "",
          descripcion: "",
          diagnostico: "",
          tratamiento: "",
          indicaciones: ""
        });
        
        // Recargar las citas para mostrar la nueva nota
        const citasResponse = await axios.get(
          `http://localhost:3030/api/v1/appointment/patient-appointments/${id}`,
          { withCredentials: true }
        );

        if (citasResponse.data.success) {
          setCitas(citasResponse.data.appointments || []);
        }
      }
    } catch (error) {
      console.error("Error al guardar nota clínica:", error);
      toast.error("Error al guardar la nota clínica");
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <DoctorSidebar />
        <div className="flex-1 overflow-auto p-6 ml-64">
          <div className="text-center py-12">Cargando información del paciente...</div>
        </div>
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="flex h-screen bg-gray-100">
        <DoctorSidebar />
        <div className="flex-1 overflow-auto p-6 ml-64">
          <div className="text-center py-12 text-red-500">Paciente no encontrado</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <DoctorSidebar />
      <div className="flex-1 overflow-auto p-6 ml-64">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Historial Clínico - {paciente.nombre} {paciente.apellido}
        </h1>

        {/* Información del paciente */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Información del Paciente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">ID:</span> {paciente.identificacion}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Email:</span> {paciente.correo}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Teléfono:</span> {paciente.telefono}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Género:</span> {paciente.genero}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Fecha de nacimiento:</span>{" "}
                {new Date(paciente.fechaNacimiento).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Edad:</span>{" "}
                {new Date().getFullYear() - new Date(paciente.fechaNacimiento).getFullYear()}
              </p>
            </div>
          </div>
        </div>

        {/* Historial de citas */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Historial de Consultas</h2>
          
          {citas.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay consultas registradas para este paciente</p>
          ) : (
            <div className="space-y-4">
              {citas.map((cita) => (
                <div key={cita._id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg">
                      {new Date(cita.fechaCita).toLocaleDateString()} - {cita.horaCita || "Sin hora específica"}
                    </h3>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium ${cita.estado === "Completada" ? "bg-green-100 text-green-800" : cita.estado === "Pendiente" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}`}
                    >
                      {cita.estado}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">
                    <span className="font-medium">Departamento:</span> {cita.departamento}
                  </p>
                  {cita.notas && (
                    <div className="mt-2">
                      <p className="font-medium">Notas clínicas:</p>
                      <p className="text-gray-700 mt-1">{cita.notas}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Formulario para nueva nota clínica */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Nueva Nota Clínica</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="titulo">
                Título
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={nuevaNota.titulo}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="descripcion">
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={nuevaNota.descripcion}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="diagnostico">
                Diagnóstico
              </label>
              <textarea
                id="diagnostico"
                name="diagnostico"
                value={nuevaNota.diagnostico}
                onChange={handleChange}
                rows="2"
                className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="tratamiento">
                Tratamiento
              </label>
              <textarea
                id="tratamiento"
                name="tratamiento"
                value={nuevaNota.tratamiento}
                onChange={handleChange}
                rows="2"
                className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="indicaciones">
                Indicaciones y Recomendaciones
              </label>
              <textarea
                id="indicaciones"
                name="indicaciones"
                value={nuevaNota.indicaciones}
                onChange={handleChange}
                rows="2"
                className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={guardando}
                className={`px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 ${guardando ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {guardando ? "Guardando..." : "Guardar Nota"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorHistorial;
