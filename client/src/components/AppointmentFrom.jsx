import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AppointmentForm = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [genero, setGenero] = useState("");
  const [fechaCita, setFechaCita] = useState("");
  const [departamento, setDepartamento] = useState("Pediatría");
  const [nombreDoctor, setNombreDoctor] = useState("");
  const [apellidoDoctor, setApellidoDoctor] = useState("");
  const [direccion, setDireccion] = useState("");
  const [haVisitado, setHaVisitado] = useState(false);
  const [motivo, setMotivo] = useState("");

  const departmentsArray = [
    "Pediatría",
    "Ortopedia",
    "Cardiología",
    "Neurología",
    "Oncología",
    "Radiología",
    "Fisioterapia",
    "Dermatología",
    "Otorrinolaringología",
  ];

  const [doctors, setDoctors] = useState([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [errorDoctors, setErrorDoctors] = useState(null);
  
  useEffect(() => {
    const fetchDoctor = async () => {
      setIsLoadingDoctors(true);
      setErrorDoctors(null);
      try {
        const { data } = await axios.get(
          "http://localhost:3030/api/v1/user/get-all-doctor",
          { withCredentials: true }
        );
        console.log("Doctores cargados:", data);
        setDoctors(data?.doctor || []);
      } catch (error) {
        console.error("Error al cargar doctores:", error);
        setErrorDoctors("No se pudieron cargar los doctores. Intente de nuevo.");
      } finally {
        setIsLoadingDoctors(false);
      }
    };
    fetchDoctor();
  }, []);

  const handleAppointment = async (e) => {
    e.preventDefault();
    try {
      // Validar campos obligatorios
      if (!nombre || !apellido || !correo || !telefono || !identificacion || !fechaNacimiento || 
          !genero || !fechaCita || !departamento || !nombreDoctor || !apellidoDoctor || !direccion || !motivo) {
        toast.error("Por favor complete todos los campos requeridos");
        return;
      }
      
      // Convertir a booleano
      const haVisitadoBool = Boolean(haVisitado);
      
      console.log("Enviando datos:", {
        nombre,
        apellido,
        correo,
        telefono,
        identificacion,
        fechaNacimiento,
        genero,
        fechaCita,
        departamento,
        nombre_doctor: nombreDoctor,
        apellido_doctor: apellidoDoctor,
        haVisitado: haVisitadoBool,
        direccion,
        motivo,
      });
      
      const { data } = await axios.post(
        "http://localhost:3030/api/v1/appointments/create-appointment",
        {
          nombre,
          apellido,
          correo,
          telefono,
          identificacion,
          fechaNacimiento,
          genero,
          fechaCita,
          departamento,
          nombre_doctor: nombreDoctor,
          apellido_doctor: apellidoDoctor,
          haVisitado: haVisitadoBool,
          direccion,
          motivo,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      setNombre("");
      setApellido("");
      setCorreo("");
      setTelefono("");
      setIdentificacion("");
      setFechaNacimiento("");
      setGenero("");
      setFechaCita("");
      setDepartamento("Pediatría");
      setNombreDoctor("");
      setApellidoDoctor("");
      setHaVisitado(false);
      setDireccion("");
      setMotivo("");
    } catch (error) {
      console.error("Error al crear cita:", error);
      toast.error(error.response?.data?.message || "Error al crear la cita. Intente de nuevo.");
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 bg-blue-50 my-4 border border-blue-200 rounded-lg shadow-lg">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-white p-2 rounded-full shadow-md mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-center text-blue-800">
          Registro de Historial Clínico
        </h1>
      </div>
      <div className="bg-white p-4 rounded-lg border border-blue-200 mb-6 text-center text-gray-600">
        <p>Por favor complete todos los campos con información precisa para crear un historial clínico completo.</p>
      </div>
      <form className="space-y-6" onSubmit={handleAppointment}>
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Información del Paciente</h2>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
              <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full md:w-1/2 p-3 border border-blue-200 bg-white rounded-md outline-none shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
            <input
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="w-full md:w-1/2 p-3 border border-blue-200 bg-white rounded-md outline-none shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
            type="text"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full md:w-1/2 p-3 border border-blue-200 bg-white rounded-md outline-none shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
            <input
            type="number"
            placeholder="Número de teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full md:w-1/2 p-3 border border-blue-200 bg-white rounded-md outline-none shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
            type="number"
            placeholder="Número de identificación"
            value={identificacion}
            onChange={(e) => setIdentificacion(e.target.value)}
            className="w-full md:w-1/2 p-3 border border-blue-200 bg-white rounded-md outline-none shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
            <input
            type="date"
            placeholder="Fecha de nacimiento"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            className="w-full md:w-1/2 p-3 border border-blue-200 bg-white rounded-md outline-none shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <select
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
            className="w-full md:w-1/2 p-3 border border-blue-200 bg-white rounded-md outline-none shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Seleccionar género</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
            <input
            type="date"
            placeholder="Fecha de la cita"
            value={fechaCita}
            onChange={(e) => setFechaCita(e.target.value)}
            className="w-full md:w-1/2 p-3 border border-blue-200 bg-white rounded-md outline-none shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200 mb-6 mt-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Información Médica</h2>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <select
              value={departamento}
              onChange={(e) => {
                setDepartamento(e.target.value);
                setNombreDoctor("");
                setApellidoDoctor("");
              }}
              className="w-full md:w-1/2 p-3 border border-blue-200 bg-white rounded-md outline-none shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {departmentsArray.map((depart, index) => (
                <option value={depart} key={index}>
                  {depart}
                </option>
              ))}
            </select>
            <select
              value={nombreDoctor && apellidoDoctor ? `${nombreDoctor} ${apellidoDoctor}` : ""}
              onChange={(e) => {
                if (e.target.value) {
                  const parts = e.target.value.split(" ");
                  if (parts.length >= 2) {
                    const nombre = parts[0];
                    const apellido = parts.slice(1).join(" ");
                    setNombreDoctor(nombre);
                    setApellidoDoctor(apellido);
                  }
                } else {
                  setNombreDoctor("");
                  setApellidoDoctor("");
                }
              }}
              disabled={!departamento || isLoadingDoctors}
              className="w-full md:w-1/2 p-3 border border-blue-200 bg-white rounded-md outline-none shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Seleccionar doctor</option>
              {isLoadingDoctors ? (
                <option disabled>Cargando doctores...</option>
              ) : errorDoctors ? (
                <option disabled>Error al cargar doctores</option>
              ) : doctors
                .filter((doctor) => doctor.departamentoMedico === departamento)
                .map((doctor, index) => (
                  <option
                    value={`${doctor.nombre} ${doctor.apellido}`}
                    key={index}
                  >
                    {doctor.nombre} {doctor.apellido}
                  </option>
                ))}
              {!isLoadingDoctors && !errorDoctors && doctors.filter((doctor) => doctor.departamentoMedico === departamento).length === 0 && (
                <option disabled>No hay doctores disponibles para este departamento</option>
              )}
          </select>
        </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200 mb-6 mt-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Información Adicional</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Motivo de la consulta</label>
            <textarea
              rows="3"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Describa el motivo de su consulta (síntomas, dolencias, etc.)"
              className="w-full p-3 border border-blue-200 bg-white rounded-md outline-none shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Dirección completa del paciente</label>
            <textarea
              rows="4"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Dirección"
              className="w-full p-3 border border-blue-200 bg-white rounded-md outline-none shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-4 mb-4 bg-blue-50 p-3 rounded-md">
            <p className="mb-0 text-blue-800 font-medium">
              ¿Tiene historial clínico previo en esta institución?
            </p>
            <input
              type="checkbox"
              checked={haVisitado}
              onChange={(e) => setHaVisitado(e.target.checked)}
              className="w-6 h-6 rounded-md border-blue-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mx-auto bg-green-600 text-white w-full font-semibold
          cursor-pointer hover:bg-green-700 py-3 px-6 rounded-md shadow-md transition duration-300"
        >
          REGISTRAR HISTORIAL CLÍNICO
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
