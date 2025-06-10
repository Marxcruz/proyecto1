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
  console.log('Middleware adminTokenAuth:');
  if (!token) {
    console.log('⛔ Cookie adminToken: Ausente');
    return next(new ErrorHandler("Administrador no autenticado", 400));
  } else {
    console.log('✅ Cookie adminToken: Presente');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('✅ Token decodificado:', decoded);
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('⛔ Usuario no encontrado');
      return next(new ErrorHandler("Usuario no encontrado", 404));
    }
    if (user.rol !== "Administrador") {
      console.log(`⛔ Rol incorrecto: ${user.rol}, se esperaba: Administrador`);
      return next(new ErrorHandler("Administrador no autorizado", 403));
    }
    req.user = user;
    console.log('✅ Usuario autenticado como Administrador:', user.correo);
    next();
  } catch (error) {
    console.log('⛔ Error al verificar token:', error.message);
    return next(new ErrorHandler("Token inválido o expirado", 401));
  }
})
