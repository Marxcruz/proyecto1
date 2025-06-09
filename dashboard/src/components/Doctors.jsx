import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import axios from "axios";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const { isAuthenticated } = useContext(Context);

  // obtener todos los doctores
  // mediante una función en useEffect
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3030/api/v1/user/get-all-doctor",
          { withCredentials: true }
        );
        setDoctors(data.doctor);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchDoctors();
  }, []);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  // eliminar doctor por administrador

  const handleDelete = async (doctorId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:3030/api/v1/user/delete/doctor/${doctorId}`,
        { withCredentials: true }
      );
      setDoctors((prevDoctors) =>
        prevDoctors.filter((doctor) => doctor._id !== doctorId)
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
          Gestión de Médicos Especialistas
        </h2>
        <p className="text-sm text-slate-600">
          Visualiza, administra y elimina perfiles de los médicos registrados en el sistema.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] table-auto">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="py-3 px-4 text-center text-sm font-semibold">#</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Imagen</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Nombre</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Especialidad</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Identificación</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Teléfono</th>
                <th className="py-3 px-4 text-center text-sm font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody>
              {doctors && doctors.length > 0 ? (
                doctors.map((ele, index) => (
                  <tr key={ele._id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} border-b border-slate-200 hover:bg-slate-100 transition-colors duration-150`}>
                    <td className="py-3 px-4 text-center text-sm text-gray-700 whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">
                      {ele.imagenDoctor && ele.imagenDoctor.url ? (
                        <img 
                          src={ele.imagenDoctor.url} 
                          alt={`Dr. ${ele.nombre} ${ele.apellido}`} 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">{`${ele.nombre} ${ele.apellido}`}</td>
                    <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">
                      {ele.departamentoMedico}
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
                        aria-label="Eliminar doctor"
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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-3.473-2.185M15.364 5.126A9.041 9.041 0 0112 4.5c-2.17 0-4.207.576-5.963 1.584A6.062 6.062 0 016 8.281m7.5 0a5.971 5.971 0 00-3.473 2.186m0 0A9.041 9.041 0 0012 13.5c2.17 0 4.207-.576 5.963-1.584A6.062 6.062 0 0018 9.719m-7.5 0C9.281 7.5 7.5 8.281 7.5 9.719c0 1.438 1.781 2.219 3.001 2.219s3.001-.781 3.001-2.219z" />
                      </svg>
                      <p className="font-semibold text-lg">No se encontraron médicos</p>
                      <p className="text-sm text-gray-400">Actualmente no hay médicos registrados en el sistema.</p>
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

export default Doctors;
