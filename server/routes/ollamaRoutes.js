import express from "express";
import {
  checkOllamaStatus,
  getOllamaModels,
  chatWithOllama,
  chatWithOllamaContext
} from "../controller/ollamaController.js";

const router = express.Router();

// Ruta para verificar el estado de Ollama
router.get("/status", checkOllamaStatus);

// Ruta para obtener los modelos disponibles
router.get("/models", getOllamaModels);

// Ruta para chatear con Ollama (mensaje u00fanico)
router.post("/chat", chatWithOllama);

// Ruta para chatear con Ollama (con contexto de conversaciu00f3n)
router.post("/chat/context", chatWithOllamaContext);

export default router;
