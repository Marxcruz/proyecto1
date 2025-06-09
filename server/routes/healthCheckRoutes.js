import express from "express";
const router = express.Router();

// Endpoint simple de verificación de estado
router.get("/health-check", (req, res) => {
  res.status(200).json({
    success: true,
    message: "El servidor está funcionando correctamente",
    timestamp: new Date().toISOString()
  });
});

export default router;
