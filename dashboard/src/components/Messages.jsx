import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3030/api/v1/message/get-all-message",
          { withCredentials: true }
        );
        setMessages(data.message);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error al cargar los mensajes");
      }
    };
    fetchMessages();
  }, []);

  const handleDelete = async (messageId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:3030/api/v1/message/message-delete/${messageId}`,
        { withCredentials: true }
      );
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== messageId)
      );
      toast.success(data?.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="flex flex-col gap-6 mx-auto px-4 py-8 md:px-6 lg:px-8 max-w-7xl bg-slate-100 min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
          Bandeja de Entrada de Mensajes
        </h2>
        <p className="text-sm text-slate-600">
          Visualiza y administra los mensajes recibidos a través del formulario de contacto.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] table-auto">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="py-3 px-4 text-center text-sm font-semibold">#</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Nombre</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Apellido</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Correo</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Teléfono</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Mensaje (Extracto)</th>
                <th className="py-3 px-4 text-center text-sm font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody>
              {messages && messages.length > 0 ? (
                messages.map((element, index) => (
                  <tr key={element._id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} border-b border-slate-200 hover:bg-slate-100 transition-colors duration-150`}>
                    <td className="py-3 px-4 text-center text-sm text-gray-700 whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">{element.nombre}</td>
                    <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">{element.apellido}</td>
                    <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">{element.correo}</td>
                    <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">{element.telefono}</td>
                    <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">
                      {element.mensaje?.slice(0, 30) +
                        (element.mensaje?.length > 30 ? "..." : "")}
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-gray-700 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleDelete(element._id)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-100 transition-colors duration-150"
                        aria-label="Eliminar mensaje"
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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.25 2.25v3.75a2.25 2.25 0 01-2.25 2.25H2.25v-6z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 13.5h-3.86a2.25 2.25 0 00-2.25 2.25v3.75a2.25 2.25 0 002.25 2.25h3.86v-6z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 13.5V21M12 3v5.25A2.25 2.25 0 009.75 10.5H4.5M12 3h5.25A2.25 2.25 0 0119.5 5.25v5.25c0 .414-.168.79-.468 1.072L12 13.5z" />
                      </svg>
                      <p className="font-semibold text-lg">No hay mensajes nuevos</p>
                      <p className="text-sm text-gray-400">Actualmente no hay mensajes en tu bandeja de entrada.</p>
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

export default Messages;
