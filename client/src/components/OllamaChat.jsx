import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import OllamaService from '../services/ollamaService.js';

const OllamaChat = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('consultas');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState('checking');
  const [ollamaModels, setOllamaModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [isAIAssistantEnabled, setIsAIAssistantEnabled] = useState(true);
  const [isAITyping, setIsAITyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  // Estilos para el componente
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      height: '80vh',
      border: '1px solid #e2e8f0',
    },
    header: {
      fontSize: '1.6rem',
      fontWeight: 'bold',
      color: '#3B82F6',
      textAlign: 'center',
      marginBottom: '20px',
      borderBottom: '2px solid #EBF5FF',
      paddingBottom: '12px',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif',
    },
    statusIndicator: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginBottom: '15px',
      padding: '10px',
      backgroundColor: '#F1F5F9',
      borderRadius: '10px',
      fontSize: '0.9rem',
      border: '1px solid #E2E8F0',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    },
    joinForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
    },
    label: {
      fontSize: '0.9rem',
      fontWeight: '500',
      color: '#4B5563',
    },
    input: {
      padding: '12px 15px',
      borderRadius: '8px',
      border: '1px solid #E5E7EB',
      fontSize: '1rem',
    },
    select: {
      padding: '12px 15px',
      borderRadius: '8px',
      border: '1px solid #E5E7EB',
      fontSize: '1rem',
      backgroundColor: 'white',
    },
    button: {
      backgroundColor: '#3B82F6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 15px',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '10px',
    },
    messagesContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginBottom: '15px',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #E5E7EB',
    },
    messageItem: {
      padding: '12px 16px',
      borderRadius: '12px',
      maxWidth: '80%',
      wordBreak: 'break-word',
      marginBottom: '8px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      position: 'relative',
      lineHeight: '1.5',
    },
    userMessage: {
      backgroundColor: '#EBF5FF',
      alignSelf: 'flex-start',
      borderBottomLeftRadius: '4px',
      color: '#1E40AF',
      border: '1px solid #BFDBFE',
    },
    aiMessage: {
      backgroundColor: '#F0FDF4',
      alignSelf: 'flex-end',
      borderBottomRightRadius: '4px',
      color: '#065F46',
      border: '1px solid #D1FAE5',
      borderRight: '4px solid #10B981',
      paddingRight: '14px',
    },
    otherMessage: {
      backgroundColor: '#F3F4F6',
      alignSelf: 'flex-start',
      borderBottomLeftRadius: '4px',
      color: '#4B5563',
      border: '1px solid #E5E7EB',
    },
    messageForm: {
      display: 'flex',
      gap: '10px',
      marginTop: '15px',
      position: 'relative',
      borderTop: '1px solid #E5E7EB',
      paddingTop: '15px',
    },
    messageInput: {
      flex: 1,
      padding: '14px 18px',
      borderRadius: '24px',
      border: '1px solid #E5E7EB',
      fontSize: '1rem',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      outline: 'none',
      '&:focus': {
        borderColor: '#3B82F6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)',
      }
    },
    sendButton: {
      backgroundColor: '#3B82F6',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '48px',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1rem',
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'background-color 0.2s, transform 0.2s',
      '&:hover': {
        backgroundColor: '#2563EB',
        transform: 'scale(1.05)',
      }
    },
    modelSelector: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '15px',
      padding: '8px',
      backgroundColor: '#E5E7EB',
      borderRadius: '8px',
      fontSize: '0.9rem',
    },
    toggleContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '15px',
    },
    toggle: {
      position: 'relative',
      display: 'inline-block',
      width: '40px',
      height: '20px',
    },
    toggleInput: {
      opacity: 0,
      width: 0,
      height: 0,
    },
    toggleSlider: {
      position: 'absolute',
      cursor: 'pointer',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#ccc',
      transition: '0.4s',
      borderRadius: '34px',
    },
    toggleSliderChecked: {
      backgroundColor: '#10B981',
    },
    toggleSliderBefore: {
      position: 'absolute',
      content: '""',
      height: '16px',
      width: '16px',
      left: '2px',
      bottom: '2px',
      backgroundColor: 'white',
      transition: '0.4s',
      borderRadius: '50%',
    },
    toggleSliderBeforeChecked: {
      transform: 'translateX(20px)',
    },
  };

  // Conectar al servidor de Socket.IO
  useEffect(() => {
    const newSocket = io('http://localhost:3030');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Conectado al servidor de Socket.IO');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Desconectado del servidor de Socket.IO');
      setIsConnected(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Verificar el estado de Ollama
  useEffect(() => {
    const checkOllamaStatus = async () => {
      try {
        console.log('Verificando estado de Ollama...');
        const response = await OllamaService.checkStatus();
        console.log('Respuesta completa de Ollama:', response);
        
        if (response && response.online) {
          setOllamaStatus('online');
          if (response.models && response.models.length > 0) {
            setOllamaModels(response.models);
            setSelectedModel(response.models[0].name);
            console.log('Modelos disponibles:', response.models);
          } else {
            console.warn('Ollama está en línea pero no se encontraron modelos');
            // Configurar modelo por defecto si no hay modelos detectados
            setSelectedModel('llama3.1');
          }
        } else {
          console.warn('Ollama no está disponible:', response);
          setOllamaStatus('offline');
        }
      } catch (error) {
        console.error('Error al verificar el estado de Ollama:', error);
        setOllamaStatus('offline');
      }
    };

    checkOllamaStatus();
    // Verificar el estado cada 15 segundos
    const interval = setInterval(checkOllamaStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  // Configurar eventos de Socket.IO
  useEffect(() => {
    if (!socket) return;

    socket.on('message_history', (history) => {
      setMessages(history);
    });

    socket.on('receive_message', (message) => {
      // Solo añadir mensajes normales, no los de typing
      if (!message.isTyping) {
        // Asegurarnos que los mensajes de la IA se identifiquen correctamente
        const formattedMessage = {
          ...message,
          // Si el mensaje tiene marcador isAI, asegurarse que el username sea 'Asistente IA'
          username: message.isAI ? 'Asistente IA' : message.username,
        };
        setMessages((prevMessages) => [...prevMessages, formattedMessage]);
      }
    });

    return () => {
      socket.off('message_history');
      socket.off('receive_message');
    };
  }, [socket]);

  // Desplazarse al final de los mensajes cuando se recibe uno nuevo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Manejar el envío del formulario de unión
  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      alert('Por favor ingresa tu nombre');
      return;
    }

    if (socket) {
      socket.emit('join_room', { username, room });
      setIsJoined(true);
    } else {
      alert('Error de conexión. Por favor recarga la página.');
    }
  };

  // Manejar el envío de mensajes
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message.trim();
    
    // Enviar mensaje del usuario
    const newMessage = {
      username,
      room,
      message: userMessage,
      time: new Date().toISOString(),
    };

    socket.emit('send_message', newMessage);
    setMessage('');

    // Procesar con Ollama si está habilitado
    if (isAIAssistantEnabled && ollamaStatus === 'online') {
      try {
        // Indicador de que el asistente está escribiendo
        setIsAITyping(true);
        // En lugar de enviar un mensaje normal, solo actualizamos el estado local
        setMessages(prev => [...prev, {
          id: 'typing-indicator',
          username: 'Asistente IA',
          message: 'Escribiendo...',
          time: new Date().toISOString(),
          isAI: true,
          isTyping: true,
        }]);
        
        console.log(`Enviando mensaje a Ollama (modelo: ${selectedModel}): ${userMessage}`);
        const aiResponse = await OllamaService.chat(selectedModel, userMessage);
        console.log('Respuesta de Ollama:', aiResponse);
        
        // Eliminar el mensaje de "escribiendo"
        setMessages(prev => prev.filter(msg => msg.id !== 'typing-indicator'));
        setIsAITyping(false);
        
        if (aiResponse && aiResponse.message) {
          // Enviar respuesta real del asistente
          const aiMessage = {
            username: 'Asistente IA',
            room,
            message: aiResponse.message,
            time: new Date().toISOString(),
            isAI: true,
          };
          socket.emit('send_message', aiMessage);
        } else {
          // Mensaje de error si no hay respuesta
          socket.emit('send_message', {
            username: 'Asistente IA',
            room,
            message: 'Lo siento, no pude procesar tu solicitud en este momento.',
            time: new Date().toISOString(),
            isAI: true,
            isError: true,
          });
        }
      } catch (error) {
        console.error('Error al procesar mensaje con Ollama:', error);
        setIsAITyping(false);
        // Mensaje de error
        socket.emit('send_message', {
          username: 'Asistente IA',
          room,
          message: `Error: ${error.message || 'No se pudo conectar con el asistente IA'}`,
          time: new Date().toISOString(),
          isAI: true,
          isError: true,
        });
      }
    }
  };

  // Manejar cambio de modelo
  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  // Manejar activación/desactivación del asistente IA
  const handleToggleAI = () => {
    setIsAIAssistantEnabled(!isAIAssistantEnabled);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Asistente Clínico</h2>
      
      {/* Indicador de estado */}
      <div style={styles.statusIndicator}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: isConnected ? '#10B981' : '#EF4444',
        }}></div>
        <span>{isConnected ? 'Conectado al servidor' : 'Desconectado'}</span>
      </div>

      {ollamaStatus !== 'checking' && (
        <div style={styles.statusIndicator}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: ollamaStatus === 'online' ? '#10B981' : '#EF4444',
          }}></div>
          <span>Asistente IA {ollamaStatus === 'online' ? 'activo' : 'inactivo'}</span>
        </div>
      )}

      {!isJoined ? (
        // Formulario de unión
        <form onSubmit={handleJoinRoom} style={styles.joinForm}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tu nombre</label>
            <input
              type="text"
              placeholder="Ingresa tu nombre completo"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Sala de chat</label>
            <select
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              style={styles.select}
            >
              <option value="general">Sala General</option>
              <option value="consultas">Historial Clínico</option>
              <option value="emergencias">Evolución Clínica</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            style={styles.button}
            disabled={!isConnected}
          >
            Comenzar a chatear
          </button>
        </form>
      ) : (
        // Interfaz de chat
        <>
          {/* Selector de modelo y toggle de IA */}
          {ollamaStatus === 'online' && (
            <>
              <div style={styles.toggleContainer}>
                <label style={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={isAIAssistantEnabled}
                    onChange={handleToggleAI}
                    style={styles.toggleInput}
                  />
                  <span style={{
                    ...styles.toggleSlider,
                    ...(isAIAssistantEnabled ? styles.toggleSliderChecked : {}),
                  }}>
                    <span style={{
                      ...styles.toggleSliderBefore,
                      ...(isAIAssistantEnabled ? styles.toggleSliderBeforeChecked : {}),
                    }}></span>
                  </span>
                </label>
                <span>Asistente IA {isAIAssistantEnabled ? 'Activado' : 'Desactivado'}</span>
              </div>

              {isAIAssistantEnabled && ollamaModels.length > 0 && (
                <div style={styles.modelSelector}>
                  <label style={styles.label}>Modelo:</label>
                  <select
                    value={selectedModel}
                    onChange={handleModelChange}
                    style={styles.select}
                  >
                    {ollamaModels.map((model) => (
                      <option key={model.name} value={model.name}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          <div style={styles.messagesContainer}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#6B7280', padding: '20px' }}>
                No hay mensajes aún. ¡Sé el primero en escribir!
              </div>
            ) : (
              messages.map((msg, index) => {
                // Si es un mensaje de 'escribiendo', mostrarlo de forma diferente
                if (msg.id === 'typing-indicator') {
                  return (
                    <div
                      key={index}
                      style={{
                        ...styles.messageItem,
                        ...styles.aiMessage,
                        backgroundColor: '#F0FDF4',
                        opacity: 0.8,
                        padding: '8px 16px'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#047857'
                      }}>
                        <div style={{
                          backgroundColor: '#10B981',
                          color: 'white',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}>
                          AI
                        </div>
                        <div className="typing-indicator">
                          <span style={{
                            fontSize: '0.9rem',
                            fontStyle: 'italic'
                          }}>Escribiendo</span>
                          <span className="dots">
                            <span style={{
                              animation: 'typingDot 1.4s infinite',
                              animationDelay: '0s'
                            }}>.</span>
                            <span style={{
                              animation: 'typingDot 1.4s infinite',
                              animationDelay: '0.2s'
                            }}>.</span>
                            <span style={{
                              animation: 'typingDot 1.4s infinite',
                              animationDelay: '0.4s'
                            }}>.</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                // Mensaje normal
                return (
                  <div
                    key={index}
                    style={{
                      ...styles.messageItem,
                      ...(msg.isAI ? styles.aiMessage : 
                         msg.username === username ? styles.userMessage : styles.otherMessage)
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      fontWeight: 'bold', 
                      marginBottom: '8px',
                      fontSize: '0.95rem',
                      color: msg.isAI ? '#047857' : (msg.username === username ? '#1E40AF' : '#4B5563')
                    }}>
                      {msg.isAI ? (
                        <>
                          <div style={{
                            backgroundColor: '#10B981',
                            color: 'white',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '8px',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}>
                            IA
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{
                            backgroundColor: msg.username === username ? '#3B82F6' : '#6B7280',
                            color: 'white',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '8px',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}>
                            {msg.username.charAt(0).toUpperCase()}
                          </div>
                          {msg.username}
                        </>
                      )}
                    </div>
                    <div style={{
                      fontSize: '0.95rem',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap'
                    }}>{msg.message}</div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSendMessage} style={styles.messageForm}>
            <input
              type="text"
              placeholder="Escribe tu mensaje aquí..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={styles.messageInput}
              ref={messageInputRef}
              disabled={isAITyping}
            />
            <button 
              type="submit" 
              style={{
                ...styles.sendButton,
                opacity: isAITyping ? 0.7 : 1,
                cursor: isAITyping ? 'not-allowed' : 'pointer'
              }}
              disabled={isAITyping}
              title="Enviar mensaje"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13"></path>
                <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
              </svg>
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default OllamaChat;
