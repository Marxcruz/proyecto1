import express from "express";
import {
  getAllChatMessagesController,
  createChatMessageController,
  deleteChatMessageController
} from "../controller/chatController.js";
import { adminTokenAuth } from "../middleware/auth.js";

const router = express.Router();

// Obtener todos los mensajes de chat (con filtro opcional por sala)
// Accesible para todos los usuarios
router.get("/messages", getAllChatMessagesController);

// Crear un nuevo mensaje de chat (para uso sin Socket.IO)
// Accesible para todos los usuarios
router.post("/messages", createChatMessageController);

// Eliminar un mensaje de chat (solo admin)
router.delete("/messages/:id", adminTokenAuth, deleteChatMessageController);

export default router;
