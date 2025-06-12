import express from "express";
import { createNote, getPatientNotes } from "../controller/clinicalNoteController.js";
import { doctorTokenAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", doctorTokenAuth, createNote);
router.get("/patient/:id", doctorTokenAuth, getPatientNotes);

export default router;
