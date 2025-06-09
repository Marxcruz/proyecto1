import ChatMessage from '../model/chatModel.js';

/**
 * Servicio para manejar la lu00f3gica de negocio de los mensajes de chat
 */
export default class ChatService {
  /**
   * Guarda un nuevo mensaje en la base de datos
   * @param {Object} messageData - Datos del mensaje (username, message, room)
   * @returns {Promise<Object>} El mensaje guardado
   */
  static async saveMessage(messageData) {
    try {
      const newMessage = new ChatMessage(messageData);
      return await newMessage.save();
    } catch (error) {
      console.error('Error al guardar mensaje:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los mensajes de un room especu00edfico
   * @param {String} room - Nombre del room (por defecto "general")
   * @param {Number} limit - Nu00famero mu00e1ximo de mensajes a obtener (por defecto 50)
   * @returns {Promise<Array>} Lista de mensajes
   */
  static async getMessagesByRoom(room = 'general', limit = 50) {
    try {
      return await ChatMessage.find({ room })
        .sort({ createdAt: -1 })
        .limit(limit)
        .sort({ createdAt: 1 }); // Reordenar cronolu00f3gicamente despuu00e9s de limitar
    } catch (error) {
      console.error('Error al obtener mensajes:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los mensajes
   * @param {Number} limit - Nu00famero mu00e1ximo de mensajes a obtener (por defecto 100)
   * @returns {Promise<Array>} Lista de mensajes
   */
  static async getAllMessages(limit = 100) {
    try {
      return await ChatMessage.find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .sort({ createdAt: 1 }); // Reordenar cronolu00f3gicamente despuu00e9s de limitar
    } catch (error) {
      console.error('Error al obtener todos los mensajes:', error);
      throw error;
    }
  }

  /**
   * Elimina un mensaje por su ID
   * @param {String} messageId - ID del mensaje a eliminar
   * @returns {Promise<Object>} Resultado de la operaciu00f3n
   */
  static async deleteMessage(messageId) {
    try {
      return await ChatMessage.findByIdAndDelete(messageId);
    } catch (error) {
      console.error('Error al eliminar mensaje:', error);
      throw error;
    }
  }
}
