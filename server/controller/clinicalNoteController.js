import ClinicalNote from "../models/ClinicalNote.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import errorHandleMiddleware from "../middleware/errorHandleMiddleware.js";

// Crear una nueva nota clínica
export const createNote = errorHandleMiddleware(async (req, res, next) => {
  const { titulo, descripcion, diagnostico, tratamiento, medicamentos, pacienteId } = req.body;
  if (!titulo || !descripcion || !pacienteId) {
    return next(new ErrorHandler("Datos insuficientes para crear la nota", 400));
  }
  const doctorId = req.user._id;

  const note = await ClinicalNote.create({
    titulo,
    descripcion,
    diagnostico,
    tratamiento,
    medicamentos,
    pacienteId,
    doctorId,
  });

  res.status(201).json({ success: true, message: "Nota creada", note });
});

// Obtener notas de un paciente específico
export const getPatientNotes = errorHandleMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const notes = await ClinicalNote.find({ pacienteId: id }).sort({ fecha: -1 });
  res.status(200).json({ success: true, notes });
});
