import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { createServer } from "http";
import userRoutes from "./routes/userRoutes.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import cloudinary from "cloudinary";
import messageRoutes from "./routes/messageRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import healthCheckRoutes from "./routes/healthCheckRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import ollamaRoutes from "./routes/ollamaRoutes.js";
import configureSocket from "./socket.js";

const app = express();
const httpServer = createServer(app);

// cloudinary setup
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// all port from dotenv
const port = process.env.PORT;
const url = process.env.MONGO_URL;

// all middleware is here
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      process.env.DASHBOARD_URL,
      "http://localhost:3000",
      "http://localhost:3030",
      "http://localhost:5173",
      "http://localhost:5174"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Origin", "Cache-Control", "Pragma"],
  })
);

// Middleware para permitir solicitudes de cualquier origen en el endpoint de health-check
app.use("/api/v1", (req, res, next) => {
  if (req.path === "/health-check") {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    
    // Responder directamente a las solicitudes OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  }
  next();
});
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    tempFileDir: "/tmp/",
    useTempFiles: true,
  })
);
// database connection here
mongoose
  .connect(url)
  .then(() => {
    console.log("Conexion a la base de datos exitosa");
  })
  .catch((error) => console.log("Database Error is ", error));

// all routes here
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/message", messageRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1", healthCheckRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/ollama", ollamaRoutes);
// Configurar Socket.IO
const io = configureSocket(httpServer);

// Hacer que io sea accesible en las rutas
app.set('io', io);

// app listen here (usando httpServer en lugar de app.listen)
httpServer.listen(3030, () => {
  console.log(`Servidor escuchado en el PUERTO ${port} con Socket.IO habilitado`);
});

// last export in error MIddleware
app.use(errorMiddleware);
export default app;
