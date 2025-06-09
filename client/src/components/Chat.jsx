import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import OllamaService from '../services/ollamaService.js';

// Emojis para el selector
const emojiList = [
  '😊', '😂', '😍', '👍', '👋', '🙏', '❤️', '👨‍⚕️', '🏥', '💊', '💉', '🩺', '🧪',
  '😷', '🤒', '🤕', '🤢', '🤧', '🥴', '😴', '🤔', '👩‍⚕️', '🧑‍⚕️', '🩹', '🌡️', '⚕️'
];

// Estilos para el componente de chat mejorado
const chatStyles = {
  chatContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
    backgroundColor: '#fff',
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#3B82F6',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  headerIcon: {
    fontSize: '1.5rem',
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontSize: '0.875rem',
    color: '#10B981',
    marginBottom: '15px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10B981',
    animation: 'pulse 2s infinite',
  },
  messagesContainer: {
    height: '400px',
    overflowY: 'auto',
    padding: '15px',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    marginBottom: '20px',
    scrollBehavior: 'smooth',
    backgroundColor: '#F9FAFB',
  },
  messageItem: {
    marginBottom: '15px',
    padding: '12px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    position: 'relative',
    transition: 'transform 0.2s ease',
    animation: 'fadeIn 0.3s ease',
  },
  userMessage: {
    backgroundColor: '#3B82F6',
    color: 'white',
    marginLeft: 'auto',
    maxWidth: '80%',
    textAlign: 'right',
    borderBottomRightRadius: '4px',
  },
  otherMessage: {
    backgroundColor: 'white',
    color: '#374151',
    marginRight: 'auto',
    maxWidth: '80%',
    borderBottomLeftRadius: '4px',
    border: '1px solid #E5E7EB',
  },
  username: {
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  userAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#E5E7EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#4B5563',
  },
  messageText: {
    lineHeight: '1.5',
    wordBreak: 'break-word',
  },
  timestamp: {
    fontSize: '0.75rem',
    color: '#6B7280',
    marginTop: '5px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  inputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  input: {
    flex: '1',
    padding: '12px 45px 12px 15px',
    borderRadius: '24px',
    border: '1px solid #e5e7eb',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    '&:focus': {
      borderColor: '#3B82F6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)',
    },
  },
  emojiButton: {
    position: 'absolute',
    right: '60px',
    background: 'none',
    border: 'none',
    fontSize: '1.25rem',
    cursor: 'pointer',
    color: '#6B7280',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s ease',
    '&:hover': {
      color: '#3B82F6',
    },
  },
  emojiPicker: {
    position: 'absolute',
    bottom: '50px',
    right: '10px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    padding: '10px',
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '5px',
    zIndex: 10,
    animation: 'fadeIn 0.2s ease',
  },
  emojiItem: {
    fontSize: '1.25rem',
    cursor: 'pointer',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: '#F3F4F6',
    },
  },
  button: {
    padding: '12px',
    backgroundColor: '#3B82F6',
    color: 'white',
    border: 'none',
    borderRadius: '24px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    '&:hover': {
      backgroundColor: '#2563EB',
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
  },
  sendIcon: {
    fontSize: '1.25rem',
  },
  joinContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#F9FAFB',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  },
  joinHeader: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: '5px',
    textAlign: 'center',
  },
  joinDescription: {
    fontSize: '0.875rem',
    color: '#6B7280',
    marginBottom: '10px',
    textAlign: 'center',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 'medium',
    color: '#4B5563',
  },
  select: {
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontSize: '0.95rem',
    backgroundColor: 'white',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    '&:focus': {
      borderColor: '#3B82F6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)',
    },
  },
  joinButton: {
    padding: '12px 15px',
    backgroundColor: '#3B82F6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s ease',
    marginTop: '10px',
    '&:hover': {
      backgroundColor: '#2563EB',
    },
    '&:disabled': {
      backgroundColor: '#9CA3AF',
      cursor: 'not-allowed',
    },
  },
  typingIndicator: {
    fontSize: '0.875rem',
    color: '#6B7280',
    fontStyle: 'italic',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  typingDots: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  },
  typingDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#9CA3AF',
    animation: 'typingAnimation 1.4s infinite ease-in-out',
  },
  typingDot1: {
    animationDelay: '0s',
  },
  typingDot2: {
    animationDelay: '0.2s',
  },
  typingDot3: {
    animationDelay: '0.4s',
  },
  systemMessage: {
    textAlign: 'center',
    color: '#6B7280',
    fontStyle: 'italic',
    margin: '10px 0',
    padding: '8px 12px',
    backgroundColor: 'rgba(243, 244, 246, 0.7)',
    borderRadius: '8px',
    fontSize: '0.875rem',
  },
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  '@keyframes pulse': {
    '0%': { opacity: 0.6 },
    '50%': { opacity: 1 },
    '100%': { opacity: 0.6 },
  },
  '@keyframes typingAnimation': {
    '0%': { transform: 'scale(0.8)', opacity: 0.6 },
    '50%': { transform: 'scale(1)', opacity: 1 },
    '100%': { transform: 'scale(0.8)', opacity: 0.6 },
  },
};

