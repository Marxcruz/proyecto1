import { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import axios from "axios";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const { isAuthenticated } = useContext(Context);

  // obtener todos los pacientes
  // mediante una función en useEffect
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3030/api/v1/user/get-all-patient",
          { withCredentials: true }
        );
        setPatients(data.patient);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchPatients();
  }, []);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  // eliminar paciente por administrador

  const handleDelete = async (patientId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:3030/api/v1/user/delete/patient/${patientId}`,
        { withCredentials: true }
      );
      setPatients((prevPatients) =>
        prevPatients.filter((patient) => patient._id !== patientId)
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="flex flex-col gap-6 mx-auto px-4 py-8 md:px-6 lg:px-8 max-w-7xl bg-slate-100 min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
          Gestión de Pacientes
        </h2>
        <p className="text-sm text-slate-600">
          Visualiza, administra y elimina perfiles de los pacientes registrados en el sistema.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] table-auto">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="py-3 px-4 text-center text-sm font-semibold">#</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Nombre</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Correo</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Identificación</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Teléfono</th>
                <th className="py-3 px-4 text-center text-sm font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody>
              {patients && patients.length > 0 ? (
                patients.map((ele, index) => (
                  <tr key={ele._id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} border-b border-slate-200 hover:bg-slate-100 transition-colors duration-150`}>
                    <td className="py-3 px-4 text-center text-sm text-gray-700 whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">{`${ele.nombre} ${ele.apellido}`}</td>
                    <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">
                      {ele.correo}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">
                      {ele.identificacion}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">
                      {ele.telefono}
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-gray-700 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleDelete(ele._id)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-100 transition-colors duration-150"
                        aria-label="Eliminar paciente"
                      >
                        <MdDelete size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                      <p className="font-semibold text-lg">No se encontraron pacientes</p>
                      <p className="text-sm text-gray-400">Actualmente no hay pacientes registrados en el sistema.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Patients;
