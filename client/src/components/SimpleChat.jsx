import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import OllamaService from '../services/ollamaService.js';

const SimpleChat = () => {
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
      backgroundColor: '#f9fafb',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      height: '80vh',
    },
    header: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#3B82F6',
      textAlign: 'center',
      marginBottom: '20px',
    },
    statusIndicator: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginBottom: '15px',
      padding: '8px',
      backgroundColor: '#E5E7EB',
      borderRadius: '8px',
      fontSize: '0.9rem',
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
      padding: '10px 15px',
      borderRadius: '8px',
      maxWidth: '80%',
      wordBreak: 'break-word',
    },
    userMessage: {
      backgroundColor: '#EBF5FF',
      alignSelf: 'flex-end',
    },
    aiMessage: {
      backgroundColor: '#F0FDF4',
      alignSelf: 'flex-start',
      borderLeft: '3px solid #10B981',
    },
    otherMessage: {
      backgroundColor: '#F3F4F6',
      alignSelf: 'flex-start',
    },
    messageForm: {
      display: 'flex',
      gap: '10px',
    },
    messageInput: {
      flex: 1,
      padding: '12px 15px',
      borderRadius: '8px',
      border: '1px solid #E5E7EB',
      fontSize: '1rem',
    },
    sendButton: {
      backgroundColor: '#3B82F6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '0 15px',
      fontSize: '1rem',
      cursor: 'pointer',
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

  // Verificar el estado de Ollama - Optimizado
  useEffect(() => {
    const checkOllamaStatus = async () => {
      try {
        console.log('Verificando estado de Ollama...');
        const status = await OllamaService.checkStatus();
        console.log('Estado de Ollama:', status);
        setOllamaStatus(status.online ? 'online' : 'offline');
        if (status.online && status.models && status.models.length > 0) {
          setOllamaModels(status.models);
          // Seleccionar un modelo predeterminado optimizado
          const preferredModels = ['llama3:8b', 'llama3.1', 'mistral', 'gemma:7b'];
          const bestModel = status.models.find(m => 
            preferredModels.some(pm => m.name.toLowerCase().includes(pm.toLowerCase()))
          );
          setSelectedModel(bestModel ? bestModel.name : status.models[0].name);
          console.log('Modelo seleccionado:', bestModel ? bestModel.name : status.models[0].name);
        } else {
          console.warn('Ollama está en línea pero no se encontraron modelos');
        }
      } catch (error) {
        console.error('Error al verificar el estado de Ollama:', error);
        setOllamaStatus('offline');
      }
    };

    checkOllamaStatus();
    // Reducir frecuencia de verificación a cada 60 segundos para mejorar rendimiento
    const interval = setInterval(checkOllamaStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // Configurar eventos de Socket.IO
  useEffect(() => {
    if (!socket) return;

    socket.on('message_history', (history) => {
      setMessages(history);
    });

    socket.on('receive_message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
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
    }
  };
  
  // Manejar el envío de mensajes
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    if (socket) {
      const newMessage = {
        room,
        username,
        message,
        isAI: false
      };
      
      socket.emit('send_message', newMessage);
      setMessage('');
      messageInputRef.current?.focus();
      
      // Si el asistente IA está habilitado y en línea
      if (isAIAssistantEnabled && ollamaStatus === 'online') {
        setIsAITyping(true);
        socket.emit('ai_request', { room, message, model: selectedModel });
      }
    }
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
          <div style={styles.messagesContainer}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#6B7280', padding: '20px' }}>
                No hay mensajes aún. ¡Sé el primero en escribir!
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.messageItem,
                    ...(msg.isAI ? styles.aiMessage : 
                       msg.username === username ? styles.userMessage : styles.otherMessage)
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    {msg.username} {msg.isAI && '(IA)'}
                  </div>
                  <div>{msg.message}</div>
                </div>
              ))
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
            />
            <button type="submit" style={styles.sendButton}>
              Enviar
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default SimpleChat;
