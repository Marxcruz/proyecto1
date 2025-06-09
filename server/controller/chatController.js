import { errorHandleMiddleware } from "../middleware/errorHandleMiddleware.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import ChatService from "../services/chatService.js";

/**
 * Obtiene todos los mensajes de chat
 */
export const getAllChatMessagesController = errorHandleMiddleware(
  async (req, res, next) => {
    try {
      const { room, limit } = req.query;
      let messages;
      
      if (room) {
        messages = await ChatService.getMessagesByRoom(room, limit ? parseInt(limit) : 50);
      } else {
        messages = await ChatService.getAllMessages(limit ? parseInt(limit) : 100);
      }
      
      res.status(200).send({
        success: true,
        message: "Mensajes de chat obtenidos exitosamente",
        data: messages
      });
    } catch (error) {
      console.error('Error al obtener mensajes de chat:', error);
      return next(new ErrorHandler("Error al obtener mensajes de chat", 500));
    }
  }
);

/**
 * Crea un nuevo mensaje de chat (para uso sin Socket.IO)
 */
export const createChatMessageController = errorHandleMiddleware(
  async (req, res, next) => {
    try {
      const { username, message, room } = req.body;
      
      if (!username || !message) {
        return next(new ErrorHandler("El nombre de usuario y el mensaje son obligatorios", 400));
      }
      
      const savedMessage = await ChatService.saveMessage({
        username,
        message,
        room: room || 'general'
      });
      
      res.status(201).send({
        success: true,
        message: "Mensaje de chat creado exitosamente",
        data: savedMessage
      });
    } catch (error) {
      console.error('Error al crear mensaje de chat:', error);
      
      // Manejar errores de validación de Mongoose
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return next(new ErrorHandler(messages.join(', '), 400));
      }
      
      return next(new ErrorHandler("Error al crear el mensaje de chat", 500));
    }
  }
);

/**
 * Elimina un mensaje de chat
 */
export const deleteChatMessageController = errorHandleMiddleware(
  async (req, res, next) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        return next(new ErrorHandler("ID del mensaje no encontrado", 400));
      }
      
      const deletedMessage = await ChatService.deleteMessage(id);
      
      if (!deletedMessage) {
        return next(new ErrorHandler("Mensaje no encontrado", 404));
      }
      
      res.status(200).send({
        success: true,
        message: "Mensaje de chat eliminado exitosamente"
      });
    } catch (error) {
      console.error('Error al eliminar mensaje de chat:', error);
      return next(new ErrorHandler("Error al eliminar el mensaje de chat", 500));
    }
  }
);
