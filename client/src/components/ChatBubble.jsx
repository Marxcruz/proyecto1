import React, { useState, useEffect, useRef } from 'react';
import OllamaChat from './OllamaChat';

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newMessageNotification, setNewMessageNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const notificationSound = useRef(null);

  useEffect(() => {
    // Crear elemento de audio para notificaciones
    notificationSound.current = new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=notification-sound-7062.mp3');
    notificationSound.current.volume = 0.5;
  }, []);

  // Estilos para la burbuja de chat con animaciones mejoradas
  const styles = {
    bubble: {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      zIndex: 1000,
    },
    chatButton: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: isButtonHovered ? '#2563EB' : '#3B82F6',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      boxShadow: isButtonHovered 
        ? '0 8px 16px rgba(37, 99, 235, 0.3), 0 0 0 6px rgba(59, 130, 246, 0.2)' 
        : '0 4px 8px rgba(0, 0, 0, 0.2)',
      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      transform: isButtonHovered ? 'scale(1.1)' : 'scale(1)',
    },
    chatIcon: {
      color: 'white',
      fontSize: '24px',
      transition: 'transform 0.3s ease',
      transform: isOpen ? 'rotate(360deg)' : 'rotate(0deg)',
    },
    chatWindow: {
      position: 'fixed',
      bottom: '100px',
      right: '30px',
      width: '350px',
      height: isMinimized ? '60px' : '500px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
      zIndex: 1000,
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
      transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0)',
      transformOrigin: 'bottom right',
      opacity: isOpen ? 1 : 0,
    },
    chatHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 15px',
      backgroundColor: '#3B82F6',
      color: 'white',
      borderTopLeftRadius: '12px',
      borderTopRightRadius: '12px',
    },
    chatTitle: {
      margin: 0,
      fontSize: '16px',
      fontWeight: 'bold',
    },
    chatControls: {
      display: 'flex',
      gap: '10px',
    },
    controlButton: {
      background: 'none',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      fontSize: '16px',
      padding: '2px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.2s ease',
    },
    chatContent: {
      height: 'calc(100% - 40px)',
      display: isMinimized ? 'none' : 'block',
    },
    badge: {
      position: 'absolute',
      top: '-5px',
      right: '-5px',
      backgroundColor: '#EF4444',
      color: 'white',
      borderRadius: '50%',
      width: '22px',
      height: '22px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '12px',
      fontWeight: 'bold',
      boxShadow: '0 2px 5px rgba(239, 68, 68, 0.5)',
      animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
    },
    notification: {
      position: 'fixed',
      bottom: '100px',
      right: '30px',
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '12px 15px',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)',
      zIndex: 999,
      maxWidth: '280px',
      animation: 'slideIn 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
      border: '1px solid #E5E7EB',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    notificationIcon: {
      backgroundColor: '#3B82F6',
      color: 'white',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '16px',
    },
    notificationContent: {
      flex: 1,
    },
    notificationTitle: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: '4px',
    },
    notificationText: {
      fontSize: '13px',
      color: '#4B5563',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    '@keyframes pulse': {
      '0%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.1)' },
      '100%': { transform: 'scale(1)' },
    },
    '@keyframes slideIn': {
      from: { opacity: 0, transform: 'translateX(20px)' },
      to: { opacity: 1, transform: 'translateX(0)' },
    },
    '@keyframes bounce': {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-10px)' },
    },
  };

  // Función para manejar nuevos mensajes
  const handleNewMessage = (message) => {
    if (!isOpen) {
      setUnreadCount((prev) => prev + 1);
      showNotification(message);
      
      // Reproducir sonido de notificación
      if (notificationSound.current) {
        notificationSound.current.play().catch(e => console.log('Error reproduciendo sonido:', e));
      }
    }
  };

  // Mostrar notificación de nuevo mensaje
  const showNotification = (message) => {
    setNotificationMessage(message.message);
    setNewMessageNotification(true);
    
    // Cerrar la notificación después de 4 segundos
    setTimeout(() => {
      setNewMessageNotification(false);
    }, 4000);
  };

  // Alternar la apertura/cierre del chat
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0); // Resetear contador al abrir
      setIsMinimized(false); // Asegurarse de que no esté minimizado al abrir
    }
  };

  // Alternar minimización del chat
  const toggleMinimize = (e) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  // Cerrar el chat
  const closeChat = (e) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  return (
    <div style={styles.bubble}>
      {/* Ventana de chat */}
      {isOpen && (
        <div style={styles.chatWindow}>
          <div style={styles.chatHeader}>
            <h3 style={styles.chatTitle}>Asistente Clínico</h3>
            <div style={styles.chatControls}>
              <button 
                style={styles.controlButton} 
                onClick={toggleMinimize}
                title={isMinimized ? "Expandir" : "Minimizar"}
              >
                {isMinimized ? '□' : '_'}
              </button>
              <button 
                style={styles.controlButton} 
                onClick={closeChat}
                title="Cerrar"
              >
                ✕
              </button>
            </div>
          </div>
          <div style={styles.chatContent}>
            <OllamaChat />
          </div>
        </div>
      )}

      {/* Botón de chat con animación */}
      <div 
        style={styles.chatButton} 
        onClick={toggleChat}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
      >
        <div style={styles.chatIcon}>
          {isOpen ? '✕' : '💬'}
        </div>
        {unreadCount > 0 && (
          <div style={styles.badge}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </div>

      {/* Notificación de nuevo mensaje mejorada */}
      {newMessageNotification && (
        <div style={styles.notification}>
          <div style={styles.notificationIcon}>💬</div>
          <div style={styles.notificationContent}>
            <div style={styles.notificationTitle}>Nuevo mensaje</div>
            <div style={styles.notificationText}>
              {notificationMessage || "Tienes un nuevo mensaje"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
