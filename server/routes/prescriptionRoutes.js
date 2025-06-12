import express from "express";
import { createPrescription, getPatientPrescriptions } from "../controller/prescriptionController.js";
import { doctorTokenAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", doctorTokenAuth, createPrescription);
router.get("/patient/:id", doctorTokenAuth, getPatientPrescriptions);

export default router;
