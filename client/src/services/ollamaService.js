import axios from 'axios';

const API_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3030';

/**
 * Servicio para interactuar con la API de Ollama
 */
class OllamaService {
  /**
   * Verifica el estado del servicio Ollama
   * @returns {Promise<Object>} Estado del servicio
   */
  static async checkStatus() {
    try {
      console.log('Enviando solicitud a:', `${API_URL}/api/v1/ollama/status`);
      const response = await axios.get(`${API_URL}/api/v1/ollama/status`);
      console.log('Respuesta del servidor:', response.data);
      
      // Asegurarse de que la respuesta tenga el formato correcto
      if (response.data && response.data.success) {
        return {
          online: response.data.online || false,
          models: response.data.models || []
        };
      } else {
        return { online: false, models: [] };
      }
    } catch (error) {
      console.error('Error al verificar el estado de Ollama:', error);
      return { online: false, models: [], error: error.message };
    }
  }

  /**
   * Obtiene la lista de modelos disponibles en Ollama
   * @returns {Promise<Array>} Lista de modelos
   */
  static async getModels() {
    try {
      const response = await axios.get(`${API_URL}/api/v1/ollama/models`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener modelos de Ollama:', error);
      throw error;
    }
  }

  /**
   * Envu00eda un mensaje al modelo de Ollama y obtiene una respuesta
   * @param {String} model - Nombre del modelo a utilizar
   * @param {String} prompt - Mensaje a enviar
   * @param {String} system - Mensaje del sistema (opcional)
   * @param {Object} options - Opciones adicionales (opcional)
   * @returns {Promise<Object>} Respuesta del modelo
   */
  static async chat(model, prompt, system = null, options = null) {
    console.log(`Enviando mensaje a Ollama (modelo: ${model}):`, prompt);
    
    // Solicitud simplificada al máximo para evitar errores
    const requestData = {
      model,
      prompt,
      stream: false
    };

    // Agregar mensaje del sistema solo si está presente
    if (system) {
      requestData.system = system;
    }
    
    // Ignoramos las opciones avanzadas por ahora para asegurar compatibilidad

    console.log('Datos de la solicitud:', requestData);

    try {
      const response = await axios.post(`${API_URL}/api/v1/ollama/chat`, requestData, {
        timeout: 60000 // 60 segundos de timeout
      });
      console.log('Respuesta de Ollama:', response.data);
      
      // Manejar tanto respuestas exitosas como errores que devuelven 200
      if (response.data && response.data.success) {
        return {
          success: true,
          message: response.data.response || 'No se recibió respuesta'
        };
      } else if (response.data && response.data.message) {
        // El servidor devolvió un error con estado 200 pero con success: false
        console.warn('Ollama respondió con un error controlado:', response.data.message);
        return {
          success: false,
          message: response.data.response || response.data.message || 'Error al procesar la solicitud'
        };
      } else {
        return { 
          success: false,
          message: 'Error: Respuesta inesperada del servidor' 
        };
      }
    } catch (error) {
      console.error('Error al chatear con Ollama:', error);
      
      let errorMessage = 'Error de conexión con el asistente IA';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'La respuesta tomó demasiado tiempo. Por favor intenta de nuevo.';
      } else if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        errorMessage = `Error ${error.response.status}: ${error.response.data?.message || error.message}`;
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        errorMessage = 'No se recibió respuesta del servidor. Verifica tu conexión.';
      }
      
      return { 
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Envía una conversación completa al modelo de Ollama
   * @param {String} model - Nombre del modelo a utilizar
   * @param {Array} messages - Array de mensajes (formato: [{role: 'user', content: 'mensaje'}, ...])
   * @param {String} system - Mensaje del sistema (opcional)
   * @returns {Promise<Object>} Respuesta del modelo
   */
  static async chatWithContext(model, messages, system = null) {
    try {
      const requestData = {
        model,
        messages
      };

      if (system) {
        requestData.system = system;
      }

      const response = await axios.post(
        `${API_URL}/api/v1/ollama/chat/context`,
        requestData
      );

      return response.data;
    } catch (error) {
      console.error('Error al chatear con Ollama (contexto):', error);
      throw error;
    }
  }
}

export default OllamaService;