const Chat = ({ inBubble = false, onNewMessage = () => {} }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('general');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('desconectado'); // conectando, conectado, desconectado
  
  // Estados para Ollama
  const [ollamaStatus, setOllamaStatus] = useState('checking'); // checking, online, offline, error
  const [ollamaModels, setOllamaModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('llama3:latest');
  const [isAIAssistantEnabled, setIsAIAssistantEnabled] = useState(true);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiConversation, setAiConversation] = useState([]);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messageInputRef = useRef(null);

  // Verificar el estado de Ollama y obtener modelos disponibles
  useEffect(() => {
    const checkOllamaStatus = async () => {
      try {
        setOllamaStatus('checking');
        const statusResponse = await OllamaService.checkStatus();
        
        if (statusResponse.success && statusResponse.data.status === 'online') {
          setOllamaStatus('online');
          
          // Obtener modelos disponibles
          try {
            const modelsResponse = await OllamaService.getModels();
            if (modelsResponse.success && modelsResponse.data) {
              setOllamaModels(modelsResponse.data);
              
              // Verificar si llama3 está disponible, si no, usar el primer modelo disponible
              const hasLlama3 = modelsResponse.data.some(model => model.name.includes('llama3'));
              if (!hasLlama3 && modelsResponse.data.length > 0) {
                setSelectedModel(modelsResponse.data[0].name);
              }
            }
          } catch (error) {
            console.error('Error al obtener modelos de Ollama:', error);
          }
        } else {
          setOllamaStatus('offline');
        }
      } catch (error) {
        console.error('Error al verificar el estado de Ollama:', error);
        setOllamaStatus('error');
      }
    };
    
    checkOllamaStatus();
  }, []);

  // Conectar al servidor de Socket.IO
  useEffect(() => {
    // Establecer estado de conexión como 'conectando'
    setConnectionStatus('conectando');
    
    // Usar la URL del servidor desde las variables de entorno
    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3030';
    const newSocket = io(serverUrl, {
      withCredentials: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    newSocket.on('connect', () => {
      console.log('Conectado al servidor de Socket.IO');
      setIsConnected(true);
      setConnectionStatus('conectado');
      setSocket(newSocket);
    });

    newSocket.on('disconnect', () => {
      console.log('Desconectado del servidor de Socket.IO');
      setIsConnected(false);
      setConnectionStatus('desconectado');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Error de conexión:', error);
      setConnectionStatus('error');
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Intento de reconexión ${attemptNumber}`);
      setConnectionStatus('reconectando');
    });

    newSocket.on('reconnect', () => {
      console.log('Reconectado al servidor');
      setConnectionStatus('conectado');
    });

    newSocket.on('reconnect_failed', () => {
      console.log('Falló la reconexión');
      setConnectionStatus('error');
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Configurar listeners de Socket.IO
  useEffect(() => {
    if (!socket) return;

    // Recibir historial de mensajes
    socket.on('message_history', (messageHistory) => {
      setMessages(messageHistory);
      scrollToBottom();
    });

    // Recibir nuevos mensajes
    socket.on('receive_message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      scrollToBottom();
      // Notificar sobre nuevo mensaje si viene de otro usuario
      if (newMessage.username !== username) {
        onNewMessage(newMessage);
      }
    });

    // Usuario se unió a la sala
    socket.on('user_joined', (data) => {
      const systemMessage = {
        _id: Date.now(),
        message: data.message,
        timestamp: data.timestamp,
        isSystem: true
      };
      setMessages((prevMessages) => [...prevMessages, systemMessage]);
      scrollToBottom();
    });

    // Usuario salió de la sala
    socket.on('user_left', (data) => {
      const systemMessage = {
        _id: Date.now(),
        message: data.message,
        timestamp: data.timestamp,
        isSystem: true
      };
      setMessages((prevMessages) => [...prevMessages, systemMessage]);
      scrollToBottom();
    });

    // Usuario está escribiendo
    socket.on('user_typing', ({ username }) => {
      setTypingUsers((prevUsers) => {
        if (!prevUsers.includes(username)) {
          return [...prevUsers, username];
        }
        return prevUsers;
      });
    });

    // Usuario dejó de escribir
    socket.on('user_stop_typing', ({ username }) => {
      setTypingUsers((prevUsers) => prevUsers.filter(user => user !== username));
    });

    // Errores
    socket.on('error', (error) => {
      console.error('Error de Socket.IO:', error);
      alert(`Error: ${error.message}`);
    });

    return () => {
      socket.off('message_history');
      socket.off('receive_message');
      socket.off('user_joined');
      socket.off('user_left');
      socket.off('user_typing');
      socket.off('user_stop_typing');
      socket.off('error');
    };
  }, [socket]);

  // Función para unirse a una sala
  const handleJoinRoom = (e) => {
    e.preventDefault();
    console.log('Joining room with:', { username, room });
    if (!username.trim() || !room.trim()) {
      alert('Por favor ingresa tu nombre y selecciona una sala');
      return;
    }
    
    if (socket) {
      socket.emit('join_room', { username, room });
      setIsJoined(true);
    } else {
      console.error('Socket no está inicializado');
      alert('Error de conexión. Por favor recarga la página.');
    }
  };

  // Función para agregar un emoji al mensaje
  const handleEmojiClick = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    // Enfocar el input después de seleccionar un emoji
    messageInputRef.current?.focus();
  };

  // Función para alternar el selector de emojis
  const toggleEmojiPicker = () => {
    setShowEmojiPicker(prev => !prev);
  };

  // Función para procesar un mensaje con Ollama
  const processWithOllama = async (userMessage) => {
    if (ollamaStatus !== 'online' || !isAIAssistantEnabled) return;
    
    try {
      setIsAIProcessing(true);
      
      // Preparar el mensaje del sistema para el contexto médico
      const systemMessage = 
        "Eres un asistente médico virtual en un sistema de gestión hospitalaria. "+
        "Proporciona información médica general, responde preguntas relacionadas con la salud, "+
        "y ayuda a los usuarios a entender temas médicos. No diagnostiques ni prescribas tratamientos específicos. "+
        "Siempre aclara que tus respuestas son informativas y que para casos específicos deben consultar a un profesional de la salud.";
      
      // Actualizar la conversación con el mensaje del usuario
      const updatedConversation = [
        ...aiConversation,
        { role: 'user', content: userMessage }
      ];
      setAiConversation(updatedConversation);
      
      // Enviar la conversación a Ollama
      const response = await OllamaService.chatWithContext(
        selectedModel,
        updatedConversation,
        systemMessage
      );
      
      if (response.success && response.data.message) {
        // Crear un mensaje del sistema con la respuesta de la IA
        const aiResponse = {
          _id: Date.now(),
          username: "Asistente Clínico IA",
          message: response.data.message.content,
          timestamp: new Date().toISOString(),
          isAI: true
        };
        
        // Agregar el mensaje de la IA a los mensajes del chat
        setMessages(prev => [...prev, aiResponse]);
        
        // Actualizar la conversación con la respuesta de la IA
        setAiConversation([...updatedConversation, response.data.message]);
        
        // Hacer scroll al final de los mensajes
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error al procesar mensaje con Ollama:', error);
      
      // Agregar un mensaje de error al chat
      const errorMessage = {
        _id: Date.now(),
        username: "Sistema",
        message: "Lo siento, ha ocurrido un error al procesar tu mensaje con el asistente IA.",
        timestamp: new Date().toISOString(),
        isSystem: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAIProcessing(false);
    }
  };

  // Función para enviar un mensaje
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (socket) {
      // Enviar el mensaje al chat
      socket.emit('send_message', { message });
      
      // Si el asistente IA está habilitado, procesar el mensaje
      if (isAIAssistantEnabled && ollamaStatus === 'online' && !message.startsWith('/')) {
        // Procesar con Ollama después de un breve retraso para que el mensaje del usuario aparezca primero
        setTimeout(() => {
          processWithOllama(message);
        }, 500);
      }
      
      setMessage('');
      // Indicar que dejó de escribir
      socket.emit('stop_typing');
      // Ocultar el selector de emojis si está abierto
      setShowEmojiPicker(false);
    }
  };

  // Función para manejar la escritura
  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!socket) return;

    // Limpiar el timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Emitir evento de escritura
    socket.emit('typing');

    // Establecer un nuevo timeout para dejar de escribir
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing');
    }, 1000);
  };

  // Función para obtener las iniciales del nombre de usuario
  const getUserInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Función para hacer scroll al final de los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  // Estilos condicionales basados en si está en la burbuja o no
  const containerStyle = inBubble
    ? { ...chatStyles.chatContainer, boxShadow: 'none', height: '100%', margin: 0, padding: '10px' }
    : chatStyles.chatContainer;

  // Estilos condicionales para el contenedor de mensajes
  const messagesContainerStyle = inBubble
    ? { ...chatStyles.messagesContainer, height: '320px' }
    : chatStyles.messagesContainer;
    
  // Estilo para el indicador de estado de Ollama
  const ollamaStatusStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontSize: '0.875rem',
    marginBottom: '10px',
    padding: '5px 10px',
    borderRadius: '20px',
    backgroundColor: ollamaStatus === 'online' ? 'rgba(16, 185, 129, 0.1)' : 
                     ollamaStatus === 'offline' ? 'rgba(239, 68, 68, 0.1)' : 
                     ollamaStatus === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(107, 114, 128, 0.1)',
    color: ollamaStatus === 'online' ? '#10B981' : 
           ollamaStatus === 'offline' ? '#EF4444' : 
           ollamaStatus === 'error' ? '#EF4444' : '#6B7280',
    border: `1px solid ${ollamaStatus === 'online' ? 'rgba(16, 185, 129, 0.2)' : 
                          ollamaStatus === 'offline' ? 'rgba(239, 68, 68, 0.2)' : 
                          ollamaStatus === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(107, 114, 128, 0.2)'}`,
  };

  // Estilo para el selector de modelos
  const modelSelectorStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    border: '1px solid rgba(59, 130, 246, 0.1)',
  };

  return (
    <div style={containerStyle}>
      <h2 style={{...chatStyles.header, fontSize: inBubble ? '1.2rem' : '1.5rem'}}>
        <span style={chatStyles.headerIcon}>💬</span>
        Asistente Clínico
      </h2>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        marginBottom: '15px'
      }}>
        {/* Indicador de estado de conexión del chat */}
        <div style={chatStyles.statusIndicator}>
          <div style={chatStyles.statusDot}></div>
          {connectionStatus === 'conectado' && 'Conectado al servidor'}
          {connectionStatus === 'conectando' && 'Conectando al servidor...'}
          {connectionStatus === 'reconectando' && 'Reconectando...'}
          {connectionStatus === 'desconectado' && 'Desconectado'}
          {connectionStatus === 'error' && 'Error de conexión'}
        </div>
        
        {/* Indicador de estado de Ollama */}
        <div style={ollamaStatusStyle}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: ollamaStatus === 'online' ? '#10B981' : 
                           ollamaStatus === 'offline' ? '#EF4444' : 
                           ollamaStatus === 'error' ? '#EF4444' : '#6B7280',
            animation: ollamaStatus === 'checking' ? 'pulse 2s infinite' : 'none',
          }}></div>
          {ollamaStatus === 'online' && 'Asistente IA activo'}
          {ollamaStatus === 'offline' && 'Asistente IA no disponible'}
          {ollamaStatus === 'checking' && 'Verificando estado del Asistente IA...'}
          {ollamaStatus === 'error' && 'Error al conectar con el Asistente IA'}
        </div>
      </div>
      
      {/* Selector de modelos de Ollama (solo visible si Ollama está online y hay modelos disponibles) */}
      {ollamaStatus === 'online' && ollamaModels.length > 0 && isJoined && (
        <div style={modelSelectorStyle}>
          <div style={{fontSize: '0.875rem', fontWeight: 'medium', color: '#4B5563'}}>
            Modelo IA:
          </div>
          <select 
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            style={{
              flex: 1,
              padding: '5px 10px',
              borderRadius: '6px',
              border: '1px solid #E5E7EB',
              fontSize: '0.875rem',
              backgroundColor: 'white',
            }}
          >
            {ollamaModels.map(model => (
              <option key={model.name} value={model.name}>
                {model.name}
              </option>
            ))}
          </select>
          
          <div 
            onClick={() => setIsAIAssistantEnabled(!isAIAssistantEnabled)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer',
              padding: '5px 10px',
              borderRadius: '6px',
              backgroundColor: isAIAssistantEnabled ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: isAIAssistantEnabled ? '#10B981' : '#EF4444',
              fontSize: '0.875rem',
              fontWeight: 'medium',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: isAIAssistantEnabled ? '#10B981' : '#EF4444',
              transition: 'all 0.2s ease',
            }}></div>
            {isAIAssistantEnabled ? 'Activado' : 'Desactivado'}
          </div>
        </div>
      )}

      {!isJoined ? (
            </div>
          ) : (
            messages.map((msg) => (
              msg.isSystem ? (
                <div key={msg._id} style={chatStyles.systemMessage}>
                  {msg.message}
                </div>
              ) : (
                <div
                  key={msg._id}
                  style={{
                    ...chatStyles.messageItem,
                    ...(msg.isAI ? {
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      color: '#1F2937',
                      marginRight: 'auto',
                      maxWidth: '85%',
                    } : (msg.username === username) ? chatStyles.userMessage : chatStyles.otherMessage)
                  }}
                >
                  <div style={{
                    ...chatStyles.username,
                    color: msg.isAI ? '#10B981' : 'inherit'
                  }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#6B7280',
                textAlign: 'center',
                padding: '20px'
              }}>
                <div style={{fontSize: '3rem', marginBottom: '15px'}}>💬</div>
                <div style={{fontWeight: 'bold', marginBottom: '5px'}}>No hay mensajes aún</div>
                <div>Sé el primero en enviar un mensaje en esta sala</div>
              </div>
            ) : (
              messages.map((msg) => (
                msg.isSystem ? (
                  <div key={msg._id} style={chatStyles.systemMessage}>
                    {msg.message}
                  </div>
                ) : (
                  <div
                    key={msg._id}
                    style={{
                      ...chatStyles.messageItem,
                      ...(msg.isAI ? {
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        color: '#1F2937',
                        marginRight: 'auto',
                        maxWidth: '85%',
                      } : (msg.username === username) ? chatStyles.userMessage : chatStyles.otherMessage)
                    }}
                  >
                    <div style={{
                      ...chatStyles.username,
                      color: msg.isAI ? '#10B981' : 'inherit'
                    }}>
                      <div style={{
                        ...chatStyles.userAvatar,
                        backgroundColor: msg.isAI ? 'rgba(16, 185, 129, 0.2)' : '#E5E7EB',
                        color: msg.isAI ? '#10B981' : '#4B5563',
                      }}>
                        {msg.isAI ? '🤖' : getUserInitials(msg.username)}
                      </div>
                      {msg.username}
                      {msg.isAI && (
                        <span style={{
                          fontSize: '0.75rem',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          color: '#10B981',
                          padding: '2px 6px',
                          borderRadius: '12px',
                          marginLeft: '5px'
                        }}>
                          IA
                        </span>
                      )}
                    </div>
                    <div style={chatStyles.messageText}>{msg.message}</div>
                    <div style={chatStyles.timestamp}>
                      <span>🕒</span> {formatDate(msg.timestamp || msg.createdAt)}
                      {isAIProcessing && msg.username === username && !messages.some(m => m.isAI && m._id > msg._id) && (
                        <span style={{
                          marginLeft: '8px',
                          fontSize: '0.75rem',
                          color: '#10B981',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <span>🤖</span>
                          Procesando...
                        </span>
                      )}
                    </div>
                  </div>
                )
              ))
            )}
            
            {typingUsers.length > 0 && (
              <div style={chatStyles.typingIndicator}>
                {typingUsers.length === 1 ? (
                  <>
                    <span>{typingUsers[0]} está escribiendo</span>
                    <div style={chatStyles.typingDots}>
                      <div style={{...chatStyles.typingDot, ...chatStyles.typingDot1}}></div>
                      <div style={{...chatStyles.typingDot, ...chatStyles.typingDot2}}></div>
                      <div style={{...chatStyles.typingDot, ...chatStyles.typingDot3}}></div>
                    </div>
                  </>
                ) : (
                  <>
                    <span>{typingUsers.join(', ')} están escribiendo</span>
                    <div style={chatStyles.typingDots}>
                      <div style={{...chatStyles.typingDot, ...chatStyles.typingDot1}}></div>
                      <div style={{...chatStyles.typingDot, ...chatStyles.typingDot2}}></div>
                      <div style={{...chatStyles.typingDot, ...chatStyles.typingDot3}}></div>
                    </div>
                  </>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} style={chatStyles.form}>
            <div style={chatStyles.inputContainer}>
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                value={message}
                onChange={handleTyping}
                style={chatStyles.input}
                ref={messageInputRef}
              />
              
              <button 
                type="button" 
                onClick={toggleEmojiPicker} 
                style={chatStyles.emojiButton}
                title="Insertar emoji"
              >
                😊
              </button>
              
              <button 
                type="submit" 
                style={chatStyles.button}
                title="Enviar mensaje"
                disabled={!message.trim()}
              >
                <span style={chatStyles.sendIcon}>➤</span>
              </button>
              
              {showEmojiPicker && (
                <div style={chatStyles.emojiPicker}>
                  {emojiList.map((emoji, index) => (
                    <div 
                      key={index} 
                      style={chatStyles.emojiItem} 
                      onClick={() => handleEmojiClick(emoji)}
                      title={`Emoji ${index + 1}`}
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default Chat;
