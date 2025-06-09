import React, { useState, useEffect } from 'react';
import { FaCommentMedical, FaUserMd, FaUser, FaPaperPlane, FaSearch } from 'react-icons/fa';
import axios from 'axios';

const PatientMessages = ({ darkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Obtener lista de médicos al montar el componente
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "http://localhost:3030/api/v1/user/get-all-doctor",
          { withCredentials: true }
        );
        if (data.doctor) {
          setDoctors(data.doctor);
          // Crear conversaciones vacías para cada médico
          const initialConversations = data.doctor.map(doctor => ({
            id: doctor._id,
            doctor: {
              id: doctor._id,
              nombre: `Dr. ${doctor.nombre} ${doctor.apellido}`,
              especialidad: doctor.departamentoMedico || 'Especialidad no especificada',
              foto: doctor.foto || null
            },
            mensajes: [],
            noLeidos: 0,
            ultimoMensaje: null
          }));
          setConversations(initialConversations);
        }
      } catch (error) {
        console.error("Error al obtener médicos:", error);
        alert("Error al cargar los médicos");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);
  
  // Filtrar conversaciones según el término de búsqueda
  const filteredConversations = conversations.filter(conversation => {
    const searchString = searchTerm.toLowerCase();
    return (
      conversation.doctor.nombre.toLowerCase().includes(searchString) ||
      conversation.doctor.especialidad.toLowerCase().includes(searchString)
    );
  });
  
  // Formatear fecha para la lista de conversaciones
  const formatDateForList = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
    }
  };
  
  // Formatear fecha para mensajes individuales
  const formatMessageDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Enviar un nuevo mensaje
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedConversation) return;
    
    // Aquí se enviaría el mensaje a la API en una aplicación real
    alert("Funcionalidad en desarrollo: El mensaje se enviaría al médico.");
    
    setNewMessage('');
  };
  
  // Seleccionar una conversación y marcarla como leída
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    
    // Marcar mensajes como leídos (en una aplicación real, esto se sincronizaría con la API)
    if (conversation.noLeidos > 0) {
      // Código para marcar mensajes como leídos
    }
  };

  return (
    <div className={`rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} flex flex-col h-[calc(100vh-220px)]`}>
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold flex items-center">
          <FaCommentMedical className="mr-2 text-green-500" />
          Mensajes con mis Médicos
        </h2>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Panel lateral de conversaciones */}
        <div className={`w-1/3 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col`}>
          {/* Buscador */}
          <div className={`p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`relative ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className={`pl-10 pr-4 py-2 rounded-lg w-full ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 focus:border-green-500' 
                    : 'bg-gray-50 border-gray-300 focus:border-green-500'
                } border focus:outline-none focus:ring-2 focus:ring-green-200`}
                placeholder="Buscar conversaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Lista de conversaciones */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center py-4">Cargando médicos...</div>
            ) : filteredConversations.length === 0 ? (
              <div className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No se encontraron médicos
              </div>
            ) : (
              filteredConversations.map(conversation => (
                <div
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`p-4 cursor-pointer border-b ${
                    darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                  } ${
                    selectedConversation && selectedConversation.id === conversation.id
                      ? darkMode
                        ? 'bg-gray-700 border-green-500 border-l-4'
                        : 'bg-gray-100 border-green-500 border-l-4'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {conversation.doctor.foto ? (
                        <img 
                          src={conversation.doctor.foto} 
                          alt={conversation.doctor.nombre}
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                          <FaUserMd />
                        </div>
                      )}
                      <div>
                        <h3 className={`font-semibold ${darkMode && 'text-white'}`}>{conversation.doctor.nombre}</h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {conversation.doctor.especialidad}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {conversation.ultimoMensaje && (
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatDateForList(conversation.ultimoMensaje)}
                        </span>
                      )}
                      {conversation.noLeidos > 0 && (
                        <span className="ml-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                          {conversation.noLeidos}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Área de chat */}
        <div className="w-2/3 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Encabezado del chat */}
              <div className={`p-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center">
                  {selectedConversation.doctor.foto ? (
                    <img 
                      src={selectedConversation.doctor.foto} 
                      alt={selectedConversation.doctor.nombre}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                      <FaUserMd />
                    </div>
                  )}
                  <div>
                    <h3 className={`font-semibold ${darkMode && 'text-white'}`}>{selectedConversation.doctor.nombre}</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {selectedConversation.doctor.especialidad}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Área de mensajes */}
              <div className="flex-1 overflow-y-auto p-4">
                {selectedConversation.mensajes.length === 0 ? (
                  <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No hay mensajes aún. Inicia una conversación.
                  </div>
                ) : (
                  selectedConversation.mensajes.map((mensaje) => (
                    <div
                      key={mensaje.id}
                      className={`mb-4 flex ${
                        mensaje.remitente === 'paciente' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 max-w-xs ${
                          mensaje.remitente === 'paciente'
                            ? 'bg-green-500 text-white'
                            : darkMode
                            ? 'bg-gray-700 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p>{mensaje.texto}</p>
                        <p className={`text-xs mt-1 ${
                          mensaje.remitente === 'paciente' 
                            ? 'text-green-100' 
                            : darkMode 
                              ? 'text-gray-300' 
                              : 'text-gray-500'
                        }`}>
                          {formatMessageDate(mensaje.fecha)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Área de entrada de mensaje */}
              <form onSubmit={handleSendMessage} className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Escribe tu mensaje..."
                    className={`flex-1 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-200 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 focus:border-green-500' 
                        : 'bg-white border-gray-300 focus:border-green-500'
                    }`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="ml-3 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className={`flex-1 flex flex-col items-center justify-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <FaCommentMedical size={48} className="mb-3 opacity-50" />
              <p>Selecciona un médico para ver o iniciar una conversación</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientMessages;
