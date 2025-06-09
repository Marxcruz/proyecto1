import { Server } from 'socket.io';
import ChatService from './services/chatService.js';

/**
 * Configura y maneja las conexiones de Socket.IO
 * @param {Object} httpServer - Servidor HTTP de Express
 * @returns {Object} Instancia de Socket.IO
 */
const configureSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL, "http://localhost:5173", "http://localhost:5174"],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Usuarios conectados
  const connectedUsers = new Map();

  // Manejo de conexiones
  io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    // Unirse a una sala
    socket.on('join_room', (data) => {
      const { username, room = 'general' } = data;
      
      // Guardar información del usuario
      connectedUsers.set(socket.id, { username, room });
      
      // Unirse a la sala
      socket.join(room);
      
      // Enviar mensajes históricos al usuario
      ChatService.getMessagesByRoom(room)
        .then(messages => {
          socket.emit('message_history', messages);
        })
        .catch(error => {
          console.error('Error al obtener historial de mensajes:', error);
        });

      // Notificar a todos en la sala que un nuevo usuario se ha unido
      socket.to(room).emit('user_joined', {
        message: `${username} se ha unido a la sala`,
        timestamp: new Date()
      });

      console.log(`${username} se unió a la sala: ${room}`);
    });

    // Recibir y transmitir mensajes
    socket.on('send_message', async (data) => {
      // Extraer todos los datos del mensaje, incluyendo isAI si existe
      const { message, isAI, isTyping, isError } = data;
      const userInfo = connectedUsers.get(socket.id);
      
      // Si es un mensaje temporal de 'escribiendo', manejarlo de forma especial
      if (isTyping) {
        // No guardar mensajes de 'escribiendo' en la base de datos,
        // solo transmitirlos a la sala
        if (userInfo) {
          const { room } = userInfo;
          io.to(room).emit('receive_message', {
            ...data,
            timestamp: new Date()
          });
        }
        return;
      }
      
      if (!userInfo) {
        socket.emit('error', { message: 'Usuario no identificado' });
        return;
      }

      const { username, room } = userInfo;
      
      try {
        // Guardar mensaje en la base de datos incluyendo si es de IA
        const messageToSave = {
          username: data.username || username, // Usar el username del dato si existe
          message,
          room,
          isAI: !!isAI,  // Convertir a booleano
          isError: !!isError // Convertir a booleano
        };
        
        const savedMessage = await ChatService.saveMessage(messageToSave);

        // Enviar mensaje a todos en la sala preservando propiedades importantes
        io.to(room).emit('receive_message', {
          _id: savedMessage._id,
          username: data.username || username, // Preservar el nombre de usuario original
          message,
          room,
          isAI: !!isAI,  // Preservar si es un mensaje de IA
          isError: !!isError, // Preservar si es un mensaje de error
          timestamp: savedMessage.createdAt
        });

        console.log(`Mensaje enviado por ${username} en sala ${room}: ${message}`);
      } catch (error) {
        console.error('Error al procesar mensaje:', error);
        socket.emit('error', { message: 'Error al enviar mensaje' });
      }
    });

    // Recibir y retransmitir actualizaciones de estado de citas
    socket.on('appointment_status_updated', (data) => {
      console.log('Evento de actualización de cita recibido en el servidor:', data);
      // Retransmitir a todos los clientes conectados
      io.emit('appointment_status_updated', data);
    });

    // Usuario está escribiendo
    socket.on('typing', () => {
      const userInfo = connectedUsers.get(socket.id);
      if (userInfo) {
        const { username, room } = userInfo;
        socket.to(room).emit('user_typing', { username });
      }
    });

    // Usuario dejó de escribir
    socket.on('stop_typing', () => {
      const userInfo = connectedUsers.get(socket.id);
      if (userInfo) {
        const { username, room } = userInfo;
        socket.to(room).emit('user_stop_typing', { username });
      }
    });

    // Desconexión
    socket.on('disconnect', () => {
      const userInfo = connectedUsers.get(socket.id);
      if (userInfo) {
        const { username, room } = userInfo;
        
        // Notificar a la sala que el usuario se ha desconectado
        socket.to(room).emit('user_left', {
          message: `${username} ha salido de la sala`,
          timestamp: new Date()
        });
        
        // Eliminar usuario de la lista de conectados
        connectedUsers.delete(socket.id);
        
        console.log(`Usuario desconectado: ${username}`);
      }
    });
  });

  return io;
};

export default configureSocket;
