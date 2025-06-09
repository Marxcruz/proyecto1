import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import { errorHandleMiddleware } from "./errorHandleMiddleware.js";
import ErrorHandler from "./errorMiddleware.js";

export const patientTokenAuth = errorHandleMiddleware(
  async (req, res, next) => {
    const token = req.cookies.patientToken;
    if (!token) {
      return next(new ErrorHandler("Usuario no autenticado", 400));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (req.user.rol !== "Paciente") {
      return next(new ErrorHandler("Paciente no autorizado", 403));
    }
    next();
  }
);

// DOCTOR TOKEN
export const doctorTokenAuth = errorHandleMiddleware(async (req, res, next) => {
  try {
    const token = req.cookies.doctorToken;
    console.log('Cookie doctorToken:', token ? 'Presente' : 'Ausente');
    
    if (!token) {
      return next(new ErrorHandler("Doctor no autenticado", 400));
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('Token decodificado:', decoded);
    
    const user = await User.findById(decoded.id);
    console.log('Usuario encontrado:', user ? 'Sí' : 'No');
    
    if (!user) {
      return next(new ErrorHandler("Usuario no encontrado", 404));
    }
    
    if (user.rol !== "Doctor") {
      console.log(`Rol incorrecto: ${user.rol}, se esperaba: Doctor`);
      return next(new ErrorHandler("Doctor no autorizado", 403));
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Error en doctorTokenAuth:', error);
    return next(new ErrorHandler("Error de autenticación: " + error.message, 401));
  }
});

// Admin TOKEN
export const adminTokenAuth = errorHandleMiddleware(async (req, res, next) => {
  const token = req.cookies.adminToken;
  if (!token) {
    return next(new ErrorHandler("Administrador no autenticado", 400));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);
  if (req.user.rol !== "Administrador") {
    return next(new ErrorHandler("Administrador no autorizado", 403));
  }
  next();
});
