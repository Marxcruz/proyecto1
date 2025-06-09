import axios from 'axios';
import { errorHandleMiddleware } from "../middleware/errorHandleMiddleware.js";
import ErrorHandler from "../middleware/errorMiddleware.js";

/**
 * Controlador para manejar las interacciones con Ollama
 */

// Obtener la URL base de Ollama desde las variables de entorno
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

/**
 * Verifica si el servicio Ollama está disponible
 */
export const checkOllamaStatus = errorHandleMiddleware(
  async (req, res, next) => {
    try {
      console.log('Verificando estado de Ollama en:', `${OLLAMA_BASE_URL}/api/tags`);
      const response = await axios.get(`${OLLAMA_BASE_URL}/api/tags`);
      console.log('Respuesta de Ollama:', response.data);
      
      // La respuesta de Ollama tiene un formato diferente, adaptamos la respuesta
      const models = response.data.models || [];
      
      res.status(200).json({
        success: true,
        message: "Servicio Ollama disponible",
        online: true,
        models: models
      });
    } catch (error) {
      console.error('Error al verificar el estado de Ollama:', error);
      console.error('Error completo:', error);
      res.status(200).json({
        success: false,
        message: "Servicio Ollama no disponible",
        online: false,
        error: error.message
      });
    }
  }
);

/**
 * Obtiene la lista de modelos disponibles en Ollama
 */
export const getOllamaModels = errorHandleMiddleware(
  async (req, res, next) => {
    try {
      const response = await axios.get(`${OLLAMA_BASE_URL}/api/tags`);
      
      res.status(200).json({
        success: true,
        message: "Modelos obtenidos exitosamente",
        data: response.data.models || []
      });
    } catch (error) {
      console.error('Error al obtener modelos de Ollama:', error);
      return next(new ErrorHandler("Error al obtener modelos de Ollama", 500));
    }
  }
);

/**
 * Envía un mensaje al modelo de Ollama y obtiene una respuesta
 */
export const chatWithOllama = errorHandleMiddleware(
  async (req, res, next) => {
    try {
      const { model, prompt, system } = req.body;
      
      if (!model || !prompt) {
        return next(new ErrorHandler("Se requiere un modelo y un mensaje", 400));
      }
      
      // Solicitud simplificada para evitar problemas con la estructura
      const ollamaRequestData = {
        model: model,
        prompt: prompt,
        stream: false
      };
      
      // Agregar sistema solo si está presente
      if (system) {
        ollamaRequestData.system = system;
      }
      
      console.log('Enviando solicitud básica a Ollama:', ollamaRequestData);
      
      // Solicitud simplificada sin opciones adicionales
      const response = await axios.post(
        `${OLLAMA_BASE_URL}/api/generate`, 
        ollamaRequestData,
        { timeout: 60000 }  // Ampliar timeout a 60 segundos
      );
      
      console.log('Respuesta de Ollama - status:', response.status);
      console.log('Respuesta de Ollama - contenido:', response.data);
      
      // Verificar que la respuesta tenga la estructura esperada
      if (response.data && response.data.response) {
        res.status(200).json({
          success: true,
          message: "Respuesta generada exitosamente",
          response: response.data.response,
          model: model
        });
      } else {
        // Si la respuesta no tiene la estructura esperada, devolver un error genérico
        console.error('Respuesta inesperada de Ollama:', response.data);
        res.status(200).json({
          success: false,
          message: "El servidor Ollama respondió en un formato inesperado",
          response: "Lo siento, no pude procesar tu solicitud. Inténtalo de nuevo.",
          model: model
        });
      }
    } catch (error) {
      console.error('Error al chatear con Ollama:', error);
      
      // Manejar explicitamente los errores para proporcionar mejor feedback
      let errorMessage = "Error al comunicarse con Ollama";
      let statusCode = 500;
      
      if (error.code === 'ECONNREFUSED') {
        errorMessage = "No se pudo conectar al servidor Ollama. Asegúrate de que Ollama esté ejecutándose.";
      } else if (error.code === 'ETIMEDOUT') {
        errorMessage = "La conexión con Ollama ha expirado. Puede que el modelo sea demasiado grande o el sistema esté sobrecargado.";
      } else if (error.response) {
        errorMessage = `Error del servidor Ollama: ${error.response.data?.error || error.response.statusText}`;
        statusCode = error.response.status;
      }
      
      // Devolver un error que el cliente pueda manejar
      res.status(200).json({
        success: false,
        message: errorMessage,
        response: "Lo siento, no pude procesar tu solicitud debido a un error. Por favor, inténtalo de nuevo más tarde.",
        error: error.message
      });
    }
  }
);

/**
 * Envía un mensaje al modelo de Ollama para chat con contexto
 */
export const chatWithOllamaContext = errorHandleMiddleware(
  async (req, res, next) => {
    try {
      const { model, messages, system } = req.body;
      
      if (!model || !messages || !Array.isArray(messages)) {
        return next(new ErrorHandler("Se requiere un modelo y mensajes en formato de array", 400));
      }
      
      // Configurar la solicitud para Ollama
      const requestData = {
        model: model,
        messages: messages,
        stream: false
      };
      
      // Agregar mensaje del sistema si está presente
      if (system) {
        requestData.system = system;
      }
      
      // Realizar la solicitud a la API de Ollama
      const response = await axios.post(
        `${OLLAMA_BASE_URL}/api/chat`, 
        requestData,
        { timeout: 60000 } // 60 segundos de timeout
      );
      
      console.log('Respuesta de Ollama (chat):', response.data);
      
      res.status(200).json({
        success: true,
        message: "Respuesta de chat generada exitosamente",
        response: response.data.message?.content || response.data.response,
        model: model
      });
    } catch (error) {
      console.error('Error al chatear con Ollama (contexto):', error);
      return next(new ErrorHandler("Error al comunicarse con Ollama: " + (error.response?.data?.error || error.message), 500));
    }
  }
);
