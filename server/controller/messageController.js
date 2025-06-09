import { errorHandleMiddleware } from "../middleware/errorHandleMiddleware.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import Message from "../model/messageModel.js";

// message create
export const createMessageController = errorHandleMiddleware(
  async (req, res, next) => {
    try {
      console.log('Datos recibidos:', JSON.stringify(req.body, null, 2));
      
      // Crear un nuevo mensaje directamente con los datos recibidos
      const nuevoMensaje = await Message.create(req.body);
      
      console.log('Mensaje creado exitosamente:', nuevoMensaje);
      
      res.status(201).send({
        success: true,
        message: "Mensaje creado exitosamente",
      });
    } catch (error) {
      console.error('Error al crear mensaje:', error);
      
      // Manejar errores de validación de Mongoose
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return next(new ErrorHandler(messages.join(', '), 400));
      }
      
      return next(new ErrorHandler("Error al crear el mensaje", 500));
    }
  }
);

// get all message
export const getAllMessageController = errorHandleMiddleware(
  async (req, res, next) => {
    const message = await Message.find();
    if (!message || message.length === 0) {
      return next(new ErrorHandler("No se encontraron mensajes", 404));
    }
    res.status(200).send({
      success: true,
      message: "Mensajes obtenidos exitosamente",
      message,
    });
  }
);

// message delete
export const deleteMessageController = errorHandleMiddleware(
  async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
      return next(new ErrorHandler("ID del mensaje no encontrado", 400));
    }
    await Message.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Mensaje eliminado exitosamente",
    });
  }
);
