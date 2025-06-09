import express from "express";
import {
  createAdminController,
  createNewDoctorController,
  createUserController,
  deleteDoctorController,
  deletePatientController,
  getAllDoctorController,
  getAllPatientController,
  getSinglePtientController,
  getSingleDoctorController,
  getSingleAdminController,
  getPatientByIdController,
  logOutAdmin,
  logOutDoctor,
  logOutPatient,
  loginUserController,
} from "../controller/userController.js";
import {
  adminTokenAuth,
  doctorTokenAuth,
  patientTokenAuth,
} from "../middleware/auth.js";
const router = express.Router();

// create a user
router.post("/create-patient", createUserController);

// login routes
router.post("/login-user", loginUserController);

// add new admin
// only admin create a admin
// Temporalmente eliminado el middleware de autenticación para permitir pruebas
router.post("/create-new-admin", createAdminController);

// add new doctor
// only admin create a doctor
router.post("/create-new-doctor", adminTokenAuth, createNewDoctorController);

// get all doctor
router.get("/get-all-doctor", getAllDoctorController);

// get all patient
router.get("/get-all-patient", adminTokenAuth, getAllPatientController);

// get single patient
router.get("/single-patient", patientTokenAuth, getSinglePtientController);
// get single doctor
router.get("/single-doctor", doctorTokenAuth, getSingleDoctorController);
// get single admin
router.get("/single-admin", adminTokenAuth, getSingleAdminController);

// get patient by ID (for doctors)
router.get("/get-patient/:id", doctorTokenAuth, getPatientByIdController);

// logged Out admin
router.get("/logout-admin", adminTokenAuth, logOutAdmin);
// logged Out Patient
router.get("/logout-patient", patientTokenAuth, logOutPatient);
// LogOut Doctor
router.get("/logout-doctor", doctorTokenAuth, logOutDoctor);

// delete single doctor
router.delete("/delete/doctor/:id", adminTokenAuth, deleteDoctorController);
// delete single patient
router.delete("/delete/patient/:id", adminTokenAuth, deletePatientController);
export default router;
