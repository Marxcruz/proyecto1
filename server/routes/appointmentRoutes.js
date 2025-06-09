import express from "express";
import {
  createAppointmentController,
  deleteAppointmentController,
  getAllAppointmentController,
  updateAppointmentController,
  getDoctorAppointmentsController,
  getDoctorPatientsController,
  getPatientAppointmentsController,
  updateAppointmentDoctors,
  updateAppointmentStatusController
} from "../controller/appointmentController.js";
import { adminTokenAuth, patientTokenAuth, doctorTokenAuth } from "../middleware/auth.js";

const router = express.Router();

// create appointment
// Temporalmente removido el middleware de autenticación para permitir pruebas
router.post("/create-appointment", createAppointmentController);

// get all appointment
// Temporalmente removido el middleware de autenticaciu00f3n para permitir pruebas
router.get("/get-all-appointment", getAllAppointmentController);

// delete a single appointment
router.delete(
  "/delete-appointment/:id",
  adminTokenAuth,
  deleteAppointmentController
);

router.put(
  "/update-status-appointment/:id",
  adminTokenAuth,
  updateAppointmentController
);

// Rutas para el dashboard de doctores
// Obtener todas las citas de un doctor específico filtradas por su especialidad
router.get(
  "/doctor-appointments",
  doctorTokenAuth, // Restauramos la autenticación para poder identificar al doctor
  getDoctorAppointmentsController
);

// Obtener todos los pacientes de un doctor específico
router.get(
  "/doctor-patients",
  doctorTokenAuth,
  getDoctorPatientsController
);

// Actualizar estado de cita (confirmar/rechazar) - para uso de doctores
// Temporalmente removido el middleware de autenticación para permitir pruebas
router.put(
  "/doctor-update-appointment/:id",
  updateAppointmentStatusController
);

// Obtener todas las citas de un paciente específico (para historial clínico) - para uso de doctores
router.get(
  "/patient-appointments/:id",
  doctorTokenAuth,
  getPatientAppointmentsController
);

// Obtener las citas del paciente actual logueado - para uso del dashboard de pacientes
router.get(
  "/my-appointments",
  patientTokenAuth,
  getPatientAppointmentsController
);

// Actualizar doctores en citas existentes que tienen 'Por asignar'
router.get(
  "/update-doctors",
  updateAppointmentDoctors
);

export default router;
